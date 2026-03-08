# metaVstudio

**AI Cinema & Media Production OS**

A local-first, AI-powered production operating system for managing the full lifecycle of video and media — from creative concept through post-production to multi-platform delivery.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![SQLite](https://img.shields.io/badge/SQLite-WAL-lightblue) ![License](https://img.shields.io/badge/license-MIT-purple)

---

## Screenshots

> Cyberpunk / neon UI — Production Command Dashboard, AI Director, Shot Design & more.

---

## Features

### Production Pipeline
- **Productions** — Full CRUD with status pipeline (concept → pre-prod → production → post → review → delivered)
- **Creative Briefs** — Define vision, mood, audience, and references per production
- **Shot Design** — Scene and shot breakdown with camera angles, movement, and lighting notes
- **Storyboards** — Visual frame grid for planning sequences
- **Deliverables** — Multi-platform deliverable matrix with specs and status tracking
- **Campaigns** — Campaign management linking productions to business goals
- **Post-Production** — Edit version tracking (rough cut → fine cut → final)

### AI Director
- 14 content generation types (scripts, shot lists, mood boards, social copy, etc.)
- 10 platform-specific contexts (YouTube, TikTok, Instagram, Cinema, etc.)
- Powered by Ollama for local, private inference
- Chat interface with streaming responses

### Multi-Agent Production System
- 7 specialized agents: Executive Producer, Creative Director, Script Architect, Shot Planner, Post Supervisor, Campaign Strategist, Asset Librarian
- EP orchestrator with handoff protocol between agents
- 40+ task types with typed structured outputs
- **OpenClaw integration**: dual-mode execution (direct/openclaw/auto)
- Per-agent tool profiles via OpenClaw gateway (fs, exec, web, browser, image, memory)
- SOUL.md workspace files for agent identity and personality

### Integrations (macOS Native)
- **AppleScript Automation** — 9 commands via `osascript` (open/quit apps, Finder, notifications, Screen Studio, DaVinci)
- **macOS Shortcuts** — Run any Shortcuts.app automation by name with input passthrough
- **Folder Watchers** — `fs.watch` monitoring with 25+ media extension filters, event log
- **OBS WebSocket Control** — 8 actions (record, stream, scenes, sources) via OBS WebSocket v5
- **Export Pipelines** — ffmpeg-based encoding with 8 platform presets (YouTube 4K/1080, TikTok, Instagram, Meta, Web VP9, ProRes)
- **Agent Task Execution** — 20 predefined production tasks across 6 categories bridging agents to integrations
- Integration health dashboard with live status checks

### Legacy System (Preserved)
- Projects, Publish Prep, Workflows — original v1.0 features still accessible

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.1.6 (Turbopack, App Router) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS v4, Lucide icons |
| Database | SQLite via better-sqlite3 (WAL mode, foreign keys) |
| AI | Ollama (local LLM — kimi-k2.5:cloud) |
| Agent Tooling | OpenClaw v2026.3.2 (gateway + real tools) |
| Design | Cyberpunk/neon theme (#00f0ff, #bf5af2, #39ff14) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Ollama** running locally (optional, for AI features)
- **OpenClaw** installed globally (optional, for agent tooling): `npm i -g openclaw`

### Install & Run

```bash
# Clone
git clone https://github.com/Metavibez4L/metaVstudio-.git
cd metaVstudio-

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the Production Command Dashboard.

### Build for Production

```bash
npm run build
npm start
```

### AI Setup (Optional)

Install [Ollama](https://ollama.com), then:

```bash
ollama pull kimi-k2.5:cloud
```

The AI Director will auto-connect at `localhost:11434`.

### OpenClaw Setup (Optional)

Install [OpenClaw](https://docs.openclaw.ai/), then start the gateway:

```bash
npm i -g openclaw
openclaw gateway start
```

Agents will auto-detect the gateway at `127.0.0.1:18789` and switch to tool-equipped mode.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router (27 routes)
│   ├── dashboard/              # Production command center
│   ├── productions/            # Productions + detail pages
│   ├── briefs/                 # Creative briefs
│   ├── shots/                  # Scene & shot design
│   ├── storyboards/            # Storyboard frames
│   ├── deliverables/           # Deliverable matrix
│   ├── campaigns/              # Campaign management
│   ├── post/                   # Post-production
│   ├── assistant/              # AI Director chat
│   ├── agents/                 # Agent production crew
│   ├── integrations/           # Integration dashboard
│   ├── assets/                 # Asset library
│   ├── settings/               # Configuration
│   ├── api/ai/                 # AI chat + generation endpoints
│   ├── api/agents/             # Agent invoke + directory endpoints
│   ├── api/integrations/       # Integration health + execution
│   ├── api/health/             # Health check
│   ├── production-actions.ts   # Production server actions
│   └── actions.ts              # Legacy server actions
├── components/                 # Sidebar, UI components
└── lib/
    ├── db.ts                   # SQLite connection + schema
    ├── agents/                 # Multi-agent system + OpenClaw client
    ├── integrations/           # 6 macOS integrations + registry
    ├── ai/                     # AI provider abstraction
    └── config/                 # Environment profiles
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/STATUS.md](docs/STATUS.md) | Build status, feature matrix, roadmap |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture & design decisions |
| [docs/ROUTES.md](docs/ROUTES.md) | All 27 routes, server actions, query params |
| [docs/DATABASE.md](docs/DATABASE.md) | 15 tables, full schema, ER diagram |
| [docs/AI-SYSTEM.md](docs/AI-SYSTEM.md) | AI provider architecture, content types, OpenClaw integration |

---

## Stats

| Metric | Value |
|--------|-------|
| Routes | 27 |
| Source Files | 74 |
| Lines of Code | ~10,290 |
| Database Tables | 15 |
| AI Content Types | 14 |
| Production Agents | 7 |
| Agent Task Types | 40+ |
| Integrations | 6 (macOS native) |
| Export Presets | 8 |
| Platform Contexts | 10 |

---

## License

MIT
