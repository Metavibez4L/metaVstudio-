# metaVstudio — Project Status

> **AI Cinema & Media Production OS**
> Last updated: 2026-03-07

---

## Build Status

| Metric | Value |
|--------|-------|
| **Build** | ✅ Passing |
| **TypeScript** | ✅ Strict, zero errors |
| **Routes** | 22 (14 dynamic, 4 static, 4 API + health) |
| **Source Files** | 46 |
| **Total Lines** | ~5,960 |
| **Framework** | Next.js 16.1.6 (Turbopack) |

---

## System Overview

**metaVstudio** is a local-first, AI-powered cinema and media production operating system. It manages the full lifecycle of video production — from creative concept through post-production to multi-platform delivery.

- **Runtime**: Node.js, Next.js App Router, React 19
- **Database**: SQLite (better-sqlite3, WAL mode, foreign keys)
- **AI Engine**: Ollama (local inference, kimi-k2.5:cloud model)
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
| Asset Library | `/assets` | ✅ Live |
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

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (Turbopack) | 16.1.6 |
| Runtime | React | 19.2.3 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | v4 |
| Database | better-sqlite3 | 12.6.2 |
| AI | Ollama (OpenAI-compatible API) | Local |
| Icons | lucide-react | 0.577.0 |
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

- [ ] Production ↔ Asset linking (production-scoped asset management)
- [ ] Inline CRUD on detail pages (briefs, scenes, shots from /productions/[id])
- [ ] DaVinci Resolve / Frame.io integration hooks
- [ ] Multi-production campaign dashboard
- [ ] Export production packages (PDF briefs, shot lists, delivery checklists)
- [ ] Timeline / Gantt view for production scheduling
- [ ] Role-based collaboration (director, editor, producer views)
