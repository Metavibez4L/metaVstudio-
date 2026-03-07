// ─── Integration Service Interfaces ────────────────────
// Clean boundaries for external tool integrations.
// On laptop: stubs/manual mode only.
// On studio: full automation via AppleScript, WebSocket, folder watchers.

import { getConfig } from '../config';

// ─── Base Service ──────────────────────────────────────

export interface ServiceHealth {
  name: string;
  available: boolean;
  mode: 'active' | 'stub' | 'disabled';
  error?: string;
}

export abstract class IntegrationService {
  abstract readonly name: string;

  /** Check if this service is available in the current environment */
  abstract checkHealth(): Promise<ServiceHealth>;

  /** Whether the service is enabled based on current profile */
  get isEnabled(): boolean {
    return true;
  }
}

// ─── Screen Studio Service ─────────────────────────────

export class ScreenStudioService extends IntegrationService {
  readonly name = 'screen-studio';

  async checkHealth(): Promise<ServiceHealth> {
    const config = getConfig();
    const appPath = config.integrations.screenStudioPath;

    // In a real implementation, check if the app exists on disk
    return {
      name: this.name,
      available: !!appPath,
      mode: config.profile === 'cloud' ? 'disabled' : 'stub',
    };
  }

  /** Future: trigger recording via AppleScript or URL scheme */
  async startRecording(): Promise<void> {
    // Stub — on studio mode, this would use AppleScript:
    // osascript -e 'tell application "Screen Studio" to start recording'
    throw new Error('Screen Studio automation requires studio mode');
  }
}

// ─── OBS Service ───────────────────────────────────────

export class OBSService extends IntegrationService {
  readonly name = 'obs';

  async checkHealth(): Promise<ServiceHealth> {
    const config = getConfig();
    const wsUrl = config.integrations.obsWebSocketUrl;

    return {
      name: this.name,
      available: !!wsUrl,
      mode: config.profile === 'cloud' ? 'disabled' : 'stub',
    };
  }

  /** Future: connect to OBS WebSocket for scene switching, recording control */
  async connect(): Promise<void> {
    // Stub — on studio mode, this would connect via obs-websocket-js
    throw new Error('OBS WebSocket integration requires studio mode');
  }
}

// ─── File Watcher Service ──────────────────────────────

export class FileWatcherService extends IntegrationService {
  readonly name = 'file-watcher';

  get isEnabled(): boolean {
    return getConfig().runtime.fileWatchers;
  }

  async checkHealth(): Promise<ServiceHealth> {
    const config = getConfig();
    return {
      name: this.name,
      available: config.runtime.fileWatchers,
      mode: config.runtime.fileWatchers ? 'stub' : 'disabled',
    };
  }

  /** Future: watch directories for new files and auto-import as assets */
  async startWatching(): Promise<void> {
    const config = getConfig();
    if (!config.runtime.fileWatchers) {
      throw new Error('File watchers disabled in current profile');
    }
    // Stub — on studio mode, this would use chokidar or fs.watch
    // to monitor config.integrations.watchDirs
  }
}

// ─── Service Registry ──────────────────────────────────

let _services: Map<string, IntegrationService> | null = null;

function initServices(): Map<string, IntegrationService> {
  const map = new Map<string, IntegrationService>();
  map.set('screen-studio', new ScreenStudioService());
  map.set('obs', new OBSService());
  map.set('file-watcher', new FileWatcherService());
  return map;
}

export function getService(name: string): IntegrationService | undefined {
  if (!_services) {
    _services = initServices();
  }
  return _services.get(name);
}

export async function getAllServiceHealth(): Promise<ServiceHealth[]> {
  if (!_services) {
    _services = initServices();
  }
  const results: ServiceHealth[] = [];
  for (const service of _services.values()) {
    results.push(await service.checkHealth());
  }
  return results;
}
