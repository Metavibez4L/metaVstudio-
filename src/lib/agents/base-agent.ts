// ─── Base Agent ────────────────────────────────────────
// Shared foundation for all production agents.
// Supports dual execution: direct Ollama/OpenAI or OpenClaw gateway.
// OpenClaw mode gives agents real tools (fs, exec, web, browser, image).

import { v4 as uuid } from 'uuid';
import { getProviderForTask } from '../ai/provider';
import type { AIMessage } from '../types';
import type {
  AgentRole,
  AgentTask,
  AgentResult,
  AgentOutput,
  AgentTaskType,
  HandoffRequest,
  ProductionAgent,
  GenericAgentOutput,
} from './types';
import { AGENT_DISPLAY_NAMES } from './types';
import { serializeContext } from './context';
import { executeViaOpenClaw, isOpenClawAvailable } from './openclaw-client';

export type AgentExecutionMode = 'direct' | 'openclaw' | 'auto';

export abstract class BaseAgent implements ProductionAgent {
  abstract readonly role: AgentRole;
  abstract readonly description: string;
  abstract readonly capabilities: AgentTaskType[];

  /** Agent-specific system prompt — defines identity and boundaries */
  protected abstract readonly systemPrompt: string;

  get displayName(): string {
    return AGENT_DISPLAY_NAMES[this.role];
  }

  canHandle(taskType: AgentTaskType): boolean {
    return this.capabilities.includes(taskType);
  }

  async execute(task: AgentTask, mode?: AgentExecutionMode): Promise<AgentResult> {
    const executionMode = mode || (process.env.OPENCLAW_ENABLED === 'true' ? 'auto' : 'direct');

    // OpenClaw mode — delegates to gateway where agents have real tools
    if (executionMode === 'openclaw' || (executionMode === 'auto' && await isOpenClawAvailable())) {
      return this.executeViaOpenClaw(task);
    }

    // Direct mode — calls Ollama/OpenAI directly (no tools)
    return this.executeDirect(task);
  }

  /** Execute through OpenClaw gateway — agents get real tools */
  private async executeViaOpenClaw(task: AgentTask): Promise<AgentResult> {
    const contextSerialized = task.productionContext
      ? serializeContext(task.productionContext)
      : undefined;

    const result = await executeViaOpenClaw(this.role, task.type, task.goal, {
      contextSerialized,
      platform: task.platform,
      instructions: task.instructions,
    });

    // Merge in handoff detection from local logic
    const handoffs = this.detectHandoffs(task, result.output);
    if (handoffs.length > 0) {
      result.handoffs = handoffs;
      result.status = 'needs-handoff';
    }

    return result;
  }

  /** Execute directly via Ollama/OpenAI (no real tools) */
  private async executeDirect(task: AgentTask): Promise<AgentResult> {
    const startedAt = new Date().toISOString();

    try {
      const messages = this.buildMessages(task);
      const provider = getProviderForTask('agent');
      const raw = await provider.generateCompletion(messages);
      const output = this.parseOutput(task.type, raw);
      const handoffs = this.detectHandoffs(task, output);

      return {
        taskId: task.id,
        agentRole: this.role,
        status: handoffs.length > 0 ? 'needs-handoff' : 'success',
        output,
        handoffs,
        meta: {
          startedAt,
          completedAt: new Date().toISOString(),
          model: provider.name,
        },
      };
    } catch (err) {
      return {
        taskId: task.id,
        agentRole: this.role,
        status: 'failed',
        output: { kind: 'generic', content: '', summary: err instanceof Error ? err.message : 'Agent execution failed' },
        handoffs: [],
        meta: {
          startedAt,
          completedAt: new Date().toISOString(),
        },
      };
    }
  }

  /** Build the message array for the AI provider */
  protected buildMessages(task: AgentTask): AIMessage[] {
    const messages: AIMessage[] = [
      { role: 'system', content: this.systemPrompt },
    ];

    // Add production context if available
    if (task.productionContext) {
      messages.push({
        role: 'system',
        content: `PRODUCTION CONTEXT:\n${serializeContext(task.productionContext)}`,
      });
    }

    // Build the user prompt from task
    let userContent = this.buildTaskPrompt(task);

    if (task.instructions) {
      userContent += `\n\nAdditional instructions: ${task.instructions}`;
    }

    messages.push({ role: 'user', content: userContent });

    return messages;
  }

  /** Build task-specific prompt. Override in subclass for custom formatting. */
  protected buildTaskPrompt(task: AgentTask): string {
    return `Task: ${task.type}\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }

  /**
   * Parse raw AI output into structured AgentOutput.
   * Attempts JSON extraction first, falls back to generic output.
   */
  protected parseOutput(taskType: AgentTaskType, raw: string): AgentOutput {
    // Try to extract JSON from the response
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        // Validate the kind field matches expected output
        if (parsed.kind) return parsed as AgentOutput;
        // If no kind, wrap it
        return { ...parsed, kind: this.taskTypeToOutputKind(taskType) } as AgentOutput;
      } catch {
        // JSON parse failed, fall through to generic
      }
    }

    return this.buildGenericOutput(raw);
  }

  /** Map task type to expected output kind */
  protected taskTypeToOutputKind(taskType: AgentTaskType): string {
    return taskType;
  }

  /** Build a generic output from raw text */
  protected buildGenericOutput(raw: string): GenericAgentOutput {
    // Extract a summary from the first paragraph
    const firstParagraph = raw.split('\n\n')[0] || raw.slice(0, 200);
    return {
      kind: 'generic',
      content: raw,
      summary: firstParagraph.slice(0, 300),
    };
  }

  /**
   * Detect if this output should trigger handoffs to other agents.
   * Override in subclass to implement domain-specific handoff logic.
   */
  protected detectHandoffs(_task: AgentTask, _output: AgentOutput): HandoffRequest[] {
    return [];
  }

  /** Helper to create a task ID */
  protected createTaskId(): string {
    return uuid();
  }
}
