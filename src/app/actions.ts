'use server';

import { createProject, updateProject, deleteProject, createAsset, deleteAsset, createDraft, deleteDraft, upsertPublishPrep } from '@/lib/data';
import type { Project, Asset, ContentDraft, PublishPrep } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createProjectAction(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
  const project = createProject(data);
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return project;
}

export async function updateProjectAction(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) {
  const project = updateProject(id, data);
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard');
  return project;
}

export async function deleteProjectAction(id: string) {
  const success = deleteProject(id);
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return success;
}

export async function createAssetAction(data: Omit<Asset, 'id' | 'createdAt'>) {
  const asset = createAsset(data);
  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath('/dashboard');
  return asset;
}

export async function deleteAssetAction(id: string, projectId: string) {
  const success = deleteAsset(id);
  revalidatePath(`/projects/${projectId}`);
  return success;
}

export async function createDraftAction(data: Omit<ContentDraft, 'id' | 'createdAt'>) {
  const draft = createDraft(data);
  revalidatePath(`/projects/${data.projectId}`);
  return draft;
}

export async function deleteDraftAction(id: string, projectId: string) {
  const success = deleteDraft(id);
  revalidatePath(`/projects/${projectId}`);
  return success;
}

export async function upsertPublishPrepAction(data: Omit<PublishPrep, 'id' | 'createdAt' | 'updatedAt'>) {
  const prep = upsertPublishPrep(data);
  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath('/publish');
  return prep;
}
