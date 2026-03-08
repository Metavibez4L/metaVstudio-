# metaVstudio — Project Status

> **AI Cinema & Media Production OS**
> Last updated: 2026-03-07

---

## Build Status

| Metric | Value |
|--------|-------|
| **Build** | ✅ Passing |
| **TypeScript** | ✅ Strict, zero errors |
| **Routes** | 27 (18 dynamic, 4 static, 5 API) |
| **Source Files** | 74 |
| **Total Lines** | ~10,290 |
| **Agent Files** | 14 (~2,190 lines) |
| **Integration Files** | 10 (~1,200 lines) |
| **Framework** | Next.js 16.1.6 (Turbopack) |
| **OpenClaw** | ✅ Integrated (v2026.3.2) |

---

## System Overview

**metaVstudio** is a local-first, AI-powered cinema and media production operating system. It manages the full lifecycle of video production — from creative concept through post-production to multi-platform delivery.

- **Runtime**: Node.js, Next.js App Router, React 19
- **Database**: SQLite (better-sqlite3, WAL mode, foreign keys)
- **AI Engine**: Ollama (local inference, kimi-k2.5:cloud model)
- **Agent System**: 7 production agents, orchestration engine, handoff protocol
- **Agent Tooling**: OpenClaw gateway (real tools: fs, exec, web, browser, image, memory)
- **Integrations**: 6 macOS-native modules (AppleScript, Shortcuts, Folder Watchers, OBS, Export Pipelines, Agent Tasks)
- **UI**: Tailwind CSS v4, cyberpunk/neon design system
- **Storage**: Local filesystem, `./data/metavstudio.db`

---

## Feature Status

### Production Layer (v2.0 — Current)

| Feature | Route | Status |
|---------|-------|--------|
| Production Command Dashboard | `/dashboard` | ✅ Live |
| Productions (CRUD + pipeline) | `/productions`, `/productions/[id]` | ✅ Live |
| Creative Briefs | `/briefs` | ✅ Live |
| Shot Design (scenes + shots) | `/shots` | ✅ Live |
| Storyboard / Visual Planning | `/storyboards` | ✅ Live |
| Deliverables Matrix | `/deliverables` | ✅ Live |
| Campaign Management | `/campaigns` | ✅ Live |
| Post-Production (edit versions) | `/post` | ✅ Live |
| AI Director (chat) | `/assistant` | ✅ Live |
| Agent Production Team | `/agents` | ✅ Live |
| Asset Library | `/assets` | ✅ Live |
| Integrations Dashboard | `/integrations` | ✅ Live |
| Settings / Config | `/settings` | ✅ Live |

### Legacy Layer (v1.0 — Preserved)

| Feature | Route | Status |
|---------|-------|--------|
| Projects (original CRUD) | `/projects`, `/projects/[id]` | ✅ Preserved |
| Publish Prep | `/publish` | ✅ Preserved |
| Workflows / Checklists | `/workflows` | ✅ Preserved |

### API Endpoints

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `POST /api/ai/chat` | AI Director chat (Ollama) | ✅ Live |
| `POST /api/ai/generate` | Content generation (14 types) | ✅ Live |
| `POST /api/ai/publish` | Publish copy generation | ✅ Live |
| `GET /api/health` | System health check | ✅ Live |
| `GET/PUT /api/preferences` | Creator preferences | ✅ Live |
| `POST /api/agents/invoke` | Agent invocation + orchestration | ✅ Live |
| `GET /api/agents/directory` | Agent roster & capabilities | ✅ Live |
| `GET /api/integrations` | Integration health & status | ✅ Live |
| `POST /api/integrations` | Execute integration actions | ✅ Live |

---

## Production Pipeline Stages

The 12-stage production pipeline:

```
CONCEPT → BRIEFING → PRE-PRODUCTION → SCHEDULED → IN PRODUCTION →
INGESTED → EDITING → REVIEW → REVISION → FINAL DELIVERY → PUBLISHED → ARCHIVED
```

