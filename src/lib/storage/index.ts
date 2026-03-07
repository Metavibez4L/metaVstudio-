// ─── Storage Interface ─────────────────────────────────
// Abstraction layer for data persistence. Currently backed by SQLite.
// When migrating to studio mode, this can be swapped for PostgreSQL,
// or a hybrid where SQLite handles local cache and Postgres is source of truth.

import type { Project, Asset, ContentDraft, WorkflowTemplate, CreatorPreference, PublishPrep } from '../types';

/** Generic repository interface for CRUD operations */
export interface Repository<T, CreateData, UpdateData = Partial<CreateData>> {
  getAll(...args: unknown[]): T[];
  getById(id: string): T | null;
  create(data: CreateData): T;
  update?(id: string, data: UpdateData): T | null;
  delete(id: string): boolean;
}

/** Storage backend identifier */
export type StorageBackend = 'sqlite' | 'postgres';

/** Health check result */
export interface StorageHealth {
  backend: StorageBackend;
  connected: boolean;
  dbPath?: string;
  error?: string;
}

/** Current storage backend — reads from config */
export function getStorageBackend(): StorageBackend {
  // Currently only SQLite is implemented.
  // In studio/cloud mode, this can return 'postgres' when ready.
  return 'sqlite';
}

// Re-export all data access functions so consumers can import from here
export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectCounts,
  getAssets,
  getRecentAssets,
  createAsset,
  deleteAsset,
  getDrafts,
  createDraft,
  deleteDraft,
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  getPreferences,
  getPreference,
  setPreference,
  getPublishPreps,
  upsertPublishPrep,
} from '../data';
