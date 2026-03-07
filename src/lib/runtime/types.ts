// ─── Task & Agent Runtime Types ────────────────────────
// Lightweight type definitions for the job queue / agent system.
// On laptop: tasks run inline (no background queue).
// On studio: tasks can be queued and run in background workers.

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Task<T = unknown> {
  id: string;
  type: string;
  status: TaskStatus;
  priority: TaskPriority;
  payload: T;
  result?: unknown;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  /** Max time in ms before the task is considered timed out */
  timeoutMs?: number;
}

/** Agent definition — a reusable automation that can run as a task */
export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  /** The task type this agent handles */
  taskType: string;
  /** Whether this agent requires studio mode (heavy compute) */
  requiresStudio: boolean;
}

/** Known task types — extend as new capabilities are added */
export type BuiltinTaskType =
  | 'ai:generate'
  | 'ai:chat'
  | 'ai:publish-copy'
  | 'ai:summarize'
  | 'import:asset'
  | 'export:publish'
  | 'workflow:checklist'
  | 'agent:custom';
