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
| Design | Cyberpunk/neon theme (#00f0ff, #bf5af2, #39ff14) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Ollama** running locally (optional, for AI features)

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

---

## Project Structure

```
src/
├── app/                        # Next.js App Router (22 routes)
│   ├── dashboard/              # Production command center
│   ├── productions/            # Productions + detail pages
│   ├── briefs/                 # Creative briefs
│   ├── shots/                  # Scene & shot design
│   ├── storyboards/            # Storyboard frames
│   ├── deliverables/           # Deliverable matrix
│   ├── campaigns/              # Campaign management
│   ├── post/                   # Post-production
│   ├── assistant/              # AI Director chat
│   ├── assets/                 # Asset library
│   ├── settings/               # Configuration
│   ├── api/ai/                 # AI chat endpoint
│   ├── api/health/             # Health check
│   ├── production-actions.ts   # Production server actions
│   └── actions.ts              # Legacy server actions
├── components/                 # Sidebar, UI components
└── lib/
    ├── db.ts                   # SQLite connection + schema
    ├── queries/                # Data access layer
    └── config/                 # Environment profiles
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/STATUS.md](docs/STATUS.md) | Build status, feature matrix, roadmap |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture & design decisions |
| [docs/ROUTES.md](docs/ROUTES.md) | All 22 routes, server actions, query params |
| [docs/DATABASE.md](docs/DATABASE.md) | 15 tables, full schema, ER diagram |
| [docs/AI-SYSTEM.md](docs/AI-SYSTEM.md) | AI provider architecture & content types |

---

## Stats

| Metric | Value |
|--------|-------|
| Routes | 22 |
| Source Files | 46 |
| Lines of Code | ~5,960 |
| Database Tables | 15 |
| AI Content Types | 14 |
| Platform Contexts | 10 |

---

## License

MIT
