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

## Multi-Agent Production System

The agent system (`src/lib/agents/`) provides a disciplined multi-agent architecture for production workflows.

### Architecture

```
src/lib/agents/
├── types.ts              # Agent contracts, 40+ task types, typed outputs
├── base-agent.ts         # BaseAgent abstract class (dual-mode execution)
├── context.ts            # Builds ProductionContext from DB
├── registry.ts           # Agent registry singleton
├── orchestrator.ts       # EP dispatch + multi-agent orchestration
├── openclaw-client.ts    # OpenClaw gateway HTTP client
├── index.ts              # Public barrel
└── agents/
    ├── executive-producer.ts   # Orchestrator → routes, tracks, prioritizes
    ├── creative-director.ts    # Vision → briefs, treatments, concepts
    ├── script-architect.ts     # Narrative → scripts, hooks, VO, CTAs
    ├── shot-planner.ts         # Visual → shot lists, coverage, camera
    ├── post-supervisor.ts      # Editorial → edit plans, delivery, QC
    ├── campaign-strategist.ts  # Distribution → ads, copy, repurposing
    └── asset-librarian.ts      # Organization → maps, tags, naming
```

### Agent API Endpoints

**Direct Invocation — `POST /api/agents/invoke`**
```json
{
  "taskType": "creative-brief",
  "goal": "Create a brief for a luxury watch brand film",
  "productionId": "uuid-here",
  "platform": "youtube",
  "mode": "auto"
}
```

`mode` can be `"direct"` (Ollama only), `"openclaw"` (gateway + tools), or `"auto"` (detect gateway, default).

**Orchestrated Execution — `POST /api/agents/invoke`**
```json
{
  "orchestrate": true,
  "goal": "Plan the full pre-production for this project",
  "productionId": "uuid-here",
  "mode": "auto"
}
```

**Agent Directory — `GET /api/agents/directory`**
Returns all agents, capabilities, hierarchy.

### Handoff Protocol

Agents return `HandoffRequest[]` to trigger work in other agents:
- Creative Director → Script Architect (after brief/treatment)
- Creative Director → Campaign Strategist (after campaign concept)
- Script Architect → Shot Planner (after scripts)
- Shot Planner → Post Supervisor (after shot design)
- Post Supervisor → Campaign Strategist (after delivery matrix)
- Post Supervisor → Asset Librarian (after edit plan)

### Execution Modes

| Mode | Behavior |
|------|----------|
| **direct** | Ollama/OpenAI only — no external tools, fast, offline-safe |
| **openclaw** | OpenClaw gateway — agents get real tools (fs, exec, web, image, browser) |
| **auto** | Detect gateway availability; fall back to direct if offline |
| **Laptop** | Sequential inline execution, 1-level handoff depth |
| **Studio** | Parallel execution, 2-level handoff depth, 4 concurrent AI |
| **Cloud** | Full parallel, 8 concurrent AI, OpenAI provider |

---

## OpenClaw Integration

