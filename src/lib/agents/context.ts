// ─── Production Context Builder ────────────────────────
// Assembles a full ProductionContext snapshot from the database
// for agent consumption. Agents never query the DB directly.

import type { ProductionContext } from './types';
import { getProduction } from '../production-data';
import {
  getBriefs,
  getCampaigns,
  getDeliverables,
  getScenes,
  getShots,
  getFrames,
  getEditVersions,
  getProductionNotes,
} from '../production-data';
import { getAssets } from '../data';

/**
 * Build a complete ProductionContext for a given production ID.
 * Returns null if production doesn't exist.
 */
export async function buildProductionContext(productionId: string): Promise<ProductionContext | null> {
  const production = getProduction(productionId);
  if (!production) return null;

  // All queries are synchronous (better-sqlite3), but we wrap
  // in case the data layer becomes async in studio mode.
  const briefs = getBriefs(productionId);
  const campaigns = getCampaigns(productionId);
  const deliverables = getDeliverables(productionId);
  const scenes = getScenes(productionId);
  const shots = getShots(undefined, productionId);
  const storyboardFrames = getFrames(productionId);
  const editVersions = getEditVersions(productionId);
  const notes = getProductionNotes(productionId);
  const assets = getAssets(productionId);

  return {
    production,
    briefs,
    campaigns,
    deliverables,
    scenes,
    shots,
    storyboardFrames,
    editVersions,
    notes,
    assets,
  };
}

/**
 * Serialize a ProductionContext into a compact text summary
 * suitable for inclusion in agent prompts.
 */
export function serializeContext(ctx: ProductionContext): string {
  const p = ctx.production;
  const lines: string[] = [
    `# Production: ${p.title}`,
    `Type: ${p.type} | Status: ${p.status} | Client: ${p.client || 'N/A'}`,
    `Platform: ${p.targetPlatform || 'N/A'} | Budget: ${p.budget || 'N/A'} | Due: ${p.dueDate || 'N/A'}`,
    p.description ? `Description: ${p.description}` : '',
    p.notes ? `Notes: ${p.notes}` : '',
  ];

  if (ctx.briefs.length > 0) {
    lines.push('', '## Creative Briefs');
    for (const b of ctx.briefs) {
      lines.push(`- "${b.title}": ${b.objective || 'No objective'} | Audience: ${b.targetAudience || 'N/A'} | Tone: ${b.tone || 'N/A'}`);
    }
  }

  if (ctx.scenes.length > 0) {
    lines.push('', '## Scenes');
    for (const s of ctx.scenes) {
      lines.push(`- Scene ${s.sceneNumber}: ${s.title || 'Untitled'} — ${s.location || 'No location'} (${s.timeOfDay || 'N/A'})`);
    }
  }

  if (ctx.shots.length > 0) {
    lines.push('', `## Shots (${ctx.shots.length} total)`);
    for (const s of ctx.shots.slice(0, 20)) {
      lines.push(`- Shot ${s.shotNumber}: ${s.shotType} / ${s.movement || 'static'} — ${s.purpose || s.subjectAction || 'No description'}`);
    }
    if (ctx.shots.length > 20) lines.push(`  ... and ${ctx.shots.length - 20} more shots`);
  }

  if (ctx.deliverables.length > 0) {
    lines.push('', '## Deliverables');
    for (const d of ctx.deliverables) {
      lines.push(`- ${d.title}: ${d.type} for ${d.platform || 'N/A'} — ${d.status}`);
    }
  }

  if (ctx.campaigns.length > 0) {
    lines.push('', '## Campaigns');
    for (const c of ctx.campaigns) {
      lines.push(`- "${c.name}": ${c.objective || 'No objective'} — ${c.status}`);
    }
  }

  if (ctx.editVersions.length > 0) {
    lines.push('', '## Edit Versions');
    for (const e of ctx.editVersions) {
      lines.push(`- v${e.versionNumber} (${e.cutType}): ${e.status}`);
    }
  }

  if (ctx.storyboardFrames.length > 0) {
    lines.push('', `## Storyboard Frames: ${ctx.storyboardFrames.length} frames`);
  }

  if (ctx.notes.length > 0) {
    lines.push('', '## Production Notes');
    for (const n of ctx.notes.slice(0, 10)) {
      lines.push(`- [${n.category}] ${n.content}`);
    }
  }

  if (ctx.assets.length > 0) {
    lines.push('', `## Assets: ${ctx.assets.length} files`);
    for (const a of ctx.assets.slice(0, 10)) {
      lines.push(`- ${a.name} (${a.type})`);
    }
  }

  return lines.filter(Boolean).join('\n');
}
