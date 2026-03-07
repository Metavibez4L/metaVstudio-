'use server';

import {
  createProduction, updateProduction, deleteProduction,
  createBrief, updateBrief, deleteBrief,
  createCampaign, updateCampaign, deleteCampaign,
  createDeliverable, updateDeliverable, deleteDeliverable,
  createScene, updateScene, deleteScene,
  createShot, updateShot, deleteShot,
  createFrame, deleteFrame,
  createEditVersion, updateEditVersion, deleteEditVersion,
  createProductionNote, deleteProductionNote,
} from '@/lib/production-data';
import type {
  ProductionProject, CreativeBrief, Campaign, Deliverable,
  Scene, Shot, StoryboardFrame, EditVersion, ProductionNote,
} from '@/lib/types';
import { revalidatePath } from 'next/cache';

// ─── Productions ───────────────────────────────────────

export async function createProductionAction(data: Omit<ProductionProject, 'id' | 'createdAt' | 'updatedAt'>) {
  const prod = createProduction(data);
  revalidatePath('/productions');
  revalidatePath('/dashboard');
  return prod;
}

export async function updateProductionAction(id: string, data: Partial<Omit<ProductionProject, 'id' | 'createdAt' | 'updatedAt'>>) {
  const prod = updateProduction(id, data);
  revalidatePath('/productions');
  revalidatePath(`/productions/${id}`);
  revalidatePath('/dashboard');
  return prod;
}

export async function deleteProductionAction(id: string) {
  const success = deleteProduction(id);
  revalidatePath('/productions');
  revalidatePath('/dashboard');
  return success;
}

// ─── Creative Briefs ───────────────────────────────────

export async function createBriefAction(data: Omit<CreativeBrief, 'id' | 'createdAt' | 'updatedAt'>) {
  const brief = createBrief(data);
  revalidatePath('/briefs');
  revalidatePath(`/productions/${data.productionId}`);
  return brief;
}

export async function updateBriefAction(id: string, data: Partial<Omit<CreativeBrief, 'id' | 'createdAt' | 'updatedAt'>>) {
  const brief = updateBrief(id, data);
  revalidatePath('/briefs');
  return brief;
}

export async function deleteBriefAction(id: string, productionId: string) {
  const success = deleteBrief(id);
  revalidatePath('/briefs');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Campaigns ─────────────────────────────────────────

export async function createCampaignAction(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) {
  const campaign = createCampaign(data);
  revalidatePath('/campaigns');
  revalidatePath(`/productions/${data.productionId}`);
  return campaign;
}

export async function updateCampaignAction(id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>>) {
  const campaign = updateCampaign(id, data);
  revalidatePath('/campaigns');
  return campaign;
}

export async function deleteCampaignAction(id: string, productionId: string) {
  const success = deleteCampaign(id);
  revalidatePath('/campaigns');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Deliverables ──────────────────────────────────────

export async function createDeliverableAction(data: Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt'>) {
  const d = createDeliverable(data);
  revalidatePath('/deliverables');
  revalidatePath(`/productions/${data.productionId}`);
  return d;
}

export async function updateDeliverableAction(id: string, data: Partial<Omit<Deliverable, 'id' | 'createdAt' | 'updatedAt'>>) {
  const d = updateDeliverable(id, data);
  revalidatePath('/deliverables');
  return d;
}

export async function deleteDeliverableAction(id: string, productionId: string) {
  const success = deleteDeliverable(id);
  revalidatePath('/deliverables');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Scenes ────────────────────────────────────────────

export async function createSceneAction(data: Omit<Scene, 'id' | 'createdAt'>) {
  const s = createScene(data);
  revalidatePath('/shots');
  revalidatePath(`/productions/${data.productionId}`);
  return s;
}

export async function updateSceneAction(id: string, data: Partial<Omit<Scene, 'id' | 'createdAt'>>) {
  const s = updateScene(id, data);
  revalidatePath('/shots');
  return s;
}

export async function deleteSceneAction(id: string, productionId: string) {
  const success = deleteScene(id);
  revalidatePath('/shots');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Shots ─────────────────────────────────────────────

export async function createShotAction(data: Omit<Shot, 'id' | 'createdAt'>) {
  const s = createShot(data);
  revalidatePath('/shots');
  revalidatePath(`/productions/${data.productionId}`);
  return s;
}

export async function updateShotAction(id: string, data: Partial<Omit<Shot, 'id' | 'createdAt'>>) {
  const s = updateShot(id, data);
  revalidatePath('/shots');
  return s;
}

export async function deleteShotAction(id: string, productionId: string) {
  const success = deleteShot(id);
  revalidatePath('/shots');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Storyboard Frames ────────────────────────────────

export async function createFrameAction(data: Omit<StoryboardFrame, 'id' | 'createdAt'>) {
  const f = createFrame(data);
  revalidatePath('/storyboards');
  revalidatePath(`/productions/${data.productionId}`);
  return f;
}

export async function deleteFrameAction(id: string, productionId: string) {
  const success = deleteFrame(id);
  revalidatePath('/storyboards');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Edit Versions ─────────────────────────────────────

export async function createEditVersionAction(data: Omit<EditVersion, 'id' | 'createdAt'>) {
  const v = createEditVersion(data);
  revalidatePath('/post');
  revalidatePath(`/productions/${data.productionId}`);
  return v;
}

export async function updateEditVersionAction(id: string, data: Partial<Omit<EditVersion, 'id' | 'createdAt'>>) {
  const v = updateEditVersion(id, data);
  revalidatePath('/post');
  return v;
}

export async function deleteEditVersionAction(id: string, productionId: string) {
  const success = deleteEditVersion(id);
  revalidatePath('/post');
  revalidatePath(`/productions/${productionId}`);
  return success;
}

// ─── Production Notes ──────────────────────────────────

export async function createProductionNoteAction(data: Omit<ProductionNote, 'id' | 'createdAt'>) {
  const n = createProductionNote(data);
  revalidatePath(`/productions/${data.productionId}`);
  return n;
}

export async function deleteProductionNoteAction(id: string, productionId: string) {
  const success = deleteProductionNote(id);
  revalidatePath(`/productions/${productionId}`);
  return success;
}
