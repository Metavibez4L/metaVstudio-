// ─── OpenClaw Gateway Client ───────────────────────────
// Communicates with the OpenClaw Gateway to invoke agents
// that have real tooling (fs, exec, web, browser, image, etc.)

import type { AgentRole, AgentTaskType, AgentResult, AgentOutput, GenericAgentOutput } from './types';
import { AGENT_DISPLAY_NAMES } from './types';

// ─── OpenClaw Config ───────────────────────────────────

export interface OpenClawConfig {
  gatewayUrl: string;
  gatewayToken?: string;
  timeoutMs: number;
}

const DEFAULT_CONFIG: OpenClawConfig = {
  gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789',
  gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN,
  timeoutMs: parseInt(process.env.OPENCLAW_TIMEOUT_MS || '120000', 10),
};

export function getOpenClawConfig(): OpenClawConfig {
  return { ...DEFAULT_CONFIG };
}

// ─── Gateway HTTP Client ───────────────────────────────

async function gatewayFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const config = getOpenClawConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.gatewayToken ? { Authorization: `Bearer ${config.gatewayToken}` } : {}),
  };

  const url = `${config.gatewayUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
    signal: AbortSignal.timeout(config.timeoutMs),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenClaw gateway error ${res.status}: ${body}`);
  }

  return res;
}

// ─── Agent Invocation via sessions_spawn ───────────────

export interface OpenClawSpawnRequest {
  agentId: string;
  task: string;
  label?: string;
  mode?: 'run' | 'session';
  runTimeoutSeconds?: number;
}

export interface OpenClawSpawnResult {
  sessionKey: string;
  status: 'accepted' | 'ok' | 'error';
  result?: string;
}

/** Spawn an agent run through the OpenClaw gateway */
export async function spawnAgentRun(request: OpenClawSpawnRequest): Promise<OpenClawSpawnResult> {
  const res = await gatewayFetch('/api/v1/sessions/spawn', {
    method: 'POST',
    body: JSON.stringify({
      agentId: request.agentId,
      task: request.task,
      label: request.label || `metavstudio-${request.agentId}`,
      mode: request.mode || 'run',
      runtime: 'subagent',
      runTimeoutSeconds: request.runTimeoutSeconds || 120,
    }),
  });

  return res.json();
}

/** Send a message to an existing agent session */
export async function sendToSession(sessionKey: string, message: string, timeoutSeconds = 60): Promise<string> {
  const res = await gatewayFetch('/api/v1/sessions/send', {
    method: 'POST',
    body: JSON.stringify({
      sessionKey,
      message,
      timeoutSeconds,
    }),
  });

  const data = await res.json();
  return data.result || data.message || '';
}

/** List active agent sessions */
export async function listSessions(): Promise<Array<{ sessionKey: string; agentId: string; status: string }>> {
  const res = await gatewayFetch('/api/v1/sessions/list', { method: 'POST', body: JSON.stringify({}) });
  const data = await res.json();
  return data.sessions || [];
}

/** Get session status */
export async function getSessionStatus(sessionKey?: string): Promise<{ status: string; agentId?: string; model?: string }> {
  const res = await gatewayFetch('/api/v1/sessions/status', {
    method: 'POST',
    body: JSON.stringify({ sessionKey }),
  });
  return res.json();
}

// ─── Gateway Health ────────────────────────────────────

export async function checkGatewayHealth(): Promise<{ ok: boolean; version?: string; agents?: string[] }> {
  try {
    const res = await gatewayFetch('/health');
    const data = await res.json();
    return { ok: true, version: data.version, agents: data.agents };
  } catch {
    return { ok: false };
  }
}

// ─── Agent Task Execution (high-level) ─────────────────

/** Build the task prompt that gets sent to an OpenClaw agent */
function buildAgentTaskPrompt(
  taskType: AgentTaskType,
  goal: string,
  contextSerialized?: string,
  platform?: string,
  instructions?: string,
): string {
  const parts: string[] = [
    `## Task: ${taskType}`,
    `**Goal:** ${goal}`,
  ];

  if (platform) parts.push(`**Target Platform:** ${platform}`);
  if (instructions) parts.push(`**Additional Instructions:** ${instructions}`);

  if (contextSerialized) {
    parts.push('', '## Production Context', contextSerialized);
  }

  parts.push(
    '',
    '## Output Requirements',
    'Respond with structured JSON wrapped in ```json code blocks.',
    `Include "kind": "${taskTypeToOutputKind(taskType)}" and a "summary" field.`,
  );

  return parts.join('\n');
}

function taskTypeToOutputKind(taskType: AgentTaskType): string {
  return taskType;
}

/** Parse agent output from raw text response */
function parseAgentOutput(taskType: AgentTaskType, raw: string): AgentOutput {
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.kind) return parsed as AgentOutput;
      return { ...parsed, kind: taskTypeToOutputKind(taskType) } as AgentOutput;
    } catch { /* fall through */ }
  }
  const firstParagraph = raw.split('\n\n')[0] || raw.slice(0, 200);
  return { kind: 'generic', content: raw, summary: firstParagraph.slice(0, 300) } as GenericAgentOutput;
}

/** Execute a task via OpenClaw agent with real tooling */
export async function executeViaOpenClaw(
  agentRole: AgentRole,
  taskType: AgentTaskType,
  goal: string,
  options?: {
    contextSerialized?: string;
    platform?: string;
    instructions?: string;
    timeoutSeconds?: number;
  },
): Promise<AgentResult> {
  const startedAt = new Date().toISOString();
  const agentId = agentRole; // OpenClaw agent IDs match our role names

  try {
    const prompt = buildAgentTaskPrompt(
      taskType,
      goal,
      options?.contextSerialized,
      options?.platform,
      options?.instructions,
    );

    const spawnResult = await spawnAgentRun({
      agentId,
      task: prompt,
      label: `${taskType}-${Date.now()}`,
      runTimeoutSeconds: options?.timeoutSeconds || 120,
    });

    // For 'run' mode, the result comes back directly
    const raw = spawnResult.result || '';
    const output = parseAgentOutput(taskType, raw);

    return {
      taskId: `oc-${agentId}-${Date.now()}`,
      agentRole,
      status: 'success',
      output,
      handoffs: [],
      meta: {
        startedAt,
        completedAt: new Date().toISOString(),
        model: 'openclaw',
      },
    };
  } catch (err) {
    return {
      taskId: `oc-${agentId}-${Date.now()}`,
      agentRole,
      status: 'failed',
      output: {
        kind: 'generic',
        content: '',
        summary: err instanceof Error ? err.message : 'OpenClaw agent execution failed',
      },
      handoffs: [],
      meta: { startedAt, completedAt: new Date().toISOString() },
    };
  }
}

/** Check if OpenClaw gateway is available */
export async function isOpenClawAvailable(): Promise<boolean> {
  const health = await checkGatewayHealth();
  return health.ok;
}
