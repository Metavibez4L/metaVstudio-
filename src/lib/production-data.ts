import { getDb } from './db';
import { v4 as uuid } from 'uuid';
import type {
  ProductionProject,
  CreativeBrief,
  Campaign,
  Deliverable,
  Scene,
  Shot,
  StoryboardFrame,
  EditVersion,
  ProductionNote,
  ProductionStatus,
} from './types';

// ═══════════════════════════════════════════════════════
// Production Projects
// ═══════════════════════════════════════════════════════

function rowToProduction(row: Record<string, unknown>): ProductionProject {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as ProductionProject['type'],
    status: row.status as ProductionProject['status'],
    client: row.client as string,
    description: row.description as string,
    targetPlatform: (row.target_platform as ProductionProject['targetPlatform']) || null,
    budget: row.budget as string,
    dueDate: (row.due_date as string) || null,
    notes: row.notes as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getProductions(status?: string): ProductionProject[] {
  const db = getDb();
  if (status && status !== 'all') {
    return db.prepare('SELECT * FROM productions WHERE status = ? ORDER BY updated_at DESC').all(status)
      .map(r => rowToProduction(r as Record<string, unknown>));
  }
  return db.prepare('SELECT * FROM productions ORDER BY updated_at DESC').all()
    .map(r => rowToProduction(r as Record<string, unknown>));
}

export function getProduction(id: string): ProductionProject | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM productions WHERE id = ?').get(id);
  return row ? rowToProduction(row as Record<string, unknown>) : null;
}

export function createProduction(data: Omit<ProductionProject, 'id' | 'createdAt' | 'updatedAt'>): ProductionProject {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.title, data.type, data.status, data.client, data.description, data.targetPlatform, data.budget, data.dueDate, data.notes, now, now);
  return getProduction(id)!;
}

export function updateProduction(id: string, data: Partial<Omit<ProductionProject, 'id' | 'createdAt' | 'updatedAt'>>): ProductionProject | null {
  const db = getDb();
  const existing = getProduction(id);
  if (!existing) return null;
  const m = { ...existing, ...data };
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE productions SET title=?, type=?, status=?, client=?, description=?, target_platform=?, budget=?, due_date=?, notes=?, updated_at=? WHERE id=?`
  ).run(m.title, m.type, m.status, m.client, m.description, m.targetPlatform, m.budget, m.dueDate, m.notes, now, id);
  return getProduction(id);
}

export function deleteProduction(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM productions WHERE id = ?').run(id).changes > 0;
}

export function getProductionCounts(): Record<string, number> {
  const db = getDb();
  const rows = db.prepare('SELECT status, COUNT(*) as count FROM productions GROUP BY status').all() as { status: string; count: number }[];
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.status] = row.count;
  counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
  return counts;
}

// ═══════════════════════════════════════════════════════
// Creative Briefs
// ═══════════════════════════════════════════════════════

function rowToBrief(row: Record<string, unknown>): CreativeBrief {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    title: row.title as string,
    objective: row.objective as string,
    targetAudience: row.target_audience as string,
    keyMessage: row.key_message as string,
    tone: row.tone as string,
    visualDirection: row.visual_direction as string,
    references: row.references_text as string,
    deliverables: row.deliverables as string,
    constraints: row.constraints as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getBriefs(productionId?: string): CreativeBrief[] {
  const db = getDb();
  if (productionId) {
    return db.prepare('SELECT * FROM creative_briefs WHERE production_id = ? ORDER BY created_at DESC').all(productionId)
      .map(r => rowToBrief(r as Record<string, unknown>));
  }
  return db.prepare('SELECT * FROM creative_briefs ORDER BY created_at DESC').all()
    .map(r => rowToBrief(r as Record<string, unknown>));
}

export function getBrief(id: string): CreativeBrief | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM creative_briefs WHERE id = ?').get(id);
  return row ? rowToBrief(row as Record<string, unknown>) : null;
}

export function createBrief(data: Omit<CreativeBrief, 'id' | 'createdAt' | 'updatedAt'>): CreativeBrief {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO creative_briefs (id, production_id, title, objective, target_audience, key_message, tone, visual_direction, references_text, deliverables, constraints, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.title, data.objective, data.targetAudience, data.keyMessage, data.tone, data.visualDirection, data.references, data.deliverables, data.constraints, now, now);
  return getBrief(id)!;
}

export function updateBrief(id: string, data: Partial<Omit<CreativeBrief, 'id' | 'createdAt' | 'updatedAt'>>): CreativeBrief | null {
  const db = getDb();
  const existing = getBrief(id);
  if (!existing) return null;
  const m = { ...existing, ...data };
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE creative_briefs SET title=?, objective=?, target_audience=?, key_message=?, tone=?, visual_direction=?, references_text=?, deliverables=?, constraints=?, updated_at=? WHERE id=?`
  ).run(m.title, m.objective, m.targetAudience, m.keyMessage, m.tone, m.visualDirection, m.references, m.deliverables, m.constraints, now, id);
  return getBrief(id);
}

