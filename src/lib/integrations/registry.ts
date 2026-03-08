// ─── Integration Registry ──────────────────────────────
// Health checks and status for all six integrations.

import type { IntegrationId, IntegrationHealth } from './types';
import { isAppleScriptAvailable } from './applescript';
import { isShortcutsAvailable } from './shortcuts';
import { isFolderWatchAvailable, getActiveWatcherCount } from './folder-watcher';
import { isOBSAvailable } from './obs';
import { isFFmpegAvailable, getExportJobs } from './export-pipeline';
import { getTaskRuns, AGENT_TASK_DEFINITIONS } from './agent-tasks';

/** Check health of a single integration */
export async function getIntegrationHealth(id: IntegrationId): Promise<IntegrationHealth> {
  switch (id) {
    case 'applescript': {
      const available = await isAppleScriptAvailable();
      return {
        id: 'applescript',
        name: 'AppleScript Automation',
        status: available ? 'online' : process.platform === 'darwin' ? 'offline' : 'disabled',
        description: 'macOS app control via AppleScript (Screen Studio, DaVinci, Finder)',
        meta: { platform: process.platform },
      };
    }
    case 'shortcuts': {
      const available = await isShortcutsAvailable();
      return {
        id: 'shortcuts',
        name: 'macOS Shortcuts',
        status: available ? 'online' : process.platform === 'darwin' ? 'offline' : 'disabled',
        description: 'Run Shortcuts.app automations from the production OS',
        meta: { platform: process.platform },
      };
    }
    case 'folder-watcher': {
      const available = isFolderWatchAvailable();
      const activeCount = getActiveWatcherCount();
      return {
        id: 'folder-watcher',
        name: 'Folder Watchers',
        status: available ? (activeCount > 0 ? 'online' : 'offline') : 'disabled',
        description: 'Watch directories for new media files and auto-import',
        meta: { activeWatchers: activeCount },
      };
    }
    case 'obs': {
      const available = await isOBSAvailable();
      return {
        id: 'obs',
        name: 'OBS WebSocket',
        status: available ? 'online' : 'offline',
        description: 'Control OBS Studio — recording, streaming, scene switching',
        meta: { wsUrl: process.env.OBS_WEBSOCKET_URL || 'ws://localhost:4455' },
      };
    }
    case 'export-pipeline': {
      const ffmpeg = await isFFmpegAvailable();
      const activeJobs = getExportJobs().filter(j => j.status === 'running').length;
      return {
        id: 'export-pipeline',
        name: 'Export Pipeline',
        status: ffmpeg ? 'online' : 'offline',
        description: 'ffmpeg-based encoding with platform presets (YouTube, TikTok, etc.)',
        meta: { ffmpegAvailable: ffmpeg, activeJobs },
      };
    }
    case 'agent-tasks': {
      const recentRuns = getTaskRuns(5);
      const runningCount = recentRuns.filter(r => r.status === 'running').length;
      return {
        id: 'agent-tasks',
        name: 'Agent Task Execution',
        status: 'online',
        description: `${AGENT_TASK_DEFINITIONS.length} predefined production tasks across 6 categories`,
        meta: { totalTasks: AGENT_TASK_DEFINITIONS.length, runningTasks: runningCount },
      };
    }
  }
}

/** Get health of all integrations */
export async function getAllIntegrationHealth(): Promise<IntegrationHealth[]> {
  const ids: IntegrationId[] = ['applescript', 'shortcuts', 'folder-watcher', 'obs', 'export-pipeline', 'agent-tasks'];
  return Promise.all(ids.map(id => getIntegrationHealth(id)));
}
