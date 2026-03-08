// ─── Integration System Types ──────────────────────────
// Type contracts for the six production integrations:
// AppleScript, macOS Shortcuts, Folder Watchers,
// OBS WebSocket, Export Pipelines, Agent Task Execution.

export type IntegrationId =
  | 'applescript'
  | 'shortcuts'
  | 'folder-watcher'
  | 'obs'
  | 'export-pipeline'
  | 'agent-tasks';

export type IntegrationStatus = 'online' | 'offline' | 'error' | 'disabled';

export interface IntegrationHealth {
  id: IntegrationId;
  name: string;
  status: IntegrationStatus;
  description: string;
  error?: string;
  meta?: Record<string, string | number | boolean>;
}

// ─── AppleScript ───────────────────────────────────────

export type AppleScriptCommand =
  | 'open-app'
  | 'activate-app'
  | 'quit-app'
  | 'finder-reveal'
  | 'notification'
  | 'screen-studio-record'
  | 'screen-studio-stop'
  | 'davinci-open'
  | 'custom';

export interface AppleScriptRequest {
  command: AppleScriptCommand;
  /** For open-app / activate-app / quit-app */
  appName?: string;
  /** For finder-reveal */
  filePath?: string;
  /** For notification */
  title?: string;
  message?: string;
  /** For custom */
  script?: string;
}

export interface AppleScriptResult {
  success: boolean;
  output?: string;
  error?: string;
  durationMs: number;
}

// ─── macOS Shortcuts ───────────────────────────────────

export interface ShortcutDefinition {
  name: string;
  description: string;
  /** Input passed to the shortcut */
  input?: string;
}

export interface ShortcutResult {
  success: boolean;
  output?: string;
  error?: string;
  durationMs: number;
}

// ─── Folder Watcher ────────────────────────────────────

export type WatchEventType = 'add' | 'change' | 'unlink';

export interface WatchedFolder {
  id: string;
  path: string;
  label: string;
  extensions: string[];
  autoImport: boolean;
  active: boolean;
}

export interface WatchEvent {
  type: WatchEventType;
  filePath: string;
  folder: string;
  timestamp: string;
}

// ─── OBS WebSocket ─────────────────────────────────────

export type OBSAction =
  | 'get-status'
  | 'start-recording'
  | 'stop-recording'
  | 'start-streaming'
  | 'stop-streaming'
  | 'switch-scene'
  | 'get-scenes'
  | 'toggle-source';

export interface OBSRequest {
  action: OBSAction;
  sceneName?: string;
  sourceName?: string;
  visible?: boolean;
}

export interface OBSResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface OBSStatus {
  connected: boolean;
  recording: boolean;
  streaming: boolean;
  currentScene?: string;
  scenes?: string[];
}

// ─── Export Pipeline ───────────────────────────────────

export type ExportFormat = 'mp4' | 'mov' | 'webm' | 'gif' | 'jpg-seq' | 'png-seq' | 'pdf' | 'zip';
export type ExportPreset = 'youtube-4k' | 'youtube-1080' | 'tiktok-9x16' | 'instagram-1x1' | 'meta-ad' | 'web-optimized' | 'archive' | 'custom';

export interface ExportSpec {
  preset: ExportPreset;
  format: ExportFormat;
  width: number;
  height: number;
  fps: number;
  codec?: string;
  bitrate?: string;
  outputDir: string;
  filenameTemplate: string;
}

export interface ExportJob {
  id: string;
  productionId?: string;
  spec: ExportSpec;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  outputPath?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export const EXPORT_PRESETS: Record<ExportPreset, Omit<ExportSpec, 'outputDir' | 'filenameTemplate'>> = {
  'youtube-4k': { preset: 'youtube-4k', format: 'mp4', width: 3840, height: 2160, fps: 30, codec: 'h264', bitrate: '45M' },
  'youtube-1080': { preset: 'youtube-1080', format: 'mp4', width: 1920, height: 1080, fps: 30, codec: 'h264', bitrate: '12M' },
  'tiktok-9x16': { preset: 'tiktok-9x16', format: 'mp4', width: 1080, height: 1920, fps: 30, codec: 'h264', bitrate: '8M' },
  'instagram-1x1': { preset: 'instagram-1x1', format: 'mp4', width: 1080, height: 1080, fps: 30, codec: 'h264', bitrate: '8M' },
  'meta-ad': { preset: 'meta-ad', format: 'mp4', width: 1080, height: 1080, fps: 30, codec: 'h264', bitrate: '6M' },
  'web-optimized': { preset: 'web-optimized', format: 'webm', width: 1920, height: 1080, fps: 30, codec: 'vp9', bitrate: '4M' },
  'archive': { preset: 'archive', format: 'mov', width: 3840, height: 2160, fps: 30, codec: 'prores', bitrate: '200M' },
  'custom': { preset: 'custom', format: 'mp4', width: 1920, height: 1080, fps: 30 },
};

// ─── Agent Task Execution ──────────────────────────────

export type AgentTaskCategory =
  | 'content-generation'
  | 'production-planning'
  | 'review-analysis'
  | 'export-automation'
  | 'file-management'
  | 'campaign-execution';

export interface AgentTaskDefinition {
  id: string;
  category: AgentTaskCategory;
  name: string;
  description: string;
  agentRole: string;
  taskType: string;
  requiresProduction: boolean;
  autoTrigger?: string;
}

export interface AgentTaskRun {
  id: string;
  definitionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  productionId?: string;
  result?: unknown;
  error?: string;
  startedAt: string;
  completedAt?: string;
}
