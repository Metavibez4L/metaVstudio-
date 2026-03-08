# Architecture

> metaVstudio — AI Cinema & Media Production OS

---

## Directory Structure

```
metaVstudio-/
├── docs/                          # Documentation
├── data/                          # SQLite database (gitignored)
│   └── metavstudio.db
├── .openclaw/                     # OpenClaw agent workspaces
│   └── workspaces/
│       ├── executive-producer/SOUL.md
│       ├── creative-director/SOUL.md
│       ├── script-architect/SOUL.md
│       ├── shot-planner/SOUL.md
│       ├── post-supervisor/SOUL.md
│       ├── campaign-strategist/SOUL.md
│       └── asset-librarian/SOUL.md
├── openclaw.json                  # OpenClaw gateway config (7 agents, tool profiles)
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout + Sidebar
│   │   ├── page.tsx               # Redirect → /dashboard
│   │   ├── dashboard/page.tsx     # Production command center
│   │   ├── productions/
│   │   │   ├── page.tsx           # Productions listing + filters
│   │   │   └── [id]/page.tsx      # Production detail + pipeline
│   │   ├── briefs/page.tsx        # Creative briefs
│   │   ├── shots/page.tsx         # Scenes & shot design
│   │   ├── storyboards/page.tsx   # Storyboard frame grid
│   │   ├── deliverables/page.tsx  # Deliverable matrix + status
│   │   ├── campaigns/page.tsx     # Campaign management
│   │   ├── post/page.tsx          # Post-production / edit versions
│   │   ├── assistant/page.tsx     # AI Director (chat interface)
│   │   ├── agents/page.tsx        # Agent production team dashboard
│   │   ├── integrations/page.tsx  # Integration dashboard (6 modules)
│   │   ├── assets/page.tsx        # Cross-project asset library
│   │   ├── settings/page.tsx      # Creator preferences
│   │   ├── projects/              # Legacy project pages
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── publish/page.tsx       # Legacy publish prep
│   │   ├── workflows/page.tsx     # Legacy workflow checklists
│   │   ├── actions.ts             # Legacy server actions
│   │   ├── production-actions.ts  # Production server actions
│   │   └── api/
│   │       ├── agents/
│   │       │   ├── invoke/route.ts    # Agent invocation + orchestration
│   │       │   └── directory/route.ts # Agent roster & capabilities
│   │       ├── integrations/
│   │       │   └── route.ts           # Integration health + action execution
│   │       ├── ai/
│   │       │   ├── chat/route.ts     # AI Director chat endpoint
│   │       │   ├── generate/route.ts # Content generation endpoint
│   │       │   └── publish/route.ts  # Publish copy generation
│   │       ├── health/route.ts       # System health check
│   │       └── preferences/route.ts  # Settings API
│   ├── components/
│   │   ├── Sidebar.tsx               # Navigation (13 items)
│   │   ├── ProductionCreateButton.tsx # New production modal
│   │   ├── ProductionEditor.tsx       # Production CRUD + status pipeline
│   │   ├── ProjectCreateButton.tsx    # Legacy project modal
│   │   ├── ProjectEditor.tsx          # Legacy project editor
│   │   ├── AssetList.tsx              # Asset list + upload form
│   │   ├── DraftList.tsx              # AI draft list + generator
│   │   ├── PublishPanel.tsx           # Publish prep form
│   │   └── PreferencesEditor.tsx      # Settings form
│   └── lib/
│       ├── types.ts               # All domain types + display constants (542 lines)
│       ├── db.ts                  # SQLite init + schema (15 tables)
│       ├── data.ts                # Legacy CRUD (projects, assets, drafts)
│       ├── production-data.ts     # Production CRUD (543 lines, 9 entities)
│       ├── agents/                # Multi-agent production system
│       │   ├── types.ts           # Agent contracts, task schemas, output types
│       │   ├── base-agent.ts      # BaseAgent abstract class (dual-mode: direct/openclaw)
│       │   ├── context.ts         # ProductionContext builder from DB
│       │   ├── registry.ts        # Agent registry singleton
│       │   ├── orchestrator.ts    # EP dispatch engine + orchestration
│       │   ├── openclaw-client.ts # OpenClaw gateway HTTP client
│       │   ├── index.ts           # Public barrel exports
│       │   └── agents/
│       │       ├── executive-producer.ts
│       │       ├── creative-director.ts
│       │       ├── script-architect.ts
│       │       ├── shot-planner.ts
│       │       ├── post-supervisor.ts
│       │       ├── campaign-strategist.ts
│       │       └── asset-librarian.ts
│       ├── integrations/          # macOS native integrations
│       │   ├── types.ts           # Integration types, presets, constants
│       │   ├── applescript.ts     # AppleScript execution (9 commands via osascript)
│       │   ├── shortcuts.ts       # macOS Shortcuts.app CLI runner
│       │   ├── folder-watcher.ts  # fs.watch directory monitoring (25+ extensions)
│       │   ├── obs.ts             # OBS WebSocket v5 control (8 actions)
│       │   ├── export-pipeline.ts # ffmpeg encoding (8 platform presets)
│       │   ├── agent-tasks.ts     # 20 predefined agent tasks (6 categories)
│       │   ├── registry.ts        # Integration health check system
│       │   └── index.ts           # Barrel exports
│       ├── ai/
│       │   └── provider.ts        # AI provider abstraction + content prompts
│       ├── config/
│       │   ├── env.ts             # Environment config + deployment profiles
│       │   └── index.ts           # Config re-exports
│       ├── runtime/
│       │   ├── task-runner.ts     # Task queue (future use)
│       │   ├── types.ts           # Runtime type definitions
│       │   └── index.ts
│       ├── services/
│       │   └── index.ts           # Integration service layer
│       └── storage/
│           └── index.ts           # Storage abstraction layer
├── .env.example                   # Environment template
├── .env.local                     # Active environment config
├── next.config.ts                 # Next.js config (externalPackages)
├── tsconfig.json                  # TypeScript strict config
├── tailwind config                # Via postcss.config.mjs + CSS @theme
└── package.json                   # Dependencies & scripts
```

