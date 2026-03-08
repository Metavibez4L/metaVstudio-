import { getAllIntegrationHealth } from '@/lib/integrations';
import { getAvailablePresets, getExportJobs } from '@/lib/integrations';
import { getTaskDefinitionsByCategory, getTaskRuns, TASK_CATEGORY_LABELS } from '@/lib/integrations';
import { getDefaultWatchFolders, getRecentEvents } from '@/lib/integrations';
import Link from 'next/link';
import {
  Plug,
  Terminal,
  Smartphone,
  FolderSearch,
  Radio,
  FileOutput,
  Bot,
  CheckCircle,
  XCircle,
  Circle,
  AlertCircle,
  Zap,
  MonitorPlay,
  Film,
  Crosshair,
  FileText,
  Megaphone,
  Package,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';
import type { IntegrationStatus, AgentTaskCategory } from '@/lib/integrations/types';

export const dynamic = 'force-dynamic';

const STATUS_CONFIG: Record<IntegrationStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  online: { icon: CheckCircle, color: 'text-[#39ff14]', label: 'ONLINE' },
  offline: { icon: XCircle, color: 'text-[#ffb800]', label: 'OFFLINE' },
  error: { icon: AlertCircle, color: 'text-[#ff3366]', label: 'ERROR' },
  disabled: { icon: Circle, color: 'text-muted/30', label: 'DISABLED' },
};

const INTEGRATION_ICONS: Record<string, typeof Terminal> = {
  applescript: Terminal,
  shortcuts: Smartphone,
  'folder-watcher': FolderSearch,
  obs: Radio,
  'export-pipeline': FileOutput,
  'agent-tasks': Bot,
};

const INTEGRATION_COLORS: Record<string, { text: string; glow: string; border: string }> = {
  applescript: { text: 'text-[#00f0ff]', glow: 'rgba(0,240,255,0.08)', border: 'border-[#00f0ff]/20' },
  shortcuts: { text: 'text-[#bf5af2]', glow: 'rgba(191,90,242,0.08)', border: 'border-[#bf5af2]/20' },
  'folder-watcher': { text: 'text-[#39ff14]', glow: 'rgba(57,255,20,0.08)', border: 'border-[#39ff14]/20' },
  obs: { text: 'text-[#ff3366]', glow: 'rgba(255,51,102,0.08)', border: 'border-[#ff3366]/20' },
  'export-pipeline': { text: 'text-[#ffb800]', glow: 'rgba(255,184,0,0.08)', border: 'border-[#ffb800]/20' },
  'agent-tasks': { text: 'text-[#00f0ff]', glow: 'rgba(0,240,255,0.08)', border: 'border-[#00f0ff]/20' },
};

const CATEGORY_ICONS: Record<AgentTaskCategory, typeof Film> = {
  'content-generation': FileText,
  'production-planning': Film,
  'review-analysis': Eye,
  'export-automation': FileOutput,
  'file-management': Package,
  'campaign-execution': Megaphone,
};

