// ─── Task Runner ───────────────────────────────────────
// Laptop mode: runs tasks inline (synchronous execution).
// Studio mode: can be swapped for a queue-backed runner with
// background workers and concurrency control.

import { v4 as uuid } from 'uuid';
import { getConfig } from '../config';
import type { Task, TaskPriority, TaskStatus } from './types';

type TaskHandler<T = unknown> = (payload: T) => Promise<unknown>;

class TaskRunner {
  private handlers = new Map<string, TaskHandler>();
  private activeTasks = new Map<string, Task>();

  /** Register a handler for a task type */
  register<T = unknown>(taskType: string, handler: TaskHandler<T>): void {
    this.handlers.set(taskType, handler as TaskHandler);
  }

  /** Submit a task for execution */
  async submit<T = unknown>(
    taskType: string,
    payload: T,
    options?: { priority?: TaskPriority; timeoutMs?: number }
  ): Promise<Task<T>> {
    const handler = this.handlers.get(taskType);
    if (!handler) {
      throw new Error(`No handler registered for task type: ${taskType}`);
    }

    const task: Task<T> = {
      id: uuid(),
      type: taskType,
      status: 'pending',
      priority: options?.priority || 'normal',
      payload,
      createdAt: new Date().toISOString(),
      timeoutMs: options?.timeoutMs,
    };

    this.activeTasks.set(task.id, task as Task);

    // Laptop mode: run inline immediately
    // Studio mode: this is where you'd push to a background queue
    const config = getConfig();
    if (config.runtime.backgroundTasks) {
      // Future: push to persistent queue for background processing
      // For now, still runs inline but allows concurrent execution
      return this.execute(task, handler) as Promise<Task<T>>;
    }

    return this.execute(task, handler) as Promise<Task<T>>;
  }

  private async execute<T>(task: Task<T>, handler: TaskHandler): Promise<Task<T>> {
    task.status = 'running';
    task.startedAt = new Date().toISOString();

    try {
      task.result = await handler(task.payload);
      task.status = 'completed';
    } catch (err) {
      task.status = 'failed';
      task.error = err instanceof Error ? err.message : 'Unknown error';
    }

    task.completedAt = new Date().toISOString();
    this.activeTasks.delete(task.id);

    return task;
  }

  /** Get current active task count */
  getActiveCount(): number {
    return this.activeTasks.size;
  }

  /** Check if a task type has a registered handler */
  hasHandler(taskType: string): boolean {
    return this.handlers.has(taskType);
  }
}

// ─── Singleton ─────────────────────────────────────────

let _runner: TaskRunner | null = null;

export function getTaskRunner(): TaskRunner {
  if (!_runner) {
    _runner = new TaskRunner();
  }
  return _runner;
}