The agent system integrates with [OpenClaw](https://docs.openclaw.ai/) (v2026.3.2) to give agents access to real system tools via the OpenClaw gateway.

### Configuration

**Root config** — `openclaw.json`:
- Defines 7 agents with per-agent tool profiles
- Sets gateway port (18789), loop detection, default model
- Each agent has `allow`/`deny` tool lists and a profile (`full` or `coding`)

**Agent workspaces** — `.openclaw/workspaces/{agent}/SOUL.md`:
- Agent identity, personality, role definition
- Tool usage guides mapping to allowed OpenClaw tools
- Boundaries, standards, output format instructions

**Environment variables:**
```env
OPENCLAW_ENABLED=true              # Enable OpenClaw execution mode
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=            # Optional auth token
OPENCLAW_TIMEOUT_MS=120000         # Gateway request timeout
```

### Gateway Client (`openclaw-client.ts`)

```
getOpenClawConfig()          → OpenClawConfig
spawnAgentRun(request)       → OpenClawSpawnResult  (POST /api/v1/sessions/spawn)
sendToSession(key, msg)      → string               (POST /api/v1/sessions/send)
listSessions()               → SessionInfo[]        (POST /api/v1/sessions/list)
getSessionStatus(key?)       → StatusInfo            (POST /api/v1/sessions/status)
checkGatewayHealth()         → { ok, version, agents[] }  (GET /health)
executeViaOpenClaw(role, task, goal, opts) → AgentResult  (high-level)
isOpenClawAvailable()        → boolean               (health check)
```

### Dual-Mode Execution Flow

```
API Request → Orchestrator.resolveMode()
  ├── mode="direct"   → BaseAgent.executeDirect()  → Ollama/OpenAI
  ├── mode="openclaw" → BaseAgent.executeViaOpenClaw() → Gateway → Real Tools
  └── mode="auto"     → check OPENCLAW_ENABLED + gateway health
                        ├── gateway online  → openclaw mode
                        └── gateway offline → direct mode
```

### Tool Groups Available

| Group | Tools | Used By |
|-------|-------|---------|
| `group:fs` | read_file, write_file, edit_file, apply_patch | All agents |
| `group:runtime` | exec, process (shell) | EP, Post Supervisor, Asset Librarian |
| `group:web` | web_search, web_fetch | EP, Creative Dir, Script, Shot, Post, Campaign |
| `group:memory` | memory_search, memory_get | All agents |
| `group:sessions` | spawn, send, list, status | EP (sub-agent routing) |
| `browser` | Headless browser | Creative Dir, Campaign Strategist |
| `image` | Image gen/analysis | EP, Creative Dir, Shot Planner, Asset Librarian |
| `pdf` | PDF reading/creation | Post Supervisor |

---

## Task Runner Integration

The runtime layer (`src/lib/runtime/task-runner.ts`) provides infrastructure for:

- Queued AI generation tasks
- Background content processing
- Multi-step agent workflows (agent system now implements this)
- Priority-based task scheduling

This layer is built but not yet wired to the UI.

---

## Integrations System

The integrations layer (`src/lib/integrations/`) provides 6 macOS-native modules that extend the production OS with real system capabilities.

### Architecture

```
src/lib/integrations/
├── types.ts           # Types, presets, constants for all 6 integrations
├── applescript.ts     # AppleScript execution via osascript CLI
├── shortcuts.ts       # macOS Shortcuts.app CLI runner
├── folder-watcher.ts  # fs.watch directory monitoring
├── obs.ts             # OBS WebSocket v5 control
├── export-pipeline.ts # ffmpeg-based encoding pipeline
├── agent-tasks.ts     # 20 predefined agent task definitions
├── registry.ts        # Health check system for all integrations
└── index.ts           # Barrel exports
```

### Integration Modules

| Module | External Tool | Capabilities |
|--------|--------------|--------------|
| **AppleScript** | `osascript` CLI | 9 commands: open/activate/quit app, Finder reveal, notification, Screen Studio record/stop, DaVinci Resolve open, custom scripts |
| **Shortcuts** | `shortcuts` CLI | Run any macOS Shortcut by name with optional text input, list all available shortcuts |
| **Folder Watcher** | Node.js `fs.watch` | Monitor directories for media files (25+ extensions), event log (200 cap), 3 default watch folders |
| **OBS Control** | OBS WebSocket v5 | 8 actions: get-status, start/stop-recording, start/stop-streaming, switch-scene, get-scenes, toggle-source |
| **Export Pipeline** | `ffmpeg` CLI | 8 platform presets (YouTube 4K/1080, TikTok 9:16, Instagram 1:1, Meta Ad, Web VP9, Archive ProRes, Custom), job queue |
| **Agent Tasks** | Internal | 20 predefined tasks across 6 categories (content-generation, production-planning, review-analysis, export-automation, file-management, campaign-execution) |

### Export Presets

| Preset | Resolution | Codec | Format |
|--------|-----------|-------|--------|
| `youtube-4k` | 3840×2160 | H.264 | MP4 |
| `youtube-1080` | 1920×1080 | H.264 | MP4 |
| `tiktok-9x16` | 1080×1920 | H.264 | MP4 |
| `instagram-1x1` | 1080×1080 | H.264 | MP4 |
| `meta-ad` | 1200×628 | H.264 | MP4 |
| `web-optimized` | 1920×1080 | VP9 | WebM |
| `archive` | Source | ProRes | MOV |
| `custom` | User-defined | User-defined | User-defined |

### Integration API

**`GET /api/integrations`** — Returns health status for all 6 modules, export presets, active jobs, watcher events, agent task categories.

**`POST /api/integrations`** — Execute actions:
```json
{
  "integration": "applescript",
  "action": "run",
  "params": { "command": "notification", "args": { "title": "Done", "message": "Export complete" } }
}
```

Supported integration+action combos:
- `applescript` → `run`
- `shortcuts` → `run`, `list`
- `obs` → Any OBS action (start-recording, switch-scene, etc.)
- `folder-watcher` → `status`
- `export-pipeline` → `list-presets`, `list-jobs`
- `agent-tasks` → `list`
