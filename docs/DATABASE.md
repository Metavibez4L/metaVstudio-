# Database Schema

> metaVstudio — SQLite database schema reference

---

## Overview

- **Engine**: SQLite via better-sqlite3
- **Location**: `./data/metavstudio.db`
- **Mode**: WAL (Write-Ahead Logging) for concurrent reads
- **Foreign Keys**: Enabled (`PRAGMA foreign_keys = ON`)
- **IDs**: UUID v4 (text primary keys)
- **Timestamps**: ISO 8601 via `datetime('now')`
- **Auto-init**: Tables created on first `getDb()` call

---

## Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐
│  productions │──┬──▸ │  creative_briefs │
│  (primary)   │  │    └──────────────────┘
└──────┬───────┘  │    ┌──────────────────┐
       │          ├──▸ │    campaigns     │
       │          │    └──────────────────┘
       │          │    ┌──────────────────┐
       │          ├──▸ │   deliverables   │──┐
       │          │    └──────────────────┘  │
       │          │    ┌──────────────────┐  │  ┌──────────────────┐
       │          ├──▸ │     scenes       │──┼──│  edit_versions   │
       │          │    └───────┬──────────┘  │  └──────────────────┘
       │          │            │              │
       │          │    ┌───────▼──────────┐  │
       │          ├──▸ │      shots       │  │
       │          │    └──────────────────┘  │
       │          │    ┌──────────────────┐  │
       │          ├──▸ │storyboard_frames │──┘ (optional scene link)
       │          │    └──────────────────┘
       │          │    ┌──────────────────┐
       │          └──▸ │production_notes  │
       │               └──────────────────┘
       │
       │  (SEPARATE — Legacy system)
       │
┌──────▼───────┐       ┌──────────────────┐
│   projects   │──┬──▸ │     assets       │
│  (legacy)    │  │    └──────────────────┘
└──────────────┘  │    ┌──────────────────┐
                  ├──▸ │  content_drafts  │
                  │    └──────────────────┘
                  │    ┌──────────────────┐
                  ├──▸ │  publish_preps   │
                  │    └──────────────────┘
                  │    ┌──────────────────┐
                  └─-▸ │workflow_templates│ (nullable FK)
                       └──────────────────┘