export function deleteBrief(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM creative_briefs WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Campaigns
// ═══════════════════════════════════════════════════════

function rowToCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    name: row.name as string,
    objective: row.objective as string,
    channels: row.channels as string,
    targetAudience: row.target_audience as string,
    hooks: row.hooks as string,
    ctaVariants: row.cta_variants as string,
    messagingAngles: row.messaging_angles as string,
    adCopy: row.ad_copy as string,
    status: row.status as Campaign['status'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getCampaigns(productionId?: string): Campaign[] {
  const db = getDb();
  if (productionId) {
    return db.prepare('SELECT * FROM campaigns WHERE production_id = ? ORDER BY created_at DESC').all(productionId)
      .map(r => rowToCampaign(r as Record<string, unknown>));
  }
  return db.prepare('SELECT * FROM campaigns ORDER BY created_at DESC').all()
    .map(r => rowToCampaign(r as Record<string, unknown>));
}

export function getCampaign(id: string): Campaign | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);
  return row ? rowToCampaign(row as Record<string, unknown>) : null;
}

export function createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO campaigns (id, production_id, name, objective, channels, target_audience, hooks, cta_variants, messaging_angles, ad_copy, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.name, data.objective, data.channels, data.targetAudience, data.hooks, data.ctaVariants, data.messagingAngles, data.adCopy, data.status, now, now);
  return getCampaign(id)!;
}

export function updateCampaign(id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>>): Campaign | null {
  const db = getDb();
  const existing = getCampaign(id);
  if (!existing) return null;
  const m = { ...existing, ...data };
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE campaigns SET name=?, objective=?, channels=?, target_audience=?, hooks=?, cta_variants=?, messaging_angles=?, ad_copy=?, status=?, updated_at=? WHERE id=?`
  ).run(m.name, m.objective, m.channels, m.targetAudience, m.hooks, m.ctaVariants, m.messagingAngles, m.adCopy, m.status, now, id);
  return getCampaign(id);
}

export function deleteCampaign(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM campaigns WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Deliverables
// ═══════════════════════════════════════════════════════

function rowToDeliverable(row: Record<string, unknown>): Deliverable {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    title: row.title as string,
    type: row.type as Deliverable['type'],
    platform: (row.platform as Deliverable['platform']) || null,
    format: row.format as string,
    duration: row.duration as string,
    status: row.status as Deliverable['status'],
    notes: row.notes as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getDeliverables(productionId?: string): Deliverable[] {
  const db = getDb();
  if (productionId) {
    return db.prepare('SELECT * FROM deliverables WHERE production_id = ? ORDER BY created_at DESC').all(productionId)
      .map(r => rowToDeliverable(r as Record<string, unknown>));
  }
  return db.prepare('SELECT * FROM deliverables ORDER BY created_at DESC').all()
    .map(r => rowToDeliverable(r as Record<string, unknown>));
}

export function getDeliverable(id: string): Deliverable | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM deliverables WHERE id = ?').get(id);
  return row ? rowToDeliverable(row as Record<string, unknown>) : null;
}

export function createDeliverable(data: Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt'>): Deliverable {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.title, data.type, data.platform, data.format, data.duration, data.status, data.notes, now, now);
  return getDeliverable(id)!;
}

export function updateDeliverable(id: string, data: Partial<Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt'>>): Deliverable | null {
  const db = getDb();
  const existing = getDeliverable(id);
  if (!existing) return null;
  const m = { ...existing, ...data };
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE deliverables SET title=?, type=?, platform=?, format=?, duration=?, status=?, notes=?, updated_at=? WHERE id=?`
  ).run(m.title, m.type, m.platform, m.format, m.duration, m.status, m.notes, now, id);
  return getDeliverable(id);
}

export function deleteDeliverable(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM deliverables WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Scenes
// ═══════════════════════════════════════════════════════

function rowToScene(row: Record<string, unknown>): Scene {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    sceneNumber: row.scene_number as number,
    title: row.title as string,
    description: row.description as string,
    location: row.location as string,
    timeOfDay: row.time_of_day as string,
    notes: row.notes as string,
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
  };
}