---

## Database Schema

| Table | Purpose | Records |
|-------|---------|---------|
| `productions` | Production projects (primary entity) | Dynamic |
| `creative_briefs` | Strategy & creative direction docs | Dynamic |
| `campaigns` | Ad/campaign strategy & messaging | Dynamic |
| `deliverables` | Output formats & delivery specs | Dynamic |
| `scenes` | Scene breakdown per production | Dynamic |
| `shots` | Shot list per scene | Dynamic |
| `storyboard_frames` | Visual frame planning | Dynamic |
| `edit_versions` | Post-production edit tracking | Dynamic |
| `production_notes` | Cross-category production notes | Dynamic |
| `projects` | Legacy projects (v1) | Dynamic |
| `assets` | File/media asset registry | Dynamic |
| `content_drafts` | AI-generated content pieces | Dynamic |
| `workflow_templates` | Tool workflow checklists | Dynamic |
| `creator_preferences` | User settings key/value store | Dynamic |
| `publish_preps` | Platform publish metadata | Dynamic |

---

## AI Content Generation Types

| Type | Description |
|------|-------------|
| `hook` | Attention-grabbing opening lines |
| `script` | Full production scripts |
| `outline` | Structured content outlines |
| `shot_list` | Camera angle & shot planning |
| `thumbnail_idea` | Visual thumbnail concepts |
| `post_copy` | Social media post copy |
| `cta` | Call-to-action variations |
| `creative_brief` | Full creative brief documents |
| `treatment` | Cinematic treatment / visual direction |
| `ad_concept` | Multi-variant ad concepts |
| `scene_breakdown` | Detailed scene-by-scene breakdown |
| `edit_notes` | Post-production edit guidance |
| `delivery_checklist` | Multi-platform delivery specs |
| `repurposing_plan` | Content adaptation strategy |

---

## Multi-Agent Production System (v3.0)

### OpenClaw Integration

Agents now support dual-mode execution via the [OpenClaw](https://docs.openclaw.ai/) gateway, giving them access to real system tools:

| Feature | Details |
|---------|---------|
| **Gateway** | `http://127.0.0.1:18789` (local) |
| **Version** | v2026.3.2 |
| **Config** | `openclaw.json` (root) |
| **Workspaces** | `.openclaw/workspaces/{agent}/SOUL.md` |
| **Execution Modes** | `direct` (Ollama only), `openclaw` (gateway + tools), `auto` (detect) |

#### Agent Tool Profiles

| Agent | Profile | Allowed Tools |
|-------|---------|---------------|
| Executive Producer | `full` | sessions, memory, fs, web, runtime, image |
| Creative Director | `coding` | fs, web, memory, image, browser |
| Script Architect | `coding` | fs, web, memory |
| Shot Planner | `coding` | fs, web, memory, image |
| Post Supervisor | `coding` | fs, runtime, web, memory, pdf |
| Campaign Strategist | `coding` | fs, web, memory, browser |
| Asset Librarian | `coding` | fs, runtime, memory, image |

#### OpenClaw Tool Groups

- **group:fs** — read_file, write_file, edit_file, apply_patch
- **group:runtime** — exec, process (shell commands)
- **group:web** — web_search, web_fetch
- **group:memory** — memory_search, memory_get (persistent agent memory)
- **group:sessions** — sessions_spawn, sessions_send, sessions_list, sessions_status
- **browser** — headless browser interaction
- **image** — image generation/analysis
- **pdf** — PDF reading/creation

### Agent Hierarchy

```
                 ┌─────────────────────┐
                 │  EXECUTIVE PRODUCER  │
                 │   (Orchestrator)     │
                 └─────────┬───────────┘
        ┌──────────┬───────┴────┬──────────┬──────────┐
        ▼          ▼            ▼          ▼          ▼
   Creative    Script       Shot      Post       Campaign
   Director    Architect    Planner   Supervisor Strategist
                                                    │
                                              Asset Librarian
```

### Agents

| Agent | Role | Capabilities |
|-------|------|--------------|
| **Executive Producer** | Orchestrator | roadmap, milestones, routing, status, blockers, next-steps |
| **Creative Director** | Vision & taste | brief, treatment, concept, brand story, tone, visual language |
| **Script Architect** | Narrative | hero/promo/short scripts, hooks, VO, CTAs, platform variants |
| **Shot Planner** | Visual design | shot lists, scene breakdowns, camera notes, coverage, B-roll |
| **Post Supervisor** | Editorial | edit plans, revisions, delivery matrix, exports, post notes |
| **Campaign Strategist** | Distribution | ad angles, audience variants, platform copy, repurposing, CTAs |
| **Asset Librarian** | Organization | asset maps, tag structures, naming conventions, linked assets |

### Agent Task Types (40+)

Each agent has 4-7 specialized task types mapped to structured output schemas. Tasks are routed automatically via `TASK_AGENT_MAP`.

### Handoff Protocol

Agents declare handoffs when their output requires another specialist:
- Creative Director → Script Architect (after brief/treatment)
- Creative Director → Campaign Strategist (after campaign concept)
- Script Architect → Shot Planner (after scripts)
- Shot Planner → Post Supervisor (after shot design)
- Post Supervisor → Campaign Strategist (after delivery matrix)
- Post Supervisor → Asset Librarian (after edit plan)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Turbopack) | 16.1.6 |
| Runtime | React | 19.2.3 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | v4 |
| Database | better-sqlite3 | 12.6.2 |
| AI | Ollama (OpenAI-compatible API) | Local || Agent Tooling | OpenClaw | v2026.3.2 || Icons | lucide-react | 0.577.0 |
| IDs | uuid | 13.0.0 |
| Dates | date-fns | 4.1.0 |