┌────────────────────┐
│creator_preferences │  (standalone key-value store)
└────────────────────┘
```

---

## Production Tables

### `productions`

Primary entity for cinema/media productions.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | TEXT PK | — | UUID v4 |
| `title` | TEXT NOT NULL | — | Production name |
| `type` | TEXT NOT NULL | `'commercial'` | See ProductionType enum |
| `status` | TEXT NOT NULL | `'concept'` | 12-stage pipeline |
| `client` | TEXT NOT NULL | `''` | Client/brand name |
| `description` | TEXT NOT NULL | `''` | |
| `target_platform` | TEXT | NULL | Platform enum |
| `budget` | TEXT NOT NULL | `''` | Free-form budget string |
| `due_date` | TEXT | NULL | ISO date |
| `notes` | TEXT NOT NULL | `''` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |
| `updated_at` | TEXT NOT NULL | `datetime('now')` | |

**Status values**: `concept`, `briefing`, `pre_production`, `scheduled`, `in_production`, `ingested`, `editing`, `review`, `revision`, `final_delivery`, `published`, `archived`

**Type values**: `commercial`, `brand_film`, `product_film`, `promo`, `trailer`, `short_film`, `documentary`, `social_ad`, `music_video`, `pitch_video`, `tutorial`, `explainer`, `campaign`, `launch_video`, `bts`, `other`

---

### `creative_briefs`

Strategy and creative direction documents linked to a production.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `title` | TEXT NOT NULL | `''` | |
| `objective` | TEXT NOT NULL | `''` | |
| `target_audience` | TEXT NOT NULL | `''` | |
| `key_message` | TEXT NOT NULL | `''` | |
| `tone` | TEXT NOT NULL | `''` | |
| `visual_direction` | TEXT NOT NULL | `''` | |
| `references_text` | TEXT NOT NULL | `''` | |
| `deliverables` | TEXT NOT NULL | `''` | |
| `constraints` | TEXT NOT NULL | `''` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |
| `updated_at` | TEXT NOT NULL | `datetime('now')` | |

---

### `campaigns`

Advertising and distribution campaigns.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `name` | TEXT NOT NULL | `''` | |
| `objective` | TEXT NOT NULL | `''` | |
| `channels` | TEXT NOT NULL | `''` | |
| `target_audience` | TEXT NOT NULL | `''` | |
| `hooks` | TEXT NOT NULL | `''` | |
| `cta_variants` | TEXT NOT NULL | `''` | |
| `messaging_angles` | TEXT NOT NULL | `''` | |
| `ad_copy` | TEXT NOT NULL | `''` | |
| `status` | TEXT NOT NULL | `'draft'` | `draft`, `active`, `paused`, `completed` |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |
| `updated_at` | TEXT NOT NULL | `datetime('now')` | |

---

### `deliverables`

Output formats and delivery specifications.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `title` | TEXT NOT NULL | `''` | |
| `type` | TEXT NOT NULL | `'other'` | DeliverableType enum |
| `platform` | TEXT | NULL | Platform enum |
| `format` | TEXT NOT NULL | `''` | e.g., "1920x1080 H.264" |
| `duration` | TEXT NOT NULL | `''` | e.g., "30s", "2:30" |
| `status` | TEXT NOT NULL | `'planned'` | `planned`, `in_progress`, `in_review`, `approved`, `delivered` |
| `notes` | TEXT NOT NULL | `''` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |
| `updated_at` | TEXT NOT NULL | `datetime('now')` | |

---

### `scenes`

Scene breakdown for a production.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `scene_number` | INTEGER NOT NULL | `1` | |
| `title` | TEXT NOT NULL | `''` | |
| `description` | TEXT NOT NULL | `''` | |
| `location` | TEXT NOT NULL | `''` | |
| `time_of_day` | TEXT NOT NULL | `''` | |
| `notes` | TEXT NOT NULL | `''` | |
| `sort_order` | INTEGER NOT NULL | `0` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |

---

### `shots`

Individual shots within a scene.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `scene_id` | TEXT NOT NULL | — | → `scenes(id)` CASCADE |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `shot_number` | INTEGER NOT NULL | `1` | |
| `shot_type` | TEXT NOT NULL | `'medium'` | 14 ShotType values |
| `framing` | TEXT NOT NULL | `''` | |
| `movement` | TEXT NOT NULL | `'static'` | 13 CameraMovement values |
| `lens` | TEXT NOT NULL | `''` | e.g., "35mm", "85mm" |
| `lighting_mood` | TEXT NOT NULL | `''` | |
| `location` | TEXT NOT NULL | `''` | |
| `subject_action` | TEXT NOT NULL | `''` | |
| `dialogue` | TEXT NOT NULL | `''` | |
| `purpose` | TEXT NOT NULL | `''` | |
| `platform_notes` | TEXT NOT NULL | `''` | |
| `sort_order` | INTEGER NOT NULL | `0` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |

**Shot types**: `wide`, `medium`, `close_up`, `extreme_close_up`, `over_shoulder`, `pov`, `aerial`, `insert`, `cutaway`, `b_roll`, `establishing`, `tracking`, `static`, `handheld`

**Camera movements**: `static`, `pan`, `tilt`, `dolly`, `truck`, `crane`, `handheld`, `steadicam`, `gimbal`, `zoom`, `rack_focus`, `whip_pan`, `orbit`

---

### `storyboard_frames`

Visual frame planning linked to production (optionally to scene).

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `scene_id` | TEXT | NULL | → `scenes(id)` SET NULL |
| `frame_number` | INTEGER NOT NULL | `1` | |
| `description` | TEXT NOT NULL | `''` | |
| `camera_note` | TEXT NOT NULL | `''` | |
| `dialogue` | TEXT NOT NULL | `''` | |
| `image_ref` | TEXT NOT NULL | `''` | File path to reference image |
| `image_prompt` | TEXT NOT NULL | `''` | AI image generation prompt |
| `sort_order` | INTEGER NOT NULL | `0` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |

---

### `edit_versions`

Post-production edit tracking.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `deliverable_id` | TEXT | NULL | → `deliverables(id)` SET NULL |
| `version_number` | INTEGER NOT NULL | `1` | |
| `cut_type` | TEXT NOT NULL | `''` | e.g., "rough cut", "fine cut" |
| `selects_notes` | TEXT NOT NULL | `''` | |
| `music_notes` | TEXT NOT NULL | `''` | |
| `sfx_notes` | TEXT NOT NULL | `''` | |
| `vo_notes` | TEXT NOT NULL | `''` | |
| `color_notes` | TEXT NOT NULL | `''` | |
| `caption_notes` | TEXT NOT NULL | `''` | |
| `status` | TEXT NOT NULL | `'in_progress'` | `in_progress`, `in_review`, `approved`, `rejected` |
| `notes` | TEXT NOT NULL | `''` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |

---

### `production_notes`

Categorized notes for a production.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `production_id` | TEXT NOT NULL | — | → `productions(id)` CASCADE |
| `category` | TEXT NOT NULL | `'general'` | `general`, `talent`, `location`, `gear`, `schedule`, `creative`, `post` |
| `content` | TEXT NOT NULL | `''` | |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |

---

## Legacy Tables

### `projects`

Original project entity (preserved from v1).

| Column | Type | Default |
|--------|------|---------|
| `id` | TEXT PK | — |
| `title` | TEXT NOT NULL | — |
| `type` | TEXT NOT NULL | `'tutorial'` |
| `status` | TEXT NOT NULL | `'idea'` |
| `description` | TEXT NOT NULL | `''` |
| `target_platform` | TEXT | NULL |
| `due_date` | TEXT | NULL |
| `notes` | TEXT NOT NULL | `''` |
| `created_at` | TEXT NOT NULL | `datetime('now')` |
| `updated_at` | TEXT NOT NULL | `datetime('now')` |

### `assets`

File/media assets linked to a project.

| Column | Type | Default | FK |
|--------|------|---------|-----|
| `id` | TEXT PK | — | |
| `project_id` | TEXT NOT NULL | — | → `projects(id)` CASCADE |
| `name` | TEXT NOT NULL | — | |
| `file_path` | TEXT NOT NULL | — | |
| `type` | TEXT NOT NULL | `'other'` | 18 AssetType values |
| `notes` | TEXT NOT NULL | `''` | |
| `tags` | TEXT NOT NULL | `''` | Comma-separated tags |
| `created_at` | TEXT NOT NULL | `datetime('now')` | |

### `content_drafts`, `workflow_templates`, `publish_preps`, `creator_preferences`

See schema in `src/lib/db.ts` for full column definitions.

---

## Cascade Behavior

| Parent | Child | On Delete |
|--------|-------|-----------|
| `productions` | `creative_briefs` | CASCADE |
| `productions` | `campaigns` | CASCADE |
| `productions` | `deliverables` | CASCADE |
| `productions` | `scenes` | CASCADE |
| `productions` | `shots` | CASCADE |
| `productions` | `storyboard_frames` | CASCADE |
| `productions` | `edit_versions` | CASCADE |
| `productions` | `production_notes` | CASCADE |
| `scenes` | `shots` | CASCADE |
| `scenes` | `storyboard_frames` | SET NULL |
| `deliverables` | `edit_versions` | SET NULL |
| `projects` | `assets` | CASCADE |
| `projects` | `content_drafts` | CASCADE |
| `projects` | `publish_preps` | CASCADE |
| `projects` | `workflow_templates` | SET NULL |

---

## Migrations

The schema uses `CREATE TABLE IF NOT EXISTS` for all tables, so schema is applied idempotently on every app start. The only migration is:

```sql
-- Add tags column to legacy assets table (if missing)
ALTER TABLE assets ADD COLUMN tags TEXT NOT NULL DEFAULT '';
```

This is guarded by a `PRAGMA table_info(assets)` check.