export function getScenes(productionId: string): Scene[] {
  const db = getDb();
  return db.prepare('SELECT * FROM scenes WHERE production_id = ? ORDER BY sort_order, scene_number').all(productionId)
    .map(r => rowToScene(r as Record<string, unknown>));
}

export function getScene(id: string): Scene | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM scenes WHERE id = ?').get(id);
  return row ? rowToScene(row as Record<string, unknown>) : null;
}

export function createScene(data: Omit<Scene, 'id' | 'createdAt'>): Scene {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.sceneNumber, data.title, data.description, data.location, data.timeOfDay, data.notes, data.sortOrder, now);
  return getScene(id)!;
}

export function updateScene(id: string, data: Partial<Omit<Scene, 'id' | 'createdAt'>>): Scene | null {
  const db = getDb();
  const existing = getScene(id);
  if (!existing) return null;
  const m = { ...existing, ...data };
  db.prepare(
    `UPDATE scenes SET scene_number=?, title=?, description=?, location=?, time_of_day=?, notes=?, sort_order=? WHERE id=?`
  ).run(m.sceneNumber, m.title, m.description, m.location, m.timeOfDay, m.notes, m.sortOrder, id);
  return getScene(id);
}

export function deleteScene(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM scenes WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Shots
// ═══════════════════════════════════════════════════════

function rowToShot(row: Record<string, unknown>): Shot {
  return {
    id: row.id as string,
    sceneId: row.scene_id as string,
    productionId: row.production_id as string,
    shotNumber: row.shot_number as number,
    shotType: row.shot_type as Shot['shotType'],
    framing: row.framing as string,
    movement: row.movement as Shot['movement'],
    lens: row.lens as string,
    lightingMood: row.lighting_mood as string,
    location: row.location as string,
    subjectAction: row.subject_action as string,
    dialogue: row.dialogue as string,
    purpose: row.purpose as string,
    platformNotes: row.platform_notes as string,
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
  };
}

export function getShots(sceneId?: string, productionId?: string): Shot[] {
  const db = getDb();
  if (sceneId) {
    return db.prepare('SELECT * FROM shots WHERE scene_id = ? ORDER BY sort_order, shot_number').all(sceneId)
      .map(r => rowToShot(r as Record<string, unknown>));
  }
  if (productionId) {
    return db.prepare('SELECT * FROM shots WHERE production_id = ? ORDER BY sort_order, shot_number').all(productionId)
      .map(r => rowToShot(r as Record<string, unknown>));
  }
  return db.prepare('SELECT * FROM shots ORDER BY sort_order, shot_number').all()
    .map(r => rowToShot(r as Record<string, unknown>));
}

export function createShot(data: Omit<Shot, 'id' | 'createdAt'>): Shot {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.sceneId, data.productionId, data.shotNumber, data.shotType, data.framing, data.movement, data.lens, data.lightingMood, data.location, data.subjectAction, data.dialogue, data.purpose, data.platformNotes, data.sortOrder, now);
  return rowToShot(db.prepare('SELECT * FROM shots WHERE id = ?').get(id) as Record<string, unknown>);
}

