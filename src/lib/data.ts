import { getDb } from './db';
import { v4 as uuid } from 'uuid';
import type {
  Project,
  Asset,
  ContentDraft,
  CreatorPreference,
  PublishPrep,
  WorkflowTemplate,
  WorkflowChecklistItem,
} from './types';

// ─── Projects ──────────────────────────────────────────

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as Project['type'],
    status: row.status as Project['status'],
    description: row.description as string,
    targetPlatform: (row.target_platform as Project['targetPlatform']) || null,
    dueDate: (row.due_date as string) || null,
    notes: row.notes as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getProjects(status?: string): Project[] {
  const db = getDb();
  if (status && status !== 'all') {
    return db
      .prepare('SELECT * FROM projects WHERE status = ? ORDER BY updated_at DESC')
      .all(status)
      .map((r) => rowToProject(r as Record<string, unknown>));
  }
  return db
    .prepare('SELECT * FROM projects ORDER BY updated_at DESC')
    .all()
    .map((r) => rowToProject(r as Record<string, unknown>));
}

export function getProject(id: string): Project | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return row ? rowToProject(row as Record<string, unknown>) : null;
}

export function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO projects (id, title, type, status, description, target_platform, due_date, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.type, data.status, data.description, data.targetPlatform, data.dueDate, data.notes, now, now);
  return getProject(id)!;
}

export function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Project | null {
  const db = getDb();
  const existing = getProject(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE projects SET title=?, type=?, status=?, description=?, target_platform=?, due_date=?, notes=?, updated_at=?
     WHERE id=?`
  ).run(merged.title, merged.type, merged.status, merged.description, merged.targetPlatform, merged.dueDate, merged.notes, now, id);
  return getProject(id);
}

export function deleteProject(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getProjectCounts(): Record<string, number> {
  const db = getDb();
  const rows = db.prepare('SELECT status, COUNT(*) as count FROM projects GROUP BY status').all() as { status: string; count: number }[];
  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.status] = row.count;
  }
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
  return counts;
}

// ─── Assets ────────────────────────────────────────────

function rowToAsset(row: Record<string, unknown>): Asset {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    name: row.name as string,
    filePath: row.file_path as string,
    type: row.type as Asset['type'],
    notes: row.notes as string,
    tags: (row.tags as string) || '',
    createdAt: row.created_at as string,
  };
}

export function getAssets(projectId: string): Asset[] {
  const db = getDb();
  return db.prepare('SELECT * FROM assets WHERE project_id = ? ORDER BY created_at DESC').all(projectId).map((r) => rowToAsset(r as Record<string, unknown>));
}

export function getRecentAssets(limit = 10): (Asset & { projectTitle: string })[] {
  const db = getDb();
  const rows = db.prepare(
    `SELECT a.*, p.title as project_title FROM assets a
     JOIN projects p ON a.project_id = p.id
     ORDER BY a.created_at DESC LIMIT ?`
  ).all(limit) as (Record<string, unknown>)[];
  return rows.map((r) => ({ ...rowToAsset(r), projectTitle: r.project_title as string }));
}

export function createAsset(data: Omit<Asset, 'id' | 'createdAt'>): Asset {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO assets (id, project_id, name, file_path, type, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.projectId, data.name, data.filePath, data.type, data.notes, now);
  return { id, ...data, createdAt: now };
}

export function deleteAsset(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM assets WHERE id = ?').run(id).changes > 0;
}

// ─── Content Drafts ────────────────────────────────────

function rowToDraft(row: Record<string, unknown>): ContentDraft {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    type: row.type as ContentDraft['type'],
    content: row.content as string,
    platform: (row.platform as ContentDraft['platform']) || null,
    createdAt: row.created_at as string,
  };
}

export function getDrafts(projectId: string): ContentDraft[] {
  const db = getDb();
  return db.prepare('SELECT * FROM content_drafts WHERE project_id = ? ORDER BY created_at DESC').all(projectId).map((r) => rowToDraft(r as Record<string, unknown>));
}

export function createDraft(data: Omit<ContentDraft, 'id' | 'createdAt'>): ContentDraft {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO content_drafts (id, project_id, type, content, platform, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, data.projectId, data.type, data.content, data.platform, now);
  return { id, ...data, createdAt: now };
}

export function deleteDraft(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM content_drafts WHERE id = ?').run(id).changes > 0;
}

// ─── Workflow Templates ────────────────────────────────

function rowToWorkflow(row: Record<string, unknown>): WorkflowTemplate {
  return {
    id: row.id as string,
    tool: row.tool as WorkflowTemplate['tool'],
    projectId: (row.project_id as string) || null,
    checklist: JSON.parse(row.checklist as string) as WorkflowChecklistItem[],
    notes: row.notes as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getWorkflows(tool?: string): WorkflowTemplate[] {
  const db = getDb();
  if (tool) {
    return db.prepare('SELECT * FROM workflow_templates WHERE tool = ? ORDER BY updated_at DESC').all(tool).map((r) => rowToWorkflow(r as Record<string, unknown>));
  }
  return db.prepare('SELECT * FROM workflow_templates ORDER BY updated_at DESC').all().map((r) => rowToWorkflow(r as Record<string, unknown>));
}

export function getWorkflow(id: string): WorkflowTemplate | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM workflow_templates WHERE id = ?').get(id);
  return row ? rowToWorkflow(row as Record<string, unknown>) : null;
}

export function createWorkflow(data: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>): WorkflowTemplate {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO workflow_templates (id, tool, project_id, checklist, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.tool, data.projectId, JSON.stringify(data.checklist), data.notes, now, now);
  return getWorkflow(id)!;
}

export function updateWorkflow(id: string, data: Partial<Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>>): WorkflowTemplate | null {
  const db = getDb();
  const existing = getWorkflow(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE workflow_templates SET tool=?, project_id=?, checklist=?, notes=?, updated_at=? WHERE id=?`
  ).run(merged.tool, merged.projectId, JSON.stringify(merged.checklist), merged.notes, now, id);
  return getWorkflow(id);
}

