// ─── Folder Watcher Integration ────────────────────────
// Watch directories for new media files and auto-import as assets.
// Uses Node.js fs.watch for lightweight watching.

import { watch, type FSWatcher } from 'fs';
import { readdir, stat } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';
import { v4 as uuid } from 'uuid';
import type { WatchedFolder, WatchEvent } from './types';

const MEDIA_EXTENSIONS = new Set([
  '.mp4', '.mov', '.avi', '.mkv', '.webm',
  '.mp3', '.wav', '.aac', '.flac',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.bmp',
  '.psd', '.ai', '.svg', '.eps',
  '.pdf', '.srt', '.vtt',
  '.prproj', '.drp', '.fcpxml',
]);

// ─── Active Watchers ───────────────────────────────────

const activeWatchers = new Map<string, FSWatcher>();
const eventLog: WatchEvent[] = [];
const MAX_EVENT_LOG = 200;

/** Start watching a folder */
export function startWatching(folder: WatchedFolder, onEvent?: (event: WatchEvent) => void): boolean {
  if (activeWatchers.has(folder.id)) return true; // already watching

  const resolvedPath = resolve(folder.path.replace(/^~/, process.env.HOME || ''));

  try {
    const watcher = watch(resolvedPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;

      const ext = extname(filename).toLowerCase();
      if (folder.extensions.length > 0 && !folder.extensions.includes(ext)) return;
      if (folder.extensions.length === 0 && !MEDIA_EXTENSIONS.has(ext)) return;

      const watchEvent: WatchEvent = {
        type: eventType === 'rename' ? 'add' : 'change',
        filePath: join(resolvedPath, filename),
        folder: folder.path,
        timestamp: new Date().toISOString(),
      };

      eventLog.unshift(watchEvent);
      if (eventLog.length > MAX_EVENT_LOG) eventLog.length = MAX_EVENT_LOG;

      onEvent?.(watchEvent);
    });

    activeWatchers.set(folder.id, watcher);
    return true;
  } catch {
    return false;
  }
}

/** Stop watching a folder */
export function stopWatching(folderId: string): boolean {
  const watcher = activeWatchers.get(folderId);
  if (!watcher) return false;
  watcher.close();
  activeWatchers.delete(folderId);
  return true;
}

/** Stop all watchers */
export function stopAllWatchers(): void {
  for (const [id, watcher] of activeWatchers) {
    watcher.close();
    activeWatchers.delete(id);
  }
}

/** Get active watcher count */
export function getActiveWatcherCount(): number {
  return activeWatchers.size;
}

/** Get recent watch events */
export function getRecentEvents(limit = 50): WatchEvent[] {
  return eventLog.slice(0, limit);
}

/** Scan a directory for existing media files */
export async function scanDirectory(dirPath: string): Promise<string[]> {
  const resolvedPath = resolve(dirPath.replace(/^~/, process.env.HOME || ''));
  const files: string[] = [];

  try {
    const entries = await readdir(resolvedPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = extname(entry.name).toLowerCase();
      if (MEDIA_EXTENSIONS.has(ext)) {
        files.push(join(resolvedPath, entry.name));
      }
    }
  } catch {
    // directory not accessible
  }

  return files;
}

/** Get default watched folders for the current system */
export function getDefaultWatchFolders(): WatchedFolder[] {
  const home = process.env.HOME || '/tmp';
  return [
    { id: uuid(), path: `${home}/Desktop/captures`, label: 'Desktop Captures', extensions: [], autoImport: true, active: false },
    { id: uuid(), path: `${home}/Movies/exports`, label: 'Movie Exports', extensions: ['.mp4', '.mov'], autoImport: true, active: false },
    { id: uuid(), path: `${home}/Downloads`, label: 'Downloads', extensions: ['.mp4', '.mov', '.mp3', '.wav'], autoImport: false, active: false },
  ];
}

/** Check if folder watching is possible */
export function isFolderWatchAvailable(): boolean {
  return typeof watch === 'function';
}
