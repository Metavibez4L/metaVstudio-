// ─── Environment Profile System ────────────────────────
// Centralized configuration that adapts to deployment target.
// Profiles: laptop (MacBook Air M4) → studio (Mac Studio M3 Ultra) → cloud (future)

export type DeploymentProfile = 'laptop' | 'studio' | 'cloud';

export type AIProviderType = 'ollama' | 'openai';

export interface AIConfig {
  provider: AIProviderType;
  ollama: {
    baseUrl: string;
    model: string;
  };
  openai: {
    apiKey: string;
    model: string;
    baseUrl: string;
  };
  /** Max tokens for generation calls */
  maxTokens: number;
  /** Default temperature for creative generation */
  temperature: number;
}

export interface StorageConfig {
  /** Path to SQLite database file */
  databasePath: string;
  /** Directory for asset uploads / file storage */
  assetsDir: string;
  /** Enable WAL mode (recommended for concurrent reads) */
  walMode: boolean;
}

export interface RuntimeConfig {
  /** Enable background task queue (studio/cloud only) */
  backgroundTasks: boolean;
  /** Enable scheduled jobs (studio/cloud only) */
  scheduledJobs: boolean;
  /** Max concurrent AI requests */
  maxConcurrentAI: number;
  /** Enable file watchers for auto-import (studio only) */
  fileWatchers: boolean;
}

export interface IntegrationConfig {
  /** Screen Studio app path (macOS) */
  screenStudioPath: string;
  /** OBS WebSocket URL */
  obsWebSocketUrl: string;
  /** Excalidraw integration mode */
  excalidrawMode: 'local' | 'web';
  /** Watched directories for auto-import */
  watchDirs: string[];
}

export interface AppConfig {
  profile: DeploymentProfile;
  appName: string;
  port: number;
  ai: AIConfig;
  storage: StorageConfig;
  runtime: RuntimeConfig;
  integrations: IntegrationConfig;
}

// ─── Profile Defaults ──────────────────────────────────

