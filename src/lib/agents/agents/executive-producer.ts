// ─── Executive Producer Agent ──────────────────────────
// Master coordinator. Routes tasks, tracks production phases,
// manages priorities, keeps all agent outputs aligned.
// This is the ONLY agent that can decompose goals into
// multi-agent workflows.

import { BaseAgent } from '../base-agent';
import type { AgentTask, AgentTaskType, AgentOutput, HandoffRequest, AgentRole } from '../types';
import { TASK_AGENT_MAP } from '../types';

export class ExecutiveProducerAgent extends BaseAgent {
  readonly role = 'executive-producer' as const;
  readonly description = 'Master coordinator — routes tasks, tracks production phases, manages priorities, keeps all agent outputs aligned to project goals.';

  readonly capabilities: AgentTaskType[] = [
    'production-roadmap',
    'milestone-plan',
    'task-routing',
    'status-summary',
    'blocker-report',
    'next-steps',
  ];

  protected readonly systemPrompt = `You are the Executive Producer of a high-end cinema and media production operating system.

ROLE:
You are the master coordinator. You route tasks, track production phases, manage priorities, and keep all outputs aligned to project goals. You think like a senior EP at a top-tier production company.

RESPONSIBILITIES:
- Receive user goals and break them into production workstreams
- Assign work to specialist agents (Creative Director, Script Architect, Shot Planner, Post Supervisor, Campaign Strategist, Asset Librarian)
- Consolidate outputs and generate milestone plans
- Detect blockers and dependencies
- Summarize project status with clarity and precision
- Make decisive recommendations on what gets worked on next

SPECIALIST TEAM:
- Creative Director — vision, concept, mood, tone, visual identity
- Script Architect — scripts, narrative structure, hooks, voiceover, CTAs
- Shot Planner — shot lists, scene breakdowns, camera plans, coverage
- Post Supervisor — edit stages, versioning, delivery, export planning
- Campaign Strategist — ad angles, audience variants, platform copy, repurposing
- Asset Librarian — organization, tagging, naming, retrieval

RULES:
- Never do the work of a specialist agent. Route it.
- Be decisive. State what should happen and who should do it.
- Think in production phases: concept → pre-production → production → post → delivery.
- Flag blockers and dependencies explicitly.
- Keep outputs structured and actionable.

OUTPUT FORMAT:
Respond with structured JSON wrapped in \`\`\`json code blocks.
Always include a "kind" field matching the task type and a "summary" field.`;

  protected buildTaskPrompt(task: AgentTask): string {
    const prompts: Record<string, string> = {
      'production-roadmap': `Create a production roadmap for this project. Break it into phases with tasks, dependencies, and estimated durations. Return JSON with kind:"production-roadmap", phases[], criticalPath[], summary.`,
      'milestone-plan': `Create a milestone plan with deliverables and agent assignments. Return JSON with kind:"milestone-plan", milestones[], summary.`,
      'task-routing': `Analyze this goal and create a task routing plan. Determine which specialist agents need to be involved and in what order. Return a structured execution plan.`,
      'status-summary': `Generate a production status summary. Assess completed items, in-progress work, blockers, and next priorities. Return JSON with kind:"status-summary", overallStatus, completedItems[], inProgressItems[], blockers[], nextPriorities[], summary.`,
      'blocker-report': `Identify all blockers and risks. Assess what's preventing progress and recommend mitigations.`,
      'next-steps': `Determine the next steps for this production. Prioritize by urgency and impact. Return JSON with kind:"next-steps", immediate[], upcoming[], summary. Each item has action, assignedTo (agent role), reason.`,
    };

    const base = prompts[task.type] || `Execute task: ${task.type}`;
    return `${base}\n\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }

  protected detectHandoffs(task: AgentTask, output: AgentOutput): HandoffRequest[] {
    // EP generates handoffs when it identifies work for specialists
    if (output.kind === 'next-steps' && 'immediate' in output) {
      return output.immediate
        .filter((item) => item.assignedTo !== 'executive-producer')
        .map((item) => ({
          fromAgent: 'executive-producer' as AgentRole,
          toAgent: item.assignedTo,
          taskType: this.inferTaskType(item.assignedTo, item.action),
          goal: item.action,
          context: item.reason,
          priority: task.priority,
        }));
    }
    return [];
  }

  /** Infer the best task type for a given agent based on the action description */
  private inferTaskType(agent: AgentRole, action: string): AgentTaskType {
    const lower = action.toLowerCase();
    const defaults: Record<AgentRole, AgentTaskType> = {
      'executive-producer': 'next-steps',
      'creative-director': 'creative-brief',
      'script-architect': 'hero-script',
      'shot-planner': 'shot-list',
      'post-supervisor': 'edit-plan',
      'campaign-strategist': 'ad-angle-matrix',
      'asset-librarian': 'asset-map',
    };

    // Simple keyword matching for common task types
    if (agent === 'creative-director') {
      if (lower.includes('treatment')) return 'treatment';
      if (lower.includes('concept') || lower.includes('campaign')) return 'campaign-concept';
      if (lower.includes('tone') || lower.includes('mood')) return 'tone-direction';
      if (lower.includes('visual')) return 'visual-language';
    }
    if (agent === 'script-architect') {
      if (lower.includes('hook')) return 'ad-hooks';
      if (lower.includes('promo')) return 'promo-script';
      if (lower.includes('short') || lower.includes('cutdown')) return 'short-form-script';
      if (lower.includes('voiceover') || lower.includes('vo')) return 'voiceover-draft';
      if (lower.includes('cta')) return 'cta-variants';
    }
    if (agent === 'shot-planner') {
      if (lower.includes('scene')) return 'scene-breakdown';
      if (lower.includes('coverage')) return 'coverage-map';
      if (lower.includes('b-roll') || lower.includes('broll')) return 'broll-plan';
    }
    if (agent === 'post-supervisor') {
      if (lower.includes('delivery') || lower.includes('deliverable')) return 'delivery-matrix';
      if (lower.includes('revision') || lower.includes('checklist')) return 'revision-checklist';
      if (lower.includes('export')) return 'export-list';
    }
    if (agent === 'campaign-strategist') {
      if (lower.includes('audience')) return 'audience-variants';
      if (lower.includes('copy') || lower.includes('platform')) return 'platform-copy';
      if (lower.includes('repurpos')) return 'repurposing-plan';
      if (lower.includes('rollout')) return 'campaign-rollout';
    }

    return defaults[agent] || 'next-steps';
  }
}
