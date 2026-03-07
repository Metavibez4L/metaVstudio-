# Architecture

> metaVstudio — AI Cinema & Media Production OS

---

## Directory Structure

```
metaVstudio-/
├── docs/                          # Documentation
├── data/                          # SQLite database (gitignored)
│   └── metavstudio.db
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
│   │       ├── ai/
│   │       │   ├── chat/route.ts     # AI Director chat endpoint
│   │       │   ├── generate/route.ts # Content generation endpoint
│   │       │   └── publish/route.ts  # Publish copy generation
│   │       ├── health/route.ts       # System health check
│   │       └── preferences/route.ts  # Settings API
│   ├── components/
│   │   ├── Sidebar.tsx               # Navigation (11 items)
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