---

## Layer Architecture

```
┌──────────────────────────────────────────────────┐
│                   UI Layer                        │
│  Pages (App Router)  ←→  Components (Client)     │
│  Server Components       Client Components       │
└──────────────┬────────────────────┬──────────────┘
               │                    │
┌──────────────▼──────────┐ ┌──────▼──────────────┐
│    Server Actions       │ │    API Routes        │
│  production-actions.ts  │ │  /api/ai/*           │
│  actions.ts (legacy)    │ │  /api/health         │
└──────────────┬──────────┘ │  /api/preferences    │
               │            └──────┬──────────────┘
┌──────────────▼───────────────────▼──────────────┐
│              Data Layer                          │
│  production-data.ts    data.ts (legacy)          │
│  (9 entities CRUD)     (projects, assets, etc)   │
└──────────────┬───────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│              Database Layer                       │
│  db.ts → better-sqlite3 → ./data/metavstudio.db │
│  15 tables, WAL mode, foreign keys               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              AI Layer                            │
│  provider.ts → OllamaProvider / OpenAIProvider   │
│  Ollama (localhost:11434) → kimi-k2.5:cloud      │
│  14 content generation types + chat              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              Agent Layer                         │
│  7 production agents (BaseAgent subclasses)      │
│  Registry → Orchestrator → Handoff Protocol      │
│  EP coordinates, specialists execute in-role     │
│  40+ task types → typed structured outputs       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            OpenClaw Layer                        │
│  openclaw-client.ts → Gateway HTTP API           │
│  Dual-mode: direct (Ollama) / openclaw (tools)   │
│  Per-agent tool profiles (fs, web, exec, image)  │
│  SOUL.md workspaces for agent identity            │
│  Gateway: http://127.0.0.1:18789                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           Integrations Layer                     │
│  6 macOS-native modules:                         │
│  AppleScript (osascript) │ Shortcuts (CLI)       │
│  Folder Watcher (fs.watch) │ OBS (WebSocket v5)  │
│  Export Pipeline (ffmpeg, 8 presets)              │
│  Agent Tasks (20 tasks, 6 categories)            │
│  Registry: health checks per integration         │
│  API: GET /api/integrations, POST actions         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              Config Layer                        │
│  env.ts → getConfig() singleton                  │
│  Profiles: laptop / studio / cloud               │
│  AI routing, storage paths, feature flags        │
└─────────────────────────────────────────────────┘
```

---

## Data Flow

### Server Component Page Load
```
Browser → App Router → Server Component
  → production-data.ts (getProductions, getShots, etc.)
    → db.ts (getDb → SQLite query)
  → Render HTML → Stream to client
```

### Client Mutation (Server Action)
```
User Click → Client Component → Server Action Call
  → production-actions.ts (createProductionAction, etc.)
    → production-data.ts (createProduction, etc.)
      → db.ts (SQLite INSERT/UPDATE)
    → revalidatePath() (cache bust)
  → Router refresh → Re-render
```

### AI Chat
```
User Input → Client fetch('/api/ai/chat')
  → route.ts → getProviderForTask('chat')
    → OllamaProvider.generateCompletion()
      → POST http://localhost:11434/v1/chat/completions
    → Return content
  → Display in chat UI
```

---

## Key Design Decisions

1. **Server Components by default** — All listing pages are server components; only interactive elements (editors, forms, chat) are client components.

2. **SQLite for everything** — No external DB dependency. WAL mode for concurrent reads. Single file at `./data/metavstudio.db`. Auto-creates tables on first run.

3. **AI provider abstraction** — `AIProvider` interface allows swapping Ollama ↔ OpenAI without changing consuming code. Provider selected via config.

4. **No ORM** — Raw SQL via better-sqlite3 for maximum control and zero overhead. Manual row-to-type mappers.

5. **Preserving legacy** — v1 project system kept intact alongside v2 production system. Both data layers coexist, letting users migrate at their own pace.

6. **Config-driven deployment** — `DEPLOYMENT_PROFILE` env var switches between laptop/studio/cloud presets, changing AI models, storage paths, and feature flags.

7. **Multi-agent orchestration** — 7 specialized agents with clear roles and boundaries. Executive Producer coordinates, specialists stay in-role. Handoff protocol chains work across agents. Laptop mode runs sequential inline; studio mode enables parallel execution.

8. **OpenClaw tooling layer** — Agents can execute via the OpenClaw gateway for real tool access (filesystem, shell, web search, browser, image gen). Dual-mode execution: `direct` (Ollama only), `openclaw` (gateway + tools), `auto` (detect gateway availability). Each agent has a SOUL.md identity file and a scoped tool profile defined in `openclaw.json`.

9. **macOS-native integrations** — 6 integration modules using native CLI tools (osascript, shortcuts, ffmpeg) and Node.js APIs (fs.watch, HTTP). Each integration has a health check, typed interface, and is accessible via the `/api/integrations` endpoint. Export pipeline supports 8 platform presets. Agent task execution bridges the agent system to integration actions.

---

## Production Types (16)

```
commercial | brand_film | product_film | promo | trailer |
short_film | documentary | social_ad | music_video | pitch_video |
tutorial | explainer | campaign | launch_video | bts | other
```

## Platform Targets (10)

```
youtube | x | tiktok | instagram | linkedin |
meta_ads | youtube_ads | tiktok_ads | website | email
```
