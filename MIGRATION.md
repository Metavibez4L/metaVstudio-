# metaVstudio — Migration Guide

## Architecture Overview

```
src/lib/
├── config/         ← Environment profiles & centralized config
│   ├── env.ts      ← Profile detection, config builder, accessors
│   └── index.ts    ← Public exports
├── ai/
│   └── provider.ts ← AI provider abstraction (Ollama, OpenAI, task routing)
├── runtime/        ← Task queue & agent system
│   ├── types.ts    ← Task, Agent, BuiltinTaskType definitions
│   ├── task-runner.ts ← Inline (laptop) / queue-backed (studio) runner
│   └── index.ts
├── storage/        ← Storage abstraction layer
│   └── index.ts    ← Repository interfaces, re-exports data functions
├── services/       ← Integration boundaries (OBS, Screen Studio, watchers)
│   └── index.ts    ← Service registry, health checks, stubs
├── db.ts           ← SQLite database (uses config for path/WAL)
├── data.ts         ← CRUD operations (unchanged, stable API)
└── types.ts        ← All TypeScript types & constants
```

## Deployment Profiles

Set `DEPLOYMENT_PROFILE` in `.env.local` to switch modes:

| Profile  | Target Hardware          | Key Differences                              |
|----------|--------------------------|----------------------------------------------|
| `laptop` | MacBook Air M4 (24GB)    | Single AI request, no background tasks, no watchers |
| `studio` | Mac Studio M3 Ultra (96GB)| 4 concurrent AI, background tasks, file watchers, scheduled jobs |
| `cloud`  | Remote server (future)   | OpenAI default, 8 concurrent, no local integrations |

### Laptop Mode (Current Default)
- All tasks run inline (synchronous)
- Single Ollama connection
- SQLite in WAL mode at `./data/metavstudio.db`
- No file watchers or background automation
- Integration stubs only (manual workflow)

### Studio Mode (Mac Studio Target)
- Background task queue enabled
- Up to 4 concurrent AI requests
- File watchers monitor `~/Desktop/captures` and `~/Movies/exports`
- Scheduled jobs for auto-summarization, content batching
- Full integration with Screen Studio and OBS via AppleScript/WebSocket
- Same SQLite backend (or upgrade to Postgres when ready)

### Cloud Mode (Future)
- OpenAI as default provider
- 8 concurrent AI requests
- No local macOS integrations
- Web-based Excalidraw mode

## Migration Steps: Laptop → Mac Studio

### 1. Transfer the Codebase
```bash
# On laptop — push to Git
cd /path/to/metaVstudio-
git add -A && git commit -m "pre-migration snapshot"
git push origin main

# On Mac Studio
git clone <repo-url> metaVstudio-
cd metaVstudio-
npm install
```

### 2. Copy the Database
```bash
# On laptop
scp ./data/metavstudio.db macstudio:/path/to/metaVstudio-/data/

# Or if both on same network:
rsync -avz ./data/ macstudio:/path/to/metaVstudio-/data/
```

### 3. Update Environment Config
Create `.env.local` on Mac Studio:
```env
DEPLOYMENT_PROFILE=studio

# AI — Ollama should be running on Mom Studio with more powerful models
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=kimi-k2.5:cloud

# Storage
DATABASE_PATH=./data/metavstudio.db
ASSETS_DIR=./data/assets

# Runtime — enable studio features
ENABLE_BACKGROUND_TASKS=true
ENABLE_SCHEDULED_JOBS=true
MAX_CONCURRENT_AI=4
ENABLE_FILE_WATCHERS=true

# Integrations
WATCH_DIRS=~/Desktop/captures,~/Movies/exports
OBS_WEBSOCKET_URL=ws://localhost:4455
SCREEN_STUDIO_PATH=/Applications/Screen Studio.app

# App
NEXT_PUBLIC_APP_NAME=metaVstudio
```

### 4. Start the App
```bash
npm run build && npm start
# Or for development:
npm run dev
```

### 5. Verify Health
```bash
curl http://localhost:3000/api/health
# Should return profile: "studio" with all services listed
```

## Environment Variables Reference

### Core
| Variable | Default | Description |
|----------|---------|-------------|
| `DEPLOYMENT_PROFILE` | `laptop` | Active profile: `laptop`, `studio`, `cloud` |
| `NEXT_PUBLIC_APP_NAME` | `metaVstudio` | App display name |
| `PORT` | `3000` | Server port |

### AI
| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `ollama` | AI backend: `ollama`, `openai` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `kimi-k2.5:cloud` | Ollama model name |
| `OPENAI_API_KEY` | — | OpenAI API key (if provider=openai) |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI base URL |
| `AI_MAX_TOKENS` | `2000`/`4000` | Max tokens per generation |
| `AI_TEMPERATURE` | `0.7` | Default temperature |

### Storage
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `./data/metavstudio.db` | SQLite database file path |
| `ASSETS_DIR` | `./data/assets` | File storage directory |
| `DB_WAL_MODE` | `true` | Enable WAL journaling |

### Runtime
| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_BACKGROUND_TASKS` | `false`/`true` | Background task queue |
| `ENABLE_SCHEDULED_JOBS` | `false`/`true` | Cron-like scheduled jobs |
| `MAX_CONCURRENT_AI` | `1`/`4`/`8` | Max parallel AI requests |
| `ENABLE_FILE_WATCHERS` | `false`/`true` | Auto-import file watchers |

### Integrations
| Variable | Default | Description |
|----------|---------|-------------|
| `SCREEN_STUDIO_PATH` | `/Applications/Screen Studio.app` | Screen Studio app path |
| `OBS_WEBSOCKET_URL` | `ws://localhost:4455` | OBS WebSocket URL |
| `EXCALIDRAW_MODE` | `local` | Excalidraw mode: `local`, `web` |
| `WATCH_DIRS` | — | Comma-separated watch directories |

## Future Enhancements (Studio Mode)

### Phase 1: Background Processing
- [ ] Implement persistent job queue (SQLite-backed)
- [ ] Add worker threads for AI generation
- [ ] Auto-generate summaries when projects move to "editing" status

### Phase 2: File Automation
- [ ] Chokidar file watchers for `WATCH_DIRS`
- [ ] Auto-create assets from watched folders
- [ ] AppleScript bridge for Screen Studio start/stop

### Phase 3: Advanced AI
- [ ] Multi-model routing (fast model for chat, large model for scripts)
- [ ] Agent chains for multi-step content generation
- [ ] Local embedding model for semantic search across projects

### Phase 4: External Integrations
- [ ] OBS WebSocket scene switching
- [ ] Calendar integration for scheduled content
- [ ] YouTube/X API for direct publishing
