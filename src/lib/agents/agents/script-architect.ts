// ─── Script Architect Agent ────────────────────────────
// Turns creative direction into scripts and narrative structure.
// Long-form, short-form, hooks, voiceover, CTAs, platform variants.

import { BaseAgent } from '../base-agent';
import type { AgentTask, AgentTaskType, AgentOutput, HandoffRequest } from '../types';

export class ScriptArchitectAgent extends BaseAgent {
  readonly role = 'script-architect' as const;
  readonly description = 'Turns creative direction into scripts and narrative structure — long-form, short-form, hooks, voiceover, CTAs, platform variants.';

  readonly capabilities: AgentTaskType[] = [
    'hero-script',
    'promo-script',
    'short-form-script',
    'ad-hooks',
    'voiceover-draft',
    'cta-variants',
    'platform-script',
  ];

  protected readonly systemPrompt = `You are the Script Architect of a high-end cinema and media production operating system.

ROLE:
You turn creative direction into production-ready scripts and narrative structure. You write for camera, not for page. Every word serves the visual story.

RESPONSIBILITIES:
- Write hero scripts (long-form brand films, documentaries, launch videos)
- Write promo and ad scripts (15s, 30s, 60s formats)
- Write short-form scripts optimized for social (TikTok, Reels, Shorts)
- Generate hooks that stop the scroll and demand attention
- Draft voiceover narration with rhythm and cadence notes
- Create CTA variants from soft to hard, matched to funnel position
- Adapt scripts across platforms with format-specific adjustments

WHAT YOU DO NOT DO:
- You do not define creative direction or visual identity (that's the Creative Director)
- You do not plan shots or camera work (that's the Shot Planner)
- You do not manage post-production (that's the Post Supervisor)
- You do not write ad copy or campaign strategy (that's the Campaign Strategist)

STANDARDS:
- Scripts must include visual directions alongside dialogue/narration
- Mark SUPER (on-screen text), VO (voiceover), SFX (sound effects), MX (music cues)
- Format for the intended duration — be precise about timing
- Hooks must be testable (A/B variants welcome)
- Every script must have a clear emotional arc, even in 6 seconds

OUTPUT FORMAT:
Respond with structured JSON wrapped in \`\`\`json code blocks.
Always include a "kind" field and a "summary" field.`;

  protected buildTaskPrompt(task: AgentTask): string {
    const prompts: Record<string, string> = {
      'hero-script': `Write a hero script (long-form, 60s-3min). Return JSON with kind:"script", title, format:"hero", targetDuration, scenes[] (each: sceneNumber, location, action, dialogue, visualNote, duration), summary.`,
      'promo-script': `Write a promo script (15-60s). Return JSON with kind:"script", title, format:"promo", targetDuration, scenes[] (each: sceneNumber, location, action, dialogue, visualNote, duration), summary.`,
      'short-form-script': `Write a short-form script optimized for social (6-30s). Return JSON with kind:"script", title, format:"short-form", targetDuration, targetPlatform, scenes[], summary.`,
      'ad-hooks': `Generate 5-8 ad hooks. Return JSON with kind:"ad-hooks", hooks[] (each: text, style [question|statement|statistic|story|challenge|contrast], targetEmotion, platform), summary.`,
      'voiceover-draft': `Write a voiceover draft with rhythm and pacing notes. Return JSON with kind:"script", title, format:"voiceover", targetDuration, scenes[] (use dialogue for VO text, action for pacing/tone notes), summary.`,
      'cta-variants': `Generate 6-10 CTA variants. Return JSON with kind:"cta-variants", variants[] (each: text, type [soft|medium|hard], placement [opening|mid|closing|overlay], platform), summary.`,
      'platform-script': `Adapt the script for the target platform. Adjust format, pacing, hooks, and CTA for platform norms. Return JSON with kind:"script", title, format:"platform", targetDuration, targetPlatform, scenes[], summary.`,
    };

    const base = prompts[task.type] || `Execute script task: ${task.type}`;
    return `${base}\n\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }

  protected detectHandoffs(task: AgentTask, output: AgentOutput): HandoffRequest[] {
    const handoffs: HandoffRequest[] = [];

    // After writing a script, suggest shot planning
    if (task.type === 'hero-script' || task.type === 'promo-script') {
      handoffs.push({
        fromAgent: 'script-architect',
        toAgent: 'shot-planner',
        taskType: 'shot-list',
        goal: `Create a shot list from the script: ${output.summary}`,
        context: JSON.stringify(output),
        priority: task.priority,
      });
    }

    return handoffs;
  }
}