const PROFILE_DEFAULTS: Record<DeploymentProfile, Omit<AppConfig, 'profile'>> = {
  laptop: {
    appName: 'metaVstudio',
    port: 3000,
    ai: {
      provider: 'ollama',
      ollama: { baseUrl: 'http://localhost:11434', model: 'kimi-k2.5:cloud' },
      openai: { apiKey: '', model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
      maxTokens: 2000,
      temperature: 0.7,
    },
    storage: {
      databasePath: './data/metavstudio.db',
      assetsDir: './data/assets',
      walMode: true,
    },
    runtime: {
      backgroundTasks: false,
      scheduledJobs: false,
      maxConcurrentAI: 1,
      fileWatchers: false,
    },
    integrations: {
      screenStudioPath: '/Applications/Screen Studio.app',
      obsWebSocketUrl: 'ws://localhost:4455',
      excalidrawMode: 'local',
      watchDirs: [],
    },
  },
  studio: {
    appName: 'metaVstudio',
    port: 3000,
    ai: {
      provider: 'ollama',
      ollama: { baseUrl: 'http://localhost:11434', model: 'kimi-k2.5:cloud' },
      openai: { apiKey: '', model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
      maxTokens: 4000,
      temperature: 0.7,
    },
    storage: {
      databasePath: './data/metavstudio.db',
      assetsDir: './data/assets',
      walMode: true,
    },
    runtime: {
      backgroundTasks: true,
      scheduledJobs: true,
      maxConcurrentAI: 4,
      fileWatchers: true,
    },
    integrations: {
      screenStudioPath: '/Applications/Screen Studio.app',
      obsWebSocketUrl: 'ws://localhost:4455',
      excalidrawMode: 'local',
      watchDirs: ['~/Desktop/captures', '~/Movies/exports'],
    },
  },
  cloud: {
    appName: 'metaVstudio',
    port: 3000,
    ai: {
      provider: 'openai',
      ollama: { baseUrl: 'http://localhost:11434', model: 'kimi-k2.5:cloud' },
      openai: { apiKey: '', model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
      maxTokens: 4000,
      temperature: 0.7,
    },
    storage: {
      databasePath: './data/metavstudio.db',
      assetsDir: './data/assets',
      walMode: true,
    },
    runtime: {
      backgroundTasks: true,
      scheduledJobs: true,
      maxConcurrentAI: 8,
      fileWatchers: false,
    },
    integrations: {
      screenStudioPath: '',
      obsWebSocketUrl: '',
      excalidrawMode: 'web',
      watchDirs: [],
    },
  },
};

// ─── Config Builder (reads env vars, applies profile defaults) ──

function detectProfile(): DeploymentProfile {
  const envProfile = process.env.DEPLOYMENT_PROFILE;
  if (envProfile === 'studio' || envProfile === 'cloud' || envProfile === 'laptop') {
    return envProfile;
  }
  return 'laptop';
}

function buildConfig(): AppConfig {
  const profile = detectProfile();
  const defaults = PROFILE_DEFAULTS[profile];

  return {
    profile,
    appName: process.env.NEXT_PUBLIC_APP_NAME || defaults.appName,
    port: parseInt(process.env.PORT || String(defaults.port), 10),
    ai: {
      provider: (process.env.AI_PROVIDER as AIProviderType) || defaults.ai.provider,
      ollama: {
        baseUrl: process.env.OLLAMA_BASE_URL || defaults.ai.ollama.baseUrl,
        model: process.env.OLLAMA_MODEL || defaults.ai.ollama.model,
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || defaults.ai.openai.apiKey,
        model: process.env.OPENAI_MODEL || defaults.ai.openai.model,
        baseUrl: process.env.OPENAI_BASE_URL || defaults.ai.openai.baseUrl,
      },
      maxTokens: parseInt(process.env.AI_MAX_TOKENS || String(defaults.ai.maxTokens), 10),
      temperature: parseFloat(process.env.AI_TEMPERATURE || String(defaults.ai.temperature)),
    },
    storage: {
      databasePath: process.env.DATABASE_PATH || defaults.storage.databasePath,
      assetsDir: process.env.ASSETS_DIR || defaults.storage.assetsDir,
      walMode: process.env.DB_WAL_MODE !== 'false',
    },
    runtime: {
      backgroundTasks: process.env.ENABLE_BACKGROUND_TASKS === 'true' || defaults.runtime.backgroundTasks,
      scheduledJobs: process.env.ENABLE_SCHEDULED_JOBS === 'true' || defaults.runtime.scheduledJobs,
      maxConcurrentAI: parseInt(process.env.MAX_CONCURRENT_AI || String(defaults.runtime.maxConcurrentAI), 10),
      fileWatchers: process.env.ENABLE_FILE_WATCHERS === 'true' || defaults.runtime.fileWatchers,
    },
    integrations: {
      screenStudioPath: process.env.SCREEN_STUDIO_PATH || defaults.integrations.screenStudioPath,
      obsWebSocketUrl: process.env.OBS_WEBSOCKET_URL || defaults.integrations.obsWebSocketUrl,
      excalidrawMode: (process.env.EXCALIDRAW_MODE as 'local' | 'web') || defaults.integrations.excalidrawMode,
      watchDirs: process.env.WATCH_DIRS ? process.env.WATCH_DIRS.split(',').map(d => d.trim()) : defaults.integrations.watchDirs,
    },
  };
}

// ─── Singleton Config ──────────────────────────────────

let _config: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!_config) {
    _config = buildConfig();
  }
  return _config;
}

/** Reset config — useful for testing or hot-reload scenarios */
export function resetConfig(): void {
  _config = null;
}

// ─── Convenience Accessors ─────────────────────────────

export function isStudioMode(): boolean {
  return getConfig().profile === 'studio';
}

export function isCloudMode(): boolean {
  return getConfig().profile === 'cloud';
}

export function isLaptopMode(): boolean {
  return getConfig().profile === 'laptop';
}
