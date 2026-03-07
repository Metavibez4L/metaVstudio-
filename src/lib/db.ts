import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getConfig } from './config';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const config = getConfig();
  const dbPath = config.storage.databasePath;

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  if (config.storage.walMode) {
    db.pragma('journal_mode = WAL');
  }
  db.pragma('foreign_keys = ON');

  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  // ─── Legacy tables (preserved) ─────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'tutorial',
      status TEXT NOT NULL DEFAULT 'idea',
      description TEXT NOT NULL DEFAULT '',
      target_platform TEXT,
      due_date TEXT,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'other',
      notes TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS content_drafts (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      platform TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workflow_templates (
      id TEXT PRIMARY KEY,
      tool TEXT NOT NULL,
      project_id TEXT,
      checklist TEXT NOT NULL DEFAULT '[]',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS creator_preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS publish_preps (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      caption TEXT NOT NULL DEFAULT '',
      hashtags TEXT NOT NULL DEFAULT '',
      cta TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // ─── Production tables (new) ───────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS productions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'commercial',
      status TEXT NOT NULL DEFAULT 'concept',
      client TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      target_platform TEXT,
      budget TEXT NOT NULL DEFAULT '',
      due_date TEXT,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS creative_briefs (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      objective TEXT NOT NULL DEFAULT '',
      target_audience TEXT NOT NULL DEFAULT '',
      key_message TEXT NOT NULL DEFAULT '',
      tone TEXT NOT NULL DEFAULT '',
      visual_direction TEXT NOT NULL DEFAULT '',
      references_text TEXT NOT NULL DEFAULT '',
      deliverables TEXT NOT NULL DEFAULT '',
      constraints TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      objective TEXT NOT NULL DEFAULT '',
      channels TEXT NOT NULL DEFAULT '',
      target_audience TEXT NOT NULL DEFAULT '',
      hooks TEXT NOT NULL DEFAULT '',
      cta_variants TEXT NOT NULL DEFAULT '',
      messaging_angles TEXT NOT NULL DEFAULT '',
      ad_copy TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS deliverables (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'other',
      platform TEXT,
      format TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'planned',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scenes (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      scene_number INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      time_of_day TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shots (
      id TEXT PRIMARY KEY,
      scene_id TEXT NOT NULL,
      production_id TEXT NOT NULL,
      shot_number INTEGER NOT NULL DEFAULT 1,
      shot_type TEXT NOT NULL DEFAULT 'medium',
      framing TEXT NOT NULL DEFAULT '',
      movement TEXT NOT NULL DEFAULT 'static',
      lens TEXT NOT NULL DEFAULT '',
      lighting_mood TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      subject_action TEXT NOT NULL DEFAULT '',
      dialogue TEXT NOT NULL DEFAULT '',
      purpose TEXT NOT NULL DEFAULT '',
      platform_notes TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS storyboard_frames (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      scene_id TEXT,
      frame_number INTEGER NOT NULL DEFAULT 1,
      description TEXT NOT NULL DEFAULT '',
      camera_note TEXT NOT NULL DEFAULT '',
      dialogue TEXT NOT NULL DEFAULT '',
      image_ref TEXT NOT NULL DEFAULT '',
      image_prompt TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE,
      FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS edit_versions (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      deliverable_id TEXT,
      version_number INTEGER NOT NULL DEFAULT 1,
      cut_type TEXT NOT NULL DEFAULT '',
      selects_notes TEXT NOT NULL DEFAULT '',
      music_notes TEXT NOT NULL DEFAULT '',
      sfx_notes TEXT NOT NULL DEFAULT '',
      vo_notes TEXT NOT NULL DEFAULT '',
      color_notes TEXT NOT NULL DEFAULT '',
      caption_notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'in_progress',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE,
      FOREIGN KEY (deliverable_id) REFERENCES deliverables(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS production_notes (
      id TEXT PRIMARY KEY,
      production_id TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (production_id) REFERENCES productions(id) ON DELETE CASCADE
    );
  `);

  // ─── Migrations for existing tables ───────────────────
  // Add tags column to assets if missing
  const assetCols = db.prepare("PRAGMA table_info(assets)").all() as { name: string }[];
  if (!assetCols.some(c => c.name === 'tags')) {
    db.exec("ALTER TABLE assets ADD COLUMN tags TEXT NOT NULL DEFAULT ''");
  }

  // Seed default preferences if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM creator_preferences').get() as { c: number };
  if (count.c === 0) {
    const insert = db.prepare('INSERT INTO creator_preferences (key, value) VALUES (?, ?)');
    const defaults: [string, string][] = [
      ['preferred_tone', 'conversational and clear'],
      ['brand_voice', 'professional yet approachable'],
      ['video_style', 'clean, focused, well-paced'],
      ['cta_style', 'direct and actionable'],
      ['platform_preferences', 'youtube,x'],
      ['naming_convention', 'kebab-case for files, descriptive for projects'],
      ['preferred_content_length', 'medium (5-10 min videos, concise social posts)'],
    ];
    const insertMany = db.transaction((items: [string, string][]) => {
      for (const [key, value] of items) {
        insert.run(key, value);
      }
    });
    insertMany(defaults);
  }
}
