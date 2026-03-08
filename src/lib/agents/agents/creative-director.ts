// ─── Creative Director Agent ───────────────────────────
// Vision and taste engine. Defines concept direction, mood,
// emotional tone, visual identity, narrative feel, campaign style.

import { BaseAgent } from '../base-agent';
import type { AgentTask, AgentTaskType, AgentOutput, HandoffRequest } from '../types';

export class CreativeDirectorAgent extends BaseAgent {
  readonly role = 'creative-director' as const;
  readonly description = 'Vision and taste engine — defines concept direction, mood, emotional tone, visual identity, narrative feel, and campaign style.';

  readonly capabilities: AgentTaskType[] = [
    'creative-brief',
    'treatment',
    'campaign-concept',
    'brand-story',
    'tone-direction',
    'visual-language',
  ];

  protected readonly systemPrompt = `You are the Creative Director of a high-end cinema and media production operating system.

ROLE:
You are the vision and taste engine. You define concept direction, mood, emotional tone, visual identity, narrative feel, and campaign style. You think like a top creative director at a premium agency or production company.

RESPONSIBILITIES:
- Generate creative concepts that elevate the production
- Shape campaign themes and visual identity systems
- Define visual direction with specificity (references, color, texture, composition)
- Propose storytelling angles that connect emotionally
- Create treatments that a production team can execute
- Establish messaging pillars and brand voice

WHAT YOU DO NOT DO:
- You do not write scripts (that's the Script Architect)
- You do not plan individual shots (that's the Shot Planner)
- You do not manage post-production (that's the Post Supervisor)
- You do not create ad copy or platform variants (that's the Campaign Strategist)

STANDARDS:
- Think cinema, not content. Aim for work that could win at Cannes or D&AD.
- Reference real visual styles, directors, photographers, campaigns.
- Be specific about mood. "Dark and moody" is not enough. Describe the light, the texture, the emotional undercurrent.
- Every concept should have a reason — connected to audience, brand, or story.

OUTPUT FORMAT:
Respond with structured JSON wrapped in \`\`\`json code blocks.
Always include a "kind" field and a "summary" field.`;

  protected buildTaskPrompt(task: AgentTask): string {
    const prompts: Record<string, string> = {
      'creative-brief': `Write a comprehensive creative brief. Return JSON with kind:"creative-brief", objective, targetAudience, keyMessage, tone, visualDirection, references[], deliverables[], constraints[], summary.`,
      'treatment': `Write a cinematic treatment document. Return JSON with kind:"treatment", title, logline, visualStyle, narrativeApproach, moodAndTone, pacing, colorPalette, musicDirection, keyMoments[] (each: moment, description, visualNote), summary.`,
      'campaign-concept': `Generate a campaign concept. Return JSON with kind:"campaign-concept", conceptName, bigIdea, messagingPillars[], visualIdentity, channels[], variations[] (each: name, angle, hook), summary.`,
      'brand-story': `Define the brand story angle. Focus on narrative, emotional truth, and audience connection. Return structured JSON with kind:"generic", content (the full brand story direction), summary.`,
      'tone-direction': `Define the tone and mood direction. Be extremely specific about emotional register, energy, pacing feel, and cultural references. Return structured JSON with kind:"generic", content (full tone direction), summary.`,
      'visual-language': `Define the visual language system. Cover: color palette, composition style, lighting approach, texture/grain, typography mood, reference films/campaigns, motion style. Return structured JSON with kind:"generic", content (full visual language notes), summary.`,
    };

    const base = prompts[task.type] || `Execute creative task: ${task.type}`;
    return `${base}\n\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }

  protected detectHandoffs(task: AgentTask, output: AgentOutput): HandoffRequest[] {
    const handoffs: HandoffRequest[] = [];

    // After a creative brief, suggest script and shot planning
    if (task.type === 'creative-brief' || task.type === 'treatment') {
      handoffs.push({
        fromAgent: 'creative-director',
        toAgent: 'script-architect',
        taskType: 'hero-script',
        goal: `Write the hero script based on the creative direction: ${output.summary}`,
        context: JSON.stringify(output),
        priority: task.priority,
      });
    }

    // After campaign concept, suggest campaign strategy
    if (task.type === 'campaign-concept') {
      handoffs.push({
        fromAgent: 'creative-director',
        toAgent: 'campaign-strategist',
        taskType: 'ad-angle-matrix',
        goal: `Build ad angles from campaign concept: ${output.summary}`,
        context: JSON.stringify(output),
        priority: task.priority,
      });
    }

    return handoffs;
  }
}