---

## Deployment Profiles

| Profile | Target | AI Provider |
|---------|--------|-------------|
| `laptop` | MacBook Air M4 | Ollama (local) |
| `studio` | Mac Studio M3 Ultra | Ollama (local, faster) |
| `cloud` | VPS/Cloud deploy | OpenAI API (optional) |

---

## What's Next

- [x] Multi-agent production system (7 agents, orchestration engine)
- [x] Agent hierarchy: EP orchestrator + 6 specialist agents
- [x] Agent dashboard with hierarchy visualization (`/agents`)
- [x] Handoff protocol between agents
- [x] 40+ agent task types with structured output schemas
- [x] OpenClaw integration: dual-mode execution (direct / openclaw / auto)
- [x] OpenClaw agent tooling: per-agent tool profiles, SOUL.md workspaces
- [x] OpenClaw gateway client (`openclaw-client.ts`)
- [x] Dashboard: OpenClaw status, agent crew panel, gateway diagnostics
- [x] Integrations: AppleScript automation (9 commands via osascript)
- [x] Integrations: macOS Shortcuts runner (Shortcuts.app CLI)
- [x] Integrations: Folder Watchers (fs.watch, 25+ media extensions)
- [x] Integrations: OBS WebSocket control (8 actions, recording/streaming/scenes)
- [x] Integrations: Export Pipelines (ffmpeg, 8 platform presets)
- [x] Integrations: Agent Task Execution (20 tasks, 6 categories)
- [x] Integration registry with health checks
- [x] Integration API (GET status, POST execute)
- [x] Integrations dashboard UI (`/integrations`)
- [ ] Production ↔ Asset linking (production-scoped asset management)
- [ ] Inline CRUD on detail pages (briefs, scenes, shots from /productions/[id])
- [ ] DaVinci Resolve / Frame.io integration hooks
- [ ] Multi-production campaign dashboard
- [ ] Export production packages (PDF briefs, shot lists, delivery checklists)
- [ ] Timeline / Gantt view for production scheduling
- [ ] Role-based collaboration (director, editor, producer views)
- [ ] Agent execution history / activity log
- [ ] Agent-to-DB write-back (agents creating briefs, shots, etc. directly)