export default async function IntegrationsPage() {
  const health = await getAllIntegrationHealth();
  const presets = getAvailablePresets();
  const exportJobs = getExportJobs();
  const taskCategories = getTaskDefinitionsByCategory();
  const taskRuns = getTaskRuns(10);
  const watchFolders = getDefaultWatchFolders();
  const watchEvents = getRecentEvents(10);

  const onlineCount = health.filter(h => h.status === 'online').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#bf5af2]/50 tracking-[0.3em] uppercase">
              <Plug className="h-3 w-3 animate-pulse" />
              SYSTEM::INTEGRATIONS
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-glow-cyan">Future</span>{' '}
            <span className="text-[#bf5af2] text-glow-magenta">::Integrations</span>
          </h1>
          <p className="text-xs font-mono text-muted mt-1 tracking-wider">▸ AppleScript · Shortcuts · Watchers · OBS · Export · Agent Tasks</p>
        </div>
        <div className="text-right text-[10px] font-mono text-muted/50 tracking-wider">
          <p>{onlineCount}/{health.length} ONLINE</p>
          <p className={onlineCount > 0 ? 'text-[#39ff14]/40' : 'text-muted/30'}>
            {onlineCount > 0 ? 'INTEGRATIONS::ACTIVE' : 'INTEGRATIONS::STANDBY'}
          </p>
        </div>
      </div>

      {/* Integration Status Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {health.map((h) => {
          const Icon = INTEGRATION_ICONS[h.id] || Plug;
          const colors = INTEGRATION_COLORS[h.id] || { text: 'text-muted', glow: 'rgba(100,100,100,0.08)', border: 'border-border/20' };
          const statusCfg = STATUS_CONFIG[h.status];
          const StatusIcon = statusCfg.icon;

          return (
            <div key={h.id} className={`neon-card p-4 relative overflow-hidden border ${colors.border}`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-5 w-5 ${colors.text} opacity-70`} />
                <StatusIcon className={`h-3.5 w-3.5 ${statusCfg.color}`} />
              </div>
              <p className={`text-xs font-mono font-semibold ${colors.text} tracking-wider mb-1`}>
                {h.name.split(' ').map(w => w.slice(0, 6).toUpperCase()).join(' ')}
              </p>
              <p className="text-[9px] font-mono text-muted/40 tracking-wider">{statusCfg.label}</p>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-20 blur-2xl" style={{ background: colors.glow }} />
            </div>
          );
        })}
      </div>

      {/* Integration Details */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* AppleScript Automation */}
        <div className="neon-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#00f0ff]" />
              <h2 className="text-xs font-mono font-semibold tracking-wider text-[#00f0ff]">APPLESCRIPT::AUTOMATION</h2>
            </div>
            <span className={`text-[10px] font-mono tracking-wider ${STATUS_CONFIG[health.find(h => h.id === 'applescript')?.status || 'disabled'].color}`}>
              {health.find(h => h.id === 'applescript')?.status.toUpperCase()}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-mono text-muted/50 tracking-wider">Control macOS apps from the production OS</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'SCREEN STUDIO', desc: 'Start/stop recording' },
                { label: 'DAVINCI RESOLVE', desc: 'Open project' },
                { label: 'FINDER', desc: 'Reveal files' },
                { label: 'NOTIFICATIONS', desc: 'System alerts' },
              ].map((cmd) => (
                <div key={cmd.label} className="rounded-lg border border-border/30 bg-background/50 p-2.5">
                  <p className="text-[10px] font-mono font-medium text-[#00f0ff]/80 tracking-wider">{cmd.label}</p>
                  <p className="text-[9px] font-mono text-muted/30 mt-0.5">{cmd.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* macOS Shortcuts */}
        <div className="neon-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#bf5af2]" />
              <h2 className="text-xs font-mono font-semibold tracking-wider text-[#bf5af2]">MACOS::SHORTCUTS</h2>
            </div>
            <span className={`text-[10px] font-mono tracking-wider ${STATUS_CONFIG[health.find(h => h.id === 'shortcuts')?.status || 'disabled'].color}`}>
              {health.find(h => h.id === 'shortcuts')?.status.toUpperCase()}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-mono text-muted/50 tracking-wider">Run Shortcuts.app automations from the production pipeline</p>
            <div className="space-y-2">
              {[
                'Batch resize images for social media',
                'Convert video formats via Compressor',
                'Upload to cloud storage on export',
                'Generate thumbnails from video files',
                'Send production updates via Messages/Slack',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[10px] font-mono text-muted/40 tracking-wider">
                  <Zap className="h-3 w-3 text-[#bf5af2]/40 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Folder Watchers */}
        <div className="neon-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <FolderSearch className="h-4 w-4 text-[#39ff14]" />
              <h2 className="text-xs font-mono font-semibold tracking-wider text-[#39ff14]">FOLDER::WATCHERS</h2>
            </div>
            <span className={`text-[10px] font-mono tracking-wider ${STATUS_CONFIG[health.find(h => h.id === 'folder-watcher')?.status || 'disabled'].color}`}>
              {health.find(h => h.id === 'folder-watcher')?.status.toUpperCase()}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-mono text-muted/50 tracking-wider">Auto-import media from monitored directories</p>
            <div className="space-y-2">
              {watchFolders.map((folder) => (
                <div key={folder.id} className="flex items-center justify-between rounded-lg border border-border/30 bg-background/50 px-3 py-2">
                  <div>
                    <p className="text-[10px] font-mono font-medium text-[#39ff14]/80 tracking-wider">{folder.label.toUpperCase()}</p>
                    <p className="text-[9px] font-mono text-muted/30 mt-0.5">{folder.path}</p>
                  </div>
                  <span className={`text-[9px] font-mono tracking-wider ${folder.active ? 'text-[#39ff14]' : 'text-muted/30'}`}>
                    {folder.active ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
              ))}
            </div>
            {watchEvents.length > 0 && (
              <div className="mt-2">
                <p className="text-[9px] font-mono text-muted/30 tracking-wider mb-1.5">RECENT EVENTS</p>
                {watchEvents.slice(0, 3).map((evt, i) => (
                  <div key={i} className="text-[9px] font-mono text-muted/30 truncate">
                    {evt.type.toUpperCase()} · {evt.filePath.split('/').pop()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OBS WebSocket */}
        <div className="neon-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-[#ff3366]" />
              <h2 className="text-xs font-mono font-semibold tracking-wider text-[#ff3366]">OBS::WEBSOCKET</h2>
            </div>
            <span className={`text-[10px] font-mono tracking-wider ${STATUS_CONFIG[health.find(h => h.id === 'obs')?.status || 'disabled'].color}`}>
              {health.find(h => h.id === 'obs')?.status.toUpperCase()}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-mono text-muted/50 tracking-wider">Control OBS Studio for recording and streaming</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'RECORD', desc: 'Start/stop recording', icon: '⏺' },
                { label: 'STREAM', desc: 'Start/stop streaming', icon: '📡' },
                { label: 'SCENES', desc: 'Switch active scene', icon: '🎬' },
                { label: 'SOURCES', desc: 'Toggle source visibility', icon: '👁' },
              ].map((cmd) => (
                <div key={cmd.label} className="rounded-lg border border-border/30 bg-background/50 p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{cmd.icon}</span>
                    <p className="text-[10px] font-mono font-medium text-[#ff3366]/80 tracking-wider">{cmd.label}</p>
                  </div>
                  <p className="text-[9px] font-mono text-muted/30 mt-0.5">{cmd.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-muted/30 tracking-wider">
              <MonitorPlay className="h-3 w-3" />
              <span>WS: {process.env.OBS_WEBSOCKET_URL || 'ws://localhost:4455'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Pipeline — Full Width */}
      <div className="neon-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileOutput className="h-4 w-4 text-[#ffb800]" />
            <h2 className="text-xs font-mono font-semibold tracking-wider text-[#ffb800]">EXPORT::PIPELINE</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted/40 tracking-wider">{presets.length} PRESETS</span>
            <span className={`text-[10px] font-mono tracking-wider ${STATUS_CONFIG[health.find(h => h.id === 'export-pipeline')?.status || 'disabled'].color}`}>
              {health.find(h => h.id === 'export-pipeline')?.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-mono text-muted/50 tracking-wider mb-3">Platform-optimized encoding presets via ffmpeg</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {presets.map((p) => (
              <div key={p.preset} className="rounded-lg border border-border/30 bg-background/50 p-2.5 text-center">
                <p className="text-[10px] font-mono font-medium text-[#ffb800]/80 tracking-wider">{p.label.toUpperCase()}</p>
                <p className="text-[9px] font-mono text-muted/30 mt-0.5">{p.dims}</p>
              </div>
            ))}
          </div>
          {exportJobs.length > 0 && (
            <div className="mt-4">
              <p className="text-[9px] font-mono text-muted/30 tracking-wider mb-2">ACTIVE JOBS</p>
              <div className="space-y-1.5">
                {exportJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted/50">{job.spec.preset}</span>
                    <span className={job.status === 'completed' ? 'text-[#39ff14]' : job.status === 'failed' ? 'text-[#ff3366]' : 'text-[#ffb800]'}>
                      {job.status.toUpperCase()} {job.progress > 0 && job.status === 'running' ? `${job.progress}%` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Task Execution — Full Width */}
      <div className="neon-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#00f0ff]" />
            <h2 className="text-xs font-mono font-semibold tracking-wider text-[#00f0ff]">AGENT::TASK EXECUTION</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted/40 tracking-wider">
              {Object.values(taskCategories).flat().length} TASKS · 6 CATEGORIES
            </span>
            <Link href="/agents" className="text-[10px] font-mono text-[#00f0ff]/60 hover:text-[#00f0ff] tracking-wider transition-colors">AGENTS →</Link>
          </div>
        </div>
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(taskCategories) as [AgentTaskCategory, typeof taskCategories[AgentTaskCategory]][]).map(([category, tasks]) => {
              const CatIcon = CATEGORY_ICONS[category] || Bot;
              return (
                <div key={category} className="rounded-xl border border-border/30 bg-background/50 p-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <CatIcon className="h-3.5 w-3.5 text-[#00f0ff]/60" />
                    <p className="text-[10px] font-mono font-semibold text-[#00f0ff]/80 tracking-wider">
                      {TASK_CATEGORY_LABELS[category].toUpperCase()}
                    </p>
                    <span className="ml-auto text-[9px] font-mono text-muted/30">{tasks.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#00f0ff]/30 shrink-0" />
                        <span className="text-[9px] font-mono text-muted/40 tracking-wider truncate">{task.name}</span>
                        <span className="ml-auto text-[8px] font-mono text-muted/20 tracking-wider shrink-0">
                          {task.agentRole.split('-').map(w => w[0]?.toUpperCase()).join('')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Task Runs */}
          {taskRuns.length > 0 && (
            <div className="mt-4 border-t border-border/30 pt-3">
              <p className="text-[9px] font-mono text-muted/30 tracking-wider mb-2">RECENT RUNS</p>
              <div className="space-y-1.5">
                {taskRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-muted/50">{run.definitionId}</span>
                    <span className={run.status === 'completed' ? 'text-[#39ff14]' : run.status === 'failed' ? 'text-[#ff3366]' : 'text-muted/40'}>
                      {run.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
