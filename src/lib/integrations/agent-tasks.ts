// ─── Agent Task Execution ──────────────────────────────
// Predefined production tasks that agents can auto-execute.
// Bridges the agent system with the integration layer.

import { v4 as uuid } from 'uuid';
import type { AgentTaskCategory, AgentTaskDefinition, AgentTaskRun } from './types';
import type { AgentRole, AgentTaskType } from '../agents/types';

// ─── Task Definitions ──────────────────────────────────

export const AGENT_TASK_DEFINITIONS: AgentTaskDefinition[] = [
  // Content Generation
  { id: 'gen-brief', category: 'content-generation', name: 'Generate Creative Brief', description: 'Auto-generate a creative brief from production details', agentRole: 'creative-director', taskType: 'creative-brief', requiresProduction: true },
  { id: 'gen-treatment', category: 'content-generation', name: 'Generate Treatment', description: 'Create a visual treatment document', agentRole: 'creative-director', taskType: 'treatment', requiresProduction: true },
  { id: 'gen-script', category: 'content-generation', name: 'Generate Hero Script', description: 'Write a production script from brief', agentRole: 'script-architect', taskType: 'hero-script', requiresProduction: true },
  { id: 'gen-hooks', category: 'content-generation', name: 'Generate Ad Hooks', description: 'Create attention-grabbing opening hooks', agentRole: 'script-architect', taskType: 'ad-hooks', requiresProduction: true },
  { id: 'gen-ctas', category: 'content-generation', name: 'Generate CTAs', description: 'Create call-to-action variants', agentRole: 'script-architect', taskType: 'cta-variants', requiresProduction: true },

  // Production Planning
  { id: 'plan-shots', category: 'production-planning', name: 'Plan Shot List', description: 'Generate a complete shot list from script', agentRole: 'shot-planner', taskType: 'shot-list', requiresProduction: true },
  { id: 'plan-scenes', category: 'production-planning', name: 'Scene Breakdown', description: 'Break down production into scenes', agentRole: 'shot-planner', taskType: 'scene-breakdown', requiresProduction: true },
  { id: 'plan-coverage', category: 'production-planning', name: 'Coverage Map', description: 'Map camera coverage for all scenes', agentRole: 'shot-planner', taskType: 'coverage-map', requiresProduction: true },
  { id: 'plan-roadmap', category: 'production-planning', name: 'Production Roadmap', description: 'EP creates full production roadmap', agentRole: 'executive-producer', taskType: 'production-roadmap', requiresProduction: true },
  { id: 'plan-milestones', category: 'production-planning', name: 'Milestone Plan', description: 'Set key milestones and deadlines', agentRole: 'executive-producer', taskType: 'milestone-plan', requiresProduction: true },

  // Review & Analysis
  { id: 'review-status', category: 'review-analysis', name: 'Status Summary', description: 'EP reviews current production status', agentRole: 'executive-producer', taskType: 'status-summary', requiresProduction: true },
  { id: 'review-next', category: 'review-analysis', name: 'Next Steps', description: 'EP recommends next actions', agentRole: 'executive-producer', taskType: 'next-steps', requiresProduction: true },
  { id: 'review-revisions', category: 'review-analysis', name: 'Revision Checklist', description: 'Post supervisor creates revision checklist', agentRole: 'post-supervisor', taskType: 'revision-checklist', requiresProduction: true },

  // Export Automation
  { id: 'export-edit', category: 'export-automation', name: 'Edit Plan', description: 'Create post-production edit plan', agentRole: 'post-supervisor', taskType: 'edit-plan', requiresProduction: true },
  { id: 'export-delivery', category: 'export-automation', name: 'Delivery Matrix', description: 'Generate multi-platform delivery specs', agentRole: 'post-supervisor', taskType: 'delivery-matrix', requiresProduction: true },

  // File Management
  { id: 'file-assets', category: 'file-management', name: 'Asset Map', description: 'Map and organize all production assets', agentRole: 'asset-librarian', taskType: 'asset-map', requiresProduction: true },
  { id: 'file-repurpose', category: 'file-management', name: 'Repurposing Plan', description: 'Plan content repurposing across platforms', agentRole: 'asset-librarian', taskType: 'repurposing-plan', requiresProduction: true },

  // Campaign Execution
  { id: 'campaign-angles', category: 'campaign-execution', name: 'Ad Angle Matrix', description: 'Generate multi-angle ad strategy', agentRole: 'campaign-strategist', taskType: 'ad-angle-matrix', requiresProduction: true },
  { id: 'campaign-audience', category: 'campaign-execution', name: 'Audience Variants', description: 'Create audience-specific messaging', agentRole: 'campaign-strategist', taskType: 'audience-variants', requiresProduction: true },
  { id: 'campaign-copy', category: 'campaign-execution', name: 'Platform Copy', description: 'Write platform-optimized ad copy', agentRole: 'campaign-strategist', taskType: 'platform-copy', requiresProduction: true },
];

// ─── Task Run Tracking ─────────────────────────────────

const taskRuns: AgentTaskRun[] = [];
const MAX_RUNS = 100;

/** Create a task run record */
export function createTaskRun(definitionId: string, productionId?: string): AgentTaskRun {
  const run: AgentTaskRun = {
    id: uuid(),
    definitionId,
    status: 'pending',
    productionId,
    startedAt: new Date().toISOString(),
  };

  taskRuns.unshift(run);
  if (taskRuns.length > MAX_RUNS) taskRuns.length = MAX_RUNS;

  return run;
}

/** Update a task run */
export function updateTaskRun(runId: string, update: Partial<AgentTaskRun>): AgentTaskRun | null {
  const run = taskRuns.find(r => r.id === runId);
  if (!run) return null;
  Object.assign(run, update);
  return run;
}

/** Get recent task runs */
export function getTaskRuns(limit = 20): AgentTaskRun[] {
  return taskRuns.slice(0, limit);
}

/** Get task definitions grouped by category */
export function getTaskDefinitionsByCategory(): Record<AgentTaskCategory, AgentTaskDefinition[]> {
  const grouped: Record<string, AgentTaskDefinition[]> = {};
  for (const def of AGENT_TASK_DEFINITIONS) {
    if (!grouped[def.category]) grouped[def.category] = [];
    grouped[def.category].push(def);
  }
  return grouped as Record<AgentTaskCategory, AgentTaskDefinition[]>;
}

/** Get a task definition by ID */
export function getTaskDefinition(id: string): AgentTaskDefinition | undefined {
  return AGENT_TASK_DEFINITIONS.find(d => d.id === id);
}

/** Category display labels */
export const TASK_CATEGORY_LABELS: Record<AgentTaskCategory, string> = {
  'content-generation': 'Content Generation',
  'production-planning': 'Production Planning',
  'review-analysis': 'Review & Analysis',
  'export-automation': 'Export Automation',
  'file-management': 'File Management',
  'campaign-execution': 'Campaign Execution',
};
