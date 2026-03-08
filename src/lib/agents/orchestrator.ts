// ─── Orchestrator ──────────────────────────────────────
// The execution engine behind the Executive Producer.
// Routes tasks to agents, executes handoff chains,
// and consolidates results.
//
// Dual-mode execution:
// - Direct: Ollama/OpenAI calls (no real tools)
// - OpenClaw: Gateway-backed agents with real tools (fs, exec, web, browser, image)
//
// Laptop mode: sequential inline execution.
// Studio mode: can parallelize independent steps.

import { v4 as uuid } from 'uuid';
import { getConfig } from '../config';
import { getAgentRegistry } from './registry';
import { buildProductionContext } from './context';
import { isOpenClawAvailable, checkGatewayHealth } from './openclaw-client';
import type { AgentExecutionMode } from './base-agent';
import type {
  AgentTask,
  AgentResult,
  AgentTaskType,
  AgentRole,
  AgentInvokeRequest,
  OrchestrateRequest,
  OrchestratorPlan,
  OrchestratorStep,
  ProductionContext,
  HandoffRequest,
} from './types';
import { TASK_AGENT_MAP } from './types';

/** Resolve the execution mode — auto-detects OpenClaw gateway */
async function resolveMode(requested?: AgentExecutionMode): Promise<AgentExecutionMode> {
  if (requested === 'direct' || requested === 'openclaw') return requested;
  if (process.env.OPENCLAW_ENABLED === 'true' && await isOpenClawAvailable()) return 'openclaw';
  return 'direct';
}

// ─── Direct Agent Invocation ───────────────────────────
// Route a single task to the correct agent and execute.

export async function invokeAgent(request: AgentInvokeRequest): Promise<AgentResult> {
  const registry = getAgentRegistry();
  const agent = registry.getAgentForTask(request.taskType);

  if (!agent) {
    throw new Error(`No agent registered for task type: ${request.taskType}`);
  }

  const mode = await resolveMode(request.mode);

  // Build production context if ID provided
  let productionContext: ProductionContext | undefined;
  if (request.productionId) {
    const ctx = await buildProductionContext(request.productionId);
    if (ctx) productionContext = ctx;
  }

  const task: AgentTask = {
    id: uuid(),
    type: request.taskType,
    goal: request.goal,
    productionContext,
    platform: request.platform,
    instructions: request.instructions,
    priority: 'normal',
    createdAt: new Date().toISOString(),
  };

  return agent.execute(task, mode);
}

// ─── Orchestrated Execution ────────────────────────────
// Executive Producer decomposes a high-level goal into
// a multi-agent plan and executes it.

export async function orchestrate(request: OrchestrateRequest): Promise<{
  plan: OrchestratorPlan;
  results: AgentResult[];
}> {
  const registry = getAgentRegistry();
  const ep = registry.getAgent('executive-producer');
  if (!ep) throw new Error('Executive Producer agent not registered');

  // Build production context if available
  let productionContext: ProductionContext | undefined;
  if (request.productionId) {
    const ctx = await buildProductionContext(request.productionId);
    if (ctx) productionContext = ctx;
  }

  // Step 1: Ask EP to analyze the goal and create a plan
  const planningTask: AgentTask = {
    id: uuid(),
    type: 'next-steps',
    goal: request.goal,
    productionContext,
    priority: request.priority || 'normal',
    createdAt: new Date().toISOString(),
  };

  const mode = await resolveMode(request.mode);

  const planResult = await ep.execute(planningTask, mode);
  const results: AgentResult[] = [planResult];

  // Step 2: Build orchestration plan from EP's output
  const plan: OrchestratorPlan = {
    goal: request.goal,
    productionId: request.productionId,
    steps: [],
    createdAt: new Date().toISOString(),
  };

  // Step 3: Execute handoffs from EP's plan
  if (planResult.handoffs.length > 0) {
    const config = getConfig();
    const maxConcurrent = config.runtime.maxConcurrentAI;

    // Laptop mode: execute sequentially
    // Studio mode: could batch independent steps
    for (const handoff of planResult.handoffs) {
      const step: OrchestratorStep = {
        order: plan.steps.length + 1,
        agentRole: handoff.toAgent,
        taskType: handoff.taskType,
        goal: handoff.goal,
        dependsOn: [],
        status: 'pending',
      };
      plan.steps.push(step);

      const agent = registry.getAgent(handoff.toAgent);
      if (!agent) {
        step.status = 'failed';
        continue;
      }

      step.status = 'in-progress';

      const handoffTask: AgentTask = {
        id: uuid(),
        type: handoff.taskType,
        goal: handoff.goal,
        productionContext,
        instructions: handoff.context,
        parentTaskId: planResult.taskId,
        priority: handoff.priority,
        createdAt: new Date().toISOString(),
      };

      const handoffResult = await agent.execute(handoffTask, mode);
      results.push(handoffResult);
      step.status = handoffResult.status === 'failed' ? 'failed' : 'completed';
      step.resultId = handoffResult.taskId;

      // Don't cascade more than one level deep in laptop mode
      // to keep execution time bounded
      if (maxConcurrent <= 1) continue;

      // In studio mode, execute second-level handoffs
      for (const subHandoff of handoffResult.handoffs) {
        const subStep: OrchestratorStep = {
          order: plan.steps.length + 1,
          agentRole: subHandoff.toAgent,
          taskType: subHandoff.taskType,
          goal: subHandoff.goal,
          dependsOn: [step.order],
          status: 'pending',
        };
        plan.steps.push(subStep);

        const subAgent = registry.getAgent(subHandoff.toAgent);
        if (!subAgent) {
          subStep.status = 'failed';
          continue;
        }

        subStep.status = 'in-progress';
        const subTask: AgentTask = {
          id: uuid(),
          type: subHandoff.taskType,
          goal: subHandoff.goal,
          productionContext,
          instructions: subHandoff.context,
          parentTaskId: handoffResult.taskId,
          priority: subHandoff.priority,
          createdAt: new Date().toISOString(),
        };

        const subResult = await subAgent.execute(subTask, mode);
        results.push(subResult);
        subStep.status = subResult.status === 'failed' ? 'failed' : 'completed';
        subStep.resultId = subResult.taskId;
      }
    }
  }

  return { plan, results };
}

// ─── Utility: Get agent info for UI ────────────────────

export interface AgentInfo {
  role: AgentRole;
  displayName: string;
  description: string;
  capabilities: AgentTaskType[];
}

export function getAgentDirectory(): AgentInfo[] {
  const registry = getAgentRegistry();
  return registry.getAllAgents().map((agent) => ({
    role: agent.role,
    displayName: agent.displayName,
    description: agent.description,
    capabilities: agent.capabilities,
  }));
}

export function getTaskTypes(): { taskType: AgentTaskType; agentRole: AgentRole }[] {
  return Object.entries(TASK_AGENT_MAP).map(([taskType, agentRole]) => ({
    taskType: taskType as AgentTaskType,
    agentRole,
  }));
}

/** Get OpenClaw gateway status for diagnostics */
export async function getOpenClawStatus(): Promise<{
  available: boolean;
  mode: AgentExecutionMode;
  gateway?: { version?: string; agents?: string[] };
}> {
  const health = await checkGatewayHealth();
  const mode = await resolveMode();
  return {
    available: health.ok,
    mode,
    gateway: health.ok ? { version: health.version, agents: health.agents } : undefined,
  };
}