export function updateShot(id: string, data: Partial<Omit<Shot, 'id' | 'createdAt'>>): Shot | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM shots WHERE id = ?').get(id);
  if (!row) return null;
  const existing = rowToShot(row as Record<string, unknown>);
  const m = { ...existing, ...data };
  db.prepare(
    `UPDATE shots SET shot_number=?, shot_type=?, framing=?, movement=?, lens=?, lighting_mood=?, location=?, subject_action=?, dialogue=?, purpose=?, platform_notes=?, sort_order=? WHERE id=?`
  ).run(m.shotNumber, m.shotType, m.framing, m.movement, m.lens, m.lightingMood, m.location, m.subjectAction, m.dialogue, m.purpose, m.platformNotes, m.sortOrder, id);
  return rowToShot(db.prepare('SELECT * FROM shots WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteShot(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM shots WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Storyboard Frames
// ═══════════════════════════════════════════════════════

function rowToFrame(row: Record<string, unknown>): StoryboardFrame {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    sceneId: (row.scene_id as string) || null,
    frameNumber: row.frame_number as number,
    description: row.description as string,
    cameraNote: row.camera_note as string,
    dialogue: row.dialogue as string,
    imageRef: row.image_ref as string,
    imagePrompt: row.image_prompt as string,
    sortOrder: row.sort_order as number,
    createdAt: row.created_at as string,
  };
}

export function getFrames(productionId: string): StoryboardFrame[] {
  const db = getDb();
  return db.prepare('SELECT * FROM storyboard_frames WHERE production_id = ? ORDER BY sort_order, frame_number').all(productionId)
    .map(r => rowToFrame(r as Record<string, unknown>));
}

export function createFrame(data: Omit<StoryboardFrame, 'id' | 'createdAt'>): StoryboardFrame {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO storyboard_frames (id, production_id, scene_id, frame_number, description, camera_note, dialogue, image_ref, image_prompt, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.sceneId, data.frameNumber, data.description, data.cameraNote, data.dialogue, data.imageRef, data.imagePrompt, data.sortOrder, now);
  return rowToFrame(db.prepare('SELECT * FROM storyboard_frames WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteFrame(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM storyboard_frames WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Edit Versions (Post-Production)
// ═══════════════════════════════════════════════════════

function rowToEditVersion(row: Record<string, unknown>): EditVersion {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    deliverableId: (row.deliverable_id as string) || null,
    versionNumber: row.version_number as number,
    cutType: row.cut_type as string,
    selectsNotes: row.selects_notes as string,
    musicNotes: row.music_notes as string,
    sfxNotes: row.sfx_notes as string,
    voNotes: row.vo_notes as string,
    colorNotes: row.color_notes as string,
    captionNotes: row.caption_notes as string,
    status: row.status as EditVersion['status'],
    notes: row.notes as string,
    createdAt: row.created_at as string,
  };
}

export function getEditVersions(productionId: string): EditVersion[] {
  const db = getDb();
  return db.prepare('SELECT * FROM edit_versions WHERE production_id = ? ORDER BY version_number DESC').all(productionId)
    .map(r => rowToEditVersion(r as Record<string, unknown>));
}

export function createEditVersion(data: Omit<EditVersion, 'id' | 'createdAt'>): EditVersion {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO edit_versions (id, production_id, deliverable_id, version_number, cut_type, selects_notes, music_notes, sfx_notes, vo_notes, color_notes, caption_notes, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.deliverableId, data.versionNumber, data.cutType, data.selectsNotes, data.musicNotes, data.sfxNotes, data.voNotes, data.colorNotes, data.captionNotes, data.status, data.notes, now);
  return rowToEditVersion(db.prepare('SELECT * FROM edit_versions WHERE id = ?').get(id) as Record<string, unknown>);
}

export function updateEditVersion(id: string, data: Partial<Omit<EditVersion, 'id' | 'createdAt'>>): EditVersion | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM edit_versions WHERE id = ?').get(id);
  if (!row) return null;
  const existing = rowToEditVersion(row as Record<string, unknown>);
  const m = { ...existing, ...data };
  db.prepare(
    `UPDATE edit_versions SET cut_type=?, selects_notes=?, music_notes=?, sfx_notes=?, vo_notes=?, color_notes=?, caption_notes=?, status=?, notes=? WHERE id=?`
  ).run(m.cutType, m.selectsNotes, m.musicNotes, m.sfxNotes, m.voNotes, m.colorNotes, m.captionNotes, m.status, m.notes, id);
  return rowToEditVersion(db.prepare('SELECT * FROM edit_versions WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteEditVersion(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM edit_versions WHERE id = ?').run(id).changes > 0;
}

// ═══════════════════════════════════════════════════════
// Production Notes
// ═══════════════════════════════════════════════════════

function rowToNote(row: Record<string, unknown>): ProductionNote {
  return {
    id: row.id as string,
    productionId: row.production_id as string,
    category: row.category as ProductionNote['category'],
    content: row.content as string,
    createdAt: row.created_at as string,
  };
}

export function getProductionNotes(productionId: string): ProductionNote[] {
  const db = getDb();
  return db.prepare('SELECT * FROM production_notes WHERE production_id = ? ORDER BY created_at DESC').all(productionId)
    .map(r => rowToNote(r as Record<string, unknown>));
}

export function createProductionNote(data: Omit<ProductionNote, 'id' | 'createdAt'>): ProductionNote {
  const db = getDb();
  const id = uuid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES (?, ?, ?, ?, ?)`
  ).run(id, data.productionId, data.category, data.content, now);
  return rowToNote(db.prepare('SELECT * FROM production_notes WHERE id = ?').get(id) as Record<string, unknown>);
}

export function deleteProductionNote(id: string): boolean {
  const db = getDb();
  return db.prepare('DELETE FROM production_notes WHERE id = ?').run(id).changes > 0;
}
