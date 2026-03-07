import type { AIGenerateRequest, AIMessage, ContentDraft, Platform } from '../types';
import { getConfig } from '../config';
import type { AIProviderType } from '../config';

// ─── Provider Interface ────────────────────────────────

export interface AIProvider {
  readonly name: string;
  generateCompletion(messages: AIMessage[], options?: GenerationOptions): Promise<string>;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
}

// ─── Task Types for Routing ────────────────────────────

export type AITaskType = 'chat' | 'generate' | 'publish' | 'summarize' | 'agent';

// ─── Ollama Provider (OpenAI-compatible, no auth needed) ────────

class OllamaProvider implements AIProvider {
  readonly name = 'ollama';
  private model: string;
  private baseUrl: string;

  constructor(model?: string, baseUrl?: string) {
    const cfg = getConfig().ai.ollama;
    this.model = model || cfg.model;
    this.baseUrl = baseUrl || cfg.baseUrl;
  }

  async generateCompletion(messages: AIMessage[], options?: GenerationOptions): Promise<string> {
    const cfg = getConfig().ai;
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? cfg.temperature,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }
}

// ─── OpenAI Cloud Provider (optional, for future use) ──

class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey?: string, model?: string, baseUrl?: string) {
    const cfg = getConfig().ai.openai;
    this.apiKey = apiKey || cfg.apiKey;
    this.model = model || cfg.model;
    this.baseUrl = baseUrl || cfg.baseUrl;
  }

  async generateCompletion(messages: AIMessage[], options?: GenerationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY not configured. Switch AI_PROVIDER to ollama or set the key.');
    }

    const cfg = getConfig().ai;
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? cfg.temperature,
        max_tokens: options?.maxTokens ?? cfg.maxTokens,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error: ${res.status} — ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }
}

// ─── Provider Factory ──────────────────────────────────

function createProvider(type: AIProviderType): AIProvider {
  switch (type) {
    case 'openai':
      return new OpenAIProvider();
    case 'ollama':
    default:
      return new OllamaProvider();
  }
}

/** Get the primary provider based on config */
export function getProvider(): AIProvider {
  return createProvider(getConfig().ai.provider);
}

/** Get provider for a specific task type (allows per-task routing in studio/cloud) */
export function getProviderForTask(task: AITaskType): AIProvider {
  // For now, all tasks use the primary provider.
  // In studio mode, this can be extended to route heavy tasks (agent, summarize)
  // to larger local models while keeping chat on lighter ones.
  return getProvider();
}

// ─── Content Generation ────────────────────────────────

const CONTENT_TYPE_PROMPTS: Record<ContentDraft['type'], string> = {
  hook: 'Generate 3-5 compelling hooks/opening lines for this content. Make them attention-grabbing and platform-appropriate.',
  script: 'Write a complete script for this content. Include intro, main sections, transitions, and outro. Keep the tone natural and engaging.',
  outline: 'Create a detailed outline with sections, key points, and flow notes. Include timing suggestions.',
  shot_list: 'Create a detailed shot list with scene descriptions, camera angles/screen capture instructions, and timing notes.',
  thumbnail_idea: 'Generate 3-5 thumbnail concepts with text overlay suggestions, visual composition ideas, and color scheme recommendations.',
  post_copy: 'Write engaging social media post copy. Include a hook, value proposition, and call-to-action. Optimize for the target platform.',
  cta: 'Generate 5-7 call-to-action variations. Mix soft and hard CTAs. Include subscribe, engage, and conversion-focused options.',
  creative_brief: 'Write a comprehensive creative brief. Include objective, target audience, key message, tone/voice direction, visual direction references, deliverables list, and creative constraints. Structure it for a production team.',
  treatment: 'Write a cinematic treatment/creative treatment document. Include visual style, narrative approach, mood/tone, pacing, color palette direction, music/sound design direction, and key visual moments.',
  ad_concept: 'Generate 3 ad concept variations. Each should include: concept name, hook/opening, key visual moment, messaging angle, CTA, and platform-specific notes. Think like a creative agency.',
  scene_breakdown: 'Create a detailed scene breakdown. List each scene with: scene number, location, time of day, description, characters/talent, props, key actions, and dialogue. Include INT/EXT designations.',
  edit_notes: 'Write post-production edit notes. Cover: pacing/rhythm, key cuts, transitions, B-roll placement, music cues, SFX notes, color grade direction, and caption/subtitle guidance.',
  delivery_checklist: 'Create a comprehensive delivery checklist. Include: all format specs per platform, aspect ratios, durations, file naming conventions, thumbnail requirements, caption files, and metadata.',
  repurposing_plan: 'Create a content repurposing strategy. Map out how to cut/adapt the hero content into 5-8 derivative pieces across platforms. Include format, duration, platform-specific hooks, and posting cadence.',
};