// ─── Creator Preferences ──────────────────────────────

export function getPreferences(): CreatorPreference[] {
  const db = getDb();
  return db.prepare('SELECT * FROM creator_preferences ORDER BY key').all() as CreatorPreference[];
}

export function getPreference(key: string): string | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM creator_preferences WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setPreference(key: string, value: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO creator_preferences (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`
  ).run(key, value, now);
}

// ─── Publish Prep ──────────────────────────────────────

function rowToPublishPrep(row: Record<string, unknown>): PublishPrep {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    platform: row.platform as PublishPrep['platform'],
    title: row.title as string,
    description: row.description as string,
    caption: row.caption as string,
    hashtags: row.hashtags as string,
    cta: row.cta as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getPublishPreps(projectId: string): PublishPrep[] {
  const db = getDb();
  return db.prepare('SELECT * FROM publish_preps WHERE project_id = ? ORDER BY platform').all(projectId).map((r) => rowToPublishPrep(r as Record<string, unknown>));
}

export function upsertPublishPrep(data: Omit<PublishPrep, 'id' | 'createdAt' | 'updatedAt'>): PublishPrep {
  const db = getDb();
  const now = new Date().toISOString();
  const existing = db.prepare('SELECT id FROM publish_preps WHERE project_id = ? AND platform = ?').get(data.projectId, data.platform) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE publish_preps SET title=?, description=?, caption=?, hashtags=?, cta=?, updated_at=? WHERE id=?`
    ).run(data.title, data.description, data.caption, data.hashtags, data.cta, now, existing.id);
    return rowToPublishPrep(db.prepare('SELECT * FROM publish_preps WHERE id = ?').get(existing.id) as Record<string, unknown>);
  }

  const id = uuid();
  db.prepare(
    `INSERT INTO publish_preps (id, project_id, platform, title, description, caption, hashtags, cta, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.projectId, data.platform, data.title, data.description, data.caption, data.hashtags, data.cta, now, now);
  return rowToPublishPrep(db.prepare('SELECT * FROM publish_preps WHERE id = ?').get(id) as Record<string, unknown>);
}
