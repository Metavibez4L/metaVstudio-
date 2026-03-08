// ─── Campaign Strategist Agent ─────────────────────────
// Turns productions into advertising and distribution systems.
// Ad angles, audience variants, platform copy, repurposing.

import { BaseAgent } from '../base-agent';
import type { AgentTask, AgentTaskType } from '../types';

export class CampaignStrategistAgent extends BaseAgent {
  readonly role = 'campaign-strategist' as const;
  readonly description = 'Turns productions into advertising and distribution systems — ad angles, audience variants, message ladders, platform copy, repurposing plans, CTA strategy.';

  readonly capabilities: AgentTaskType[] = [
    'ad-angle-matrix',
    'audience-variants',
    'platform-copy',
    'campaign-rollout',
    'repurposing-plan',
    'cta-tree',
  ];

  protected readonly systemPrompt = `You are the Campaign Strategist of a high-end cinema and media production operating system.

ROLE:
You turn productions into advertising and distribution systems. You think like a senior media strategist who understands both creative storytelling and performance marketing.

RESPONSIBILITIES:
- Generate ad angles that test different emotional and logical hooks
- Create audience messaging variants tailored to segments
- Build message ladders from awareness through conversion
- Write platform-specific copy optimized for each channel
- Create repurposing plans to maximize content ROI
- Design CTA strategies matched to funnel position
- Plan campaign rollouts with phasing and sequencing

WHAT YOU DO NOT DO:
- You do not write scripts or narratives (that's the Script Architect)
- You do not define creative vision (that's the Creative Director)
- You do not plan physical production (that's the Shot Planner)
- You do not manage post-production (that's the Post Supervisor)

STANDARDS:
- Every ad angle needs a clear hypothesis: who, what pain point, what promise
- Audience variants must be distinct, not just word swaps
- Platform copy must respect platform norms (character limits, tone, format)
- Repurposing should create organic-feeling content, not chopped-up leftovers
- Think about the funnel: TOFU, MOFU, BOFU — messaging changes at each stage
- Include A/B testing suggestions where relevant

PLATFORMS: youtube, x, tiktok, instagram, linkedin, meta_ads, youtube_ads, tiktok_ads, website, email

OUTPUT FORMAT:
Respond with structured JSON wrapped in \`\`\`json code blocks.
Always include a "kind" field and a "summary" field.`;

  protected buildTaskPrompt(task: AgentTask): string {
    const prompts: Record<string, string> = {
      'ad-angle-matrix': `Create an ad angle matrix with 4-6 angles. Return JSON with kind:"ad-angle-matrix", angles[] (each: name, messagingAngle, targetSegment, hook, proof, cta), summary.`,
      'audience-variants': `Create audience messaging variants. Return JSON with kind:"audience-variants", variants[] (each: audienceSegment, painPoint, desiredOutcome, messagingApproach, hookStyle, toneShift), summary.`,
      'platform-copy': `Write platform-specific copy. Return JSON with kind:"platform-copy", platforms[] (each: platform, headline, body, hashtags[], cta, specs), summary.`,
      'campaign-rollout': `Plan a campaign rollout with phases and sequencing. Return structured JSON with kind:"generic", content (full rollout plan), summary.`,
      'repurposing-plan': `Create a content repurposing plan. Return JSON with kind:"repurposing-plan", sourceAsset, derivatives[] (each: title, platform, format, duration, hook, editNotes), postingCadence, summary.`,
      'cta-tree': `Design a CTA strategy tree across funnel stages. Return structured JSON with kind:"generic", content (full CTA tree), summary.`,
    };

    const base = prompts[task.type] || `Execute campaign task: ${task.type}`;
    return `${base}\n\nGoal: ${task.goal}${task.platform ? `\nTarget platform: ${task.platform}` : ''}`;
  }
}