const PLATFORM_CONTEXT: Record<Platform, string> = {
  youtube: 'YouTube — optimize for search, watch time, and engagement. Longer-form friendly.',
  x: 'X/Twitter — concise, punchy, thread-friendly. 280 char limit for individual posts.',
  tiktok: 'TikTok — hook in first 2 seconds, trendy, casual tone, vertical video focused.',
  instagram: 'Instagram — visual-first, carousel-friendly, use of line breaks, emoji-friendly.',
  linkedin: 'LinkedIn — professional tone, thought leadership, storytelling, value-driven.',
  meta_ads: 'Meta Ads (Facebook/Instagram) — direct response, clear value prop, strong visual hook, compliance-friendly.',
  youtube_ads: 'YouTube Ads — 6s bumper or 15-30s pre-roll. Hook in 5 seconds. Clear branding and CTA.',
  tiktok_ads: 'TikTok Ads — native feel, UGC-style, trend-aware, vertical 9:16, hook in first frame.',
  website: 'Website/Landing Page — conversion-focused, clear hierarchy, supporting video/visuals.',
  email: 'Email — subject line critical, scannable, personal tone, clear single CTA.',
};

export async function generateContent(request: AIGenerateRequest): Promise<string> {
  const provider = getProvider();

  const systemMessage: AIMessage = {
    role: 'system',
    content: `You are the AI Director for a cinema and media production OS. You generate production-grade creative content for commercials, brand films, social ads, campaigns, and digital media. Be specific, cinematic, and production-ready. Format your output clearly with markdown.`,
  };

  let userPrompt = CONTENT_TYPE_PROMPTS[request.type];

  if (request.projectContext) {
    const ctx = request.projectContext;
    userPrompt += `\n\nProject context:\n- Title: ${ctx.title}\n- Type: ${ctx.type}\n- Description: ${ctx.description}`;
    if (ctx.targetPlatform) {
      userPrompt += `\n- Target platform: ${PLATFORM_CONTEXT[ctx.targetPlatform]}`;
    }
    if (ctx.notes) {
      userPrompt += `\n- Notes: ${ctx.notes}`;
    }
  }

  if (request.platform) {
    userPrompt += `\n\nOptimize for: ${PLATFORM_CONTEXT[request.platform]}`;
  }

  if (request.additionalInstructions) {
    userPrompt += `\n\nAdditional instructions: ${request.additionalInstructions}`;
  }

  const messages: AIMessage[] = [
    systemMessage,
    { role: 'user', content: userPrompt },
  ];

  return provider.generateCompletion(messages);
}

export async function generatePublishCopy(project: {
  title: string;
  type: string;
  description: string;
  notes: string;
}, platform: Platform): Promise<{
  title: string;
  description: string;
  caption: string;
  hashtags: string;
  cta: string;
}> {
  const provider = getProvider();

  const systemMessage: AIMessage = {
    role: 'system',
    content: 'You are a social media optimization expert. Generate publish-ready copy for content creators. Always respond in valid JSON format.',
  };

  const userPrompt = `Generate publish-ready copy for ${PLATFORM_CONTEXT[platform]}.

Project: "${project.title}" (${project.type})
Description: ${project.description}
Notes: ${project.notes}

Respond ONLY with this JSON format (no markdown, no code blocks):
{"title":"optimized title","description":"full description","caption":"post caption/text","hashtags":"relevant hashtags","cta":"call to action"}`;

  const result = await provider.generateCompletion([systemMessage, { role: 'user', content: userPrompt }]);

  try {
    // Try to extract JSON from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return {
    title: project.title,
    description: project.description,
    caption: `Check out: ${project.title}`,
    hashtags: '#content #creator',
    cta: 'Follow for more!',
  };
}
