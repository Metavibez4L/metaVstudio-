# AI System

> metaVstudio — AI Director & content generation reference

---

## Overview

metaVstudio uses a local-first AI architecture powered by Ollama with an OpenAI-compatible API. The system supports two providers that can be swapped via configuration:

| Provider | Use Case | Auth Required |
|----------|----------|---------------|
| **Ollama** (default) | Local inference, no cloud dependency | None |
| **OpenAI** (optional) | Cloud fallback for hosted deployments | API key |

---

## Configuration

```env
# .env.local
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=kimi-k2.5:cloud
AI_TEMPERATURE=0.7

# Optional cloud fallback
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_BASE_URL=https://api.openai.com/v1
```

Provider selection is handled by `getConfig().ai.provider` and the deployment profile:

| Profile | Default Provider | Default Model |
|---------|-----------------|---------------|
| `laptop` | Ollama | kimi-k2.5:cloud |
| `studio` | Ollama | kimi-k2.5:cloud (+ faster hardware) |
| `cloud` | OpenAI | gpt-4o |

---

## Provider Architecture

```
src/lib/ai/provider.ts
│
├── AIProvider (interface)
│   └── generateCompletion(messages, options?) → Promise<string>
│
├── OllamaProvider (class)
│   └── POST http://localhost:11434/v1/chat/completions
│
├── OpenAIProvider (class)
│   └── POST https://api.openai.com/v1/chat/completions
│
├── getProvider() → AIProvider (singleton based on config)
├── getProviderForTask(task) → AIProvider (task-based routing)
│
└── generateContent(request) → Promise<string> (high-level API)
```

### Task Routing

`getProviderForTask(task)` supports future task-specific provider selection:

| Task | Current Provider | Notes |
|------|-----------------|-------|
| `chat` | Default | AI Director conversations |
| `generate` | Default | Content generation |
| `publish` | Default | Publish copy optimization |
| `summarize` | Default | Future: project summarization |
| `agent` | Default | Future: autonomous agent tasks |

---

## AI Endpoints

### `POST /api/ai/chat`

Real-time conversation with the AI Director.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Write a creative brief for a product launch film" }
  ]
}
```

**Response:**
```json
{
  "content": "# Creative Brief: Product Launch Film\n\n## Objective\n..."
}
```

**System Prompt** (injected automatically):
> You are the AI Director inside metaVstudio — a cinema & media production OS. You are a senior creative director and production strategist...

The system prompt covers: creative briefs, treatments, ad concepts, scene breakdowns, scripts, campaign strategy, post-production notes, deliverable planning, content repurposing, scheduling, budgeting, DaVinci/Premiere/Frame.io workflows.

---

### `POST /api/ai/generate`

Structured content generation with 14 types.

**Request:**
```json
{
  "type": "creative_brief",
  "projectContext": {
    "title": "Summer Launch Campaign",
    "type": "commercial",
    "description": "30-second hero spot for new product line",
    "targetPlatform": "meta_ads",
    "notes": "Premium feel, luxury market"
  },
  "additionalInstructions": "Focus on emotional storytelling"
}
```

**Response:**
```json
{
  "content": "# Creative Brief: Summer Launch Campaign\n\n..."
}
```

---

## Content Generation Types

### Original (7 types)

| Type | Prompt Summary |
|------|---------------|
| `hook` | 3-5 compelling opening lines, attention-grabbing |
| `script` | Complete script with intro, transitions, outro |
| `outline` | Detailed outline with timing suggestions |
| `shot_list` | Shot descriptions, angles, timing notes |
| `thumbnail_idea` | 3-5 thumbnail concepts with visual direction |
| `post_copy` | Social media copy with hook, value prop, CTA |
| `cta` | 5-7 CTA variations mixing soft and hard asks |

### Production (7 new types)

| Type | Prompt Summary |
|------|---------------|
| `creative_brief` | Full brief: objective, audience, messaging, visual direction, deliverables, constraints |
| `treatment` | Cinematic treatment: visual style, narrative, mood, pacing, color, music/sound |
| `ad_concept` | 3 ad concept variations: name, hook, visual moment, messaging, CTA |
| `scene_breakdown` | INT/EXT scene list: number, location, time, description, talent, props, actions |
| `edit_notes` | Post-production: pacing, cuts, transitions, B-roll, music cues, color grade, captions |
| `delivery_checklist` | Multi-platform: format specs, aspect ratios, durations, naming, thumbnails, metadata |
| `repurposing_plan` | 5-8 derivative pieces: format, duration, platform hooks, posting cadence |

---

## Platform Context

When a target platform is specified, the AI receives platform-specific optimization instructions:

| Platform | Focus |
|----------|-------|
| `youtube` | Search optimization, watch time, engagement |
| `x` | Concise, punchy, 280-char limit, thread-friendly |
| `tiktok` | Hook in 2s, trendy, casual, vertical video |
| `instagram` | Visual-first, carousel-friendly, emoji-friendly |
| `linkedin` | Professional, thought leadership, value-driven |
| `meta_ads` | Direct response, value prop, visual hook, compliance |
| `youtube_ads` | 6s bumper or 15-30s pre-roll, hook in 5s, branding |
| `tiktok_ads` | Native UGC feel, trend-aware, 9:16, hook first frame |
| `website` | Conversion-focused, hierarchy, supporting video |
| `email` | Subject line priority, scannable, personal, single CTA |

---

## AI Director Suggestions

The assistant page offers production-focused quick prompts:

- "Write a creative brief for a product launch film"
- "Generate a scene breakdown for a 30s ad spot"
- "Create a shot list for a cinematic brand video"
- "Build an ad campaign with 3 messaging angles"
- "Write post-production edit notes for my rough cut"
- "Create a content repurposing plan from hero film"

---

## Future: Task Runner Integration

The runtime layer (`src/lib/runtime/task-runner.ts`) provides infrastructure for:

- Queued AI generation tasks
- Background content processing
- Multi-step agent workflows (e.g., auto-generate brief → scenes → shots)
- Priority-based task scheduling

This layer is built but not yet wired to the UI.
