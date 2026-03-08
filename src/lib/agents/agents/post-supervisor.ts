// ─── Post Supervisor Agent ─────────────────────────────
// Manages editorial, versioning, and delivery flow.
// Edit stages, revision checklists, delivery matrices, exports.

import { BaseAgent } from '../base-agent';
import type { AgentTask, AgentTaskType, AgentOutput, HandoffRequest } from '../types';

export class PostSupervisorAgent extends BaseAgent {
  readonly role = 'post-supervisor' as const;
  readonly description = 'Manages editorial, versioning, and delivery flow — edit stages, revision checklists, delivery matrices, export lists, caption/subtitle notes.';

  readonly capabilities: AgentTaskType[] = [
    'edit-plan',
    'revision-checklist',
    'delivery-matrix',
    'export-list',
    'post-notes',
  ];

  protected readonly systemPrompt = `You are the Post Supervisor of a high-end cinema and media production operating system.

ROLE:
You manage the entire post-production pipeline — from selects through final delivery. You think like a senior post supervisor at a finishing house. Quality control, versioning, and delivery specs are your domain.

RESPONSIBILITIES:
- Define edit stages (assembly → rough cut → fine cut → picture lock → online → final)
- Create post-production checklists for every deliverable
- Track versions and revision structures
- Plan exports with exact specs per platform
- Map deliverables to platforms with format requirements
- Organize post notes (edit, color, audio, graphics, captions)
- Manage the QC pipeline — nothing ships without sign-off

WHAT YOU DO NOT DO:
- You do not write scripts (that's the Script Architect)
- You do not define creative direction (that's the Creative Director)
- You do not plan production shoots (that's the Shot Planner)
- You do not write ad copy (that's the Campaign Strategist)

STANDARDS:
- Be exact on specs: resolution, codec, bitrate, frame rate, color space
- Know platform requirements (YouTube, TikTok, Meta, etc.)
- Track dependencies: color can't happen before picture lock
- Audio deliverables: stereo mix, 5.1 if applicable, M&E splits
- Subtitle/caption formats: SRT, VTT, burned-in, open captions
- Version naming conventions matter — enforce them

EDIT STAGES: assembly, rough_cut, fine_cut, picture_lock, color, audio_mix, online, final_delivery
CUT TYPES: assembly, rough, fine, picture_lock, directors_cut, client_cut, final

OUTPUT FORMAT:
Respond with structured JSON wrapped in \`\`\`json code blocks.
Always include a "kind" field and a "summary" field.`;

  protected buildTaskPrompt(task: AgentTask): string {
    const prompts: Record<string, string> = {
      'edit-plan': `Create an edit plan with stages, tasks, and timeline. Return JSON with kind:"edit-plan", stages[] (each: name, description, tasks[], deliverableRef), timeline, summary.`,
      'revision-checklist': `Create a revision checklist for QC and finishing. Return JSON with kind:"revision-checklist", items[] (each: category [picture|audio|color|graphics|captions|delivery], item, status [pending|done], notes), summary.`,
      'delivery-matrix': `Create a delivery matrix. Return JSON with kind:"delivery-matrix", deliverables[] (each: title, type, platform, format, aspectRatio, duration, specs, status [pending|in-progress|delivered]), summary.`,
      'export-list': `Create an export list with exact technical specs. Include codec, resolution, bitrate, audio format per deliverable. Return structured JSON with kind:"generic", content, summary.`,
      'post-notes': `Write comprehensive post-production notes covering picture edit, color, audio, graphics/VFX, and captions. Return structured JSON with kind:"generic", content, summary.`,
    };

    const base = prompts[task.type] || `Execute post-production task: ${task.type}`;
    return `${base}\n\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }

  protected detectHandoffs(task: AgentTask, output: AgentOutput): HandoffRequest[] {
    const handoffs: HandoffRequest[] = [];

    // After delivery matrix, suggest campaign repurposing
    if (task.type === 'delivery-matrix') {
      handoffs.push({
        fromAgent: 'post-supervisor',
        toAgent: 'campaign-strategist',
        taskType: 'repurposing-plan',
        goal: `Create a repurposing plan from the delivery matrix: ${output.summary}`,
        context: JSON.stringify(output),
        priority: task.priority,
      });
    }

    // After edit plan, suggest asset organization
    if (task.type === 'edit-plan') {
      handoffs.push({
        fromAgent: 'post-supervisor',
        toAgent: 'asset-librarian',
        taskType: 'asset-map',
        goal: `Organize assets for the post-production pipeline: ${output.summary}`,
        context: JSON.stringify(output),
        priority: 'normal',
      });
    }

    return handoffs;
  }
}
