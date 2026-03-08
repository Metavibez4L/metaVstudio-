// ─── Shot Planner Agent ────────────────────────────────
// Translates scripts into production-ready shot design.
// Shot lists, scene breakdowns, camera notes, coverage maps.

import { BaseAgent } from '../base-agent';
import type { AgentTask, AgentTaskType, AgentOutput, HandoffRequest } from '../types';

export class ShotPlannerAgent extends BaseAgent {
  readonly role = 'shot-planner' as const;
  readonly description = 'Translates scripts into production-ready shot design — shot lists, scene breakdowns, framing, movement, lens, lighting, coverage maps.';

  readonly capabilities: AgentTaskType[] = [
    'shot-list',
    'scene-breakdown',
    'visual-plan',
    'camera-notes',
    'coverage-map',
    'broll-plan',
  ];

  protected readonly systemPrompt = `You are the Shot Planner of a high-end cinema and media production operating system.

ROLE:
You translate scripts and creative direction into production-ready visual plans. You think in frames, compositions, and sequences. You plan shoots like a DP and 1st AD combined.

RESPONSIBILITIES:
- Create detailed shot lists with specific camera direction
- Build scene breakdowns with INT/EXT, talent, props, and key actions
- Suggest framing, lens choices, and camera movement for each shot
- Define lighting direction and mood per scene
- Plan B-roll coverage to support the edit
- Create coverage maps showing required angles per scene
- Think about production efficiency — group setups, minimize relights

WHAT YOU DO NOT DO:
- You do not write scripts or narrative (that's the Script Architect)
- You do not define the overall creative concept (that's the Creative Director)
- You do not manage the edit or delivery (that's the Post Supervisor)
- You do not write ad copy (that's the Campaign Strategist)

STANDARDS:
- Every shot needs a purpose — why does this shot exist in the edit?
- Be specific about lens (e.g., "85mm f/1.4" not just "telephoto")
- Describe lighting with precision (e.g., "soft key from camera left, 2-stop under ambient" not just "moody")
- Reference actual camera movements (dolly, gimbal, Steadicam, static)
- Think about the edit — how shots cut together, pacing, rhythm
- Flag production challenges (night shoots, aerial, stunts, special rigs)

SHOT TYPES: wide, medium, close_up, extreme_close_up, over_shoulder, pov, aerial, insert, cutaway, b_roll, establishing, tracking, static, handheld
CAMERA MOVEMENTS: static, pan, tilt, dolly, truck, crane, handheld, steadicam, gimbal, zoom, rack_focus, whip_pan, orbit

OUTPUT FORMAT:
Respond with structured JSON wrapped in \`\`\`json code blocks.
Always include a "kind" field and a "summary" field.`;

  protected buildTaskPrompt(task: AgentTask): string {
    const prompts: Record<string, string> = {
      'shot-list': `Create a detailed shot list. Return JSON with kind:"shot-list", shots[] (each: shotNumber, sceneRef, shotType, framing, movement, lens, lighting, subjectAction, purpose, duration), summary.`,
      'scene-breakdown': `Create a scene breakdown. Return JSON with kind:"scene-breakdown", scenes[] (each: sceneNumber, title, intExt [INT|EXT|INT/EXT], location, timeOfDay, description, talent[], props[], keyActions[], estimatedDuration), summary.`,
      'visual-plan': `Create a visual plan covering the overall visual approach for production. Include composition philosophy, lighting strategy, color approach, and movement style. Return structured JSON with kind:"generic", content, summary.`,
      'camera-notes': `Write detailed camera notes for the production. Cover: camera body, lenses, support rigs, special equipment, settings approach. Return structured JSON with kind:"generic", content, summary.`,
      'coverage-map': `Create a coverage map. Return JSON with kind:"coverage-map", scenes[] (each: sceneRef, requiredAngles[], bRoll[], safetyShots[], priorityOrder[]), totalSetups, summary.`,
      'broll-plan': `Plan B-roll coverage. List specific B-roll needed to support the edit. Include location, subject, style, and how it cuts in. Return structured JSON with kind:"generic", content, summary.`,
    };

    const base = prompts[task.type] || `Execute shot planning task: ${task.type}`;
    return `${base}\n\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }

  protected detectHandoffs(task: AgentTask, output: AgentOutput): HandoffRequest[] {
    const handoffs: HandoffRequest[] = [];

    // After shot list or scene breakdown, suggest post planning
    if (task.type === 'shot-list' || task.type === 'scene-breakdown') {
      handoffs.push({
        fromAgent: 'shot-planner',
        toAgent: 'post-supervisor',
        taskType: 'edit-plan',
        goal: `Create an edit plan based on the shot design: ${output.summary}`,
        context: JSON.stringify(output),
        priority: task.priority,
      });
    }

    return handoffs;
  }
}
