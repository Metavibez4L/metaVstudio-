// ─── Integration System — Public API ───────────────────
// Barrel export for the six production integrations.

// Types
export type {
  IntegrationId,
  IntegrationStatus,
  IntegrationHealth,
  AppleScriptCommand,
  AppleScriptRequest,
  AppleScriptResult,
  ShortcutDefinition,
  ShortcutResult,
  WatchedFolder,
  WatchEvent,
  WatchEventType,
  OBSAction,
  OBSRequest,
  OBSResult,
  OBSStatus,
  ExportFormat,
  ExportPreset,
  ExportSpec,
  ExportJob,
  AgentTaskCategory,
  AgentTaskDefinition,
  AgentTaskRun,
} from './types';

export { EXPORT_PRESETS } from './types';

// AppleScript
export { runAppleScript, isAppleScriptAvailable, getRunningApps } from './applescript';

// macOS Shortcuts
export { runShortcut, listShortcuts, isShortcutsAvailable } from './shortcuts';

// Folder Watcher
export {
  startWatching,
  stopWatching,
  stopAllWatchers,
  getActiveWatcherCount,
  getRecentEvents,
  scanDirectory,
  getDefaultWatchFolders,
  isFolderWatchAvailable,
} from './folder-watcher';

// OBS WebSocket
export { executeOBS, getOBSStatus, isOBSAvailable } from './obs';

// Export Pipeline
export {
  createExportJob,
  runExportJob,
  getExportJobs,
  getExportJob,
  isFFmpegAvailable,
  getAvailablePresets,
} from './export-pipeline';

// Agent Task Execution
export {
  AGENT_TASK_DEFINITIONS,
  createTaskRun,
  updateTaskRun,
  getTaskRuns,
  getTaskDefinitionsByCategory,
  getTaskDefinition,
  TASK_CATEGORY_LABELS,
} from './agent-tasks';

// Registry
export { getIntegrationHealth, getAllIntegrationHealth } from './registry';
