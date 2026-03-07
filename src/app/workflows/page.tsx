'use client';

import { useState } from 'react';
import { Monitor, Video, PenTool, CheckSquare, Square, ExternalLink, Workflow, Zap } from 'lucide-react';

type Tool = 'screen_studio' | 'obs' | 'excalidraw';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  phase: 'pre' | 'during' | 'post';
}

const DEFAULT_CHECKLISTS: Record<Tool, ChecklistItem[]> = {
  screen_studio: [
    { id: 'ss-1', label: 'Set recording area and resolution', checked: false, phase: 'pre' },
    { id: 'ss-2', label: 'Configure camera overlay position', checked: false, phase: 'pre' },
    { id: 'ss-3', label: 'Test microphone levels', checked: false, phase: 'pre' },
    { id: 'ss-4', label: 'Hide desktop clutter / enable Do Not Disturb', checked: false, phase: 'pre' },
    { id: 'ss-5', label: 'Open relevant apps/tabs for demo', checked: false, phase: 'pre' },
    { id: 'ss-6', label: 'Start recording', checked: false, phase: 'during' },
    { id: 'ss-7', label: 'Use cursor effects and zoom for key moments', checked: false, phase: 'during' },
    { id: 'ss-8', label: 'Pause between sections for clean cuts', checked: false, phase: 'during' },
    { id: 'ss-9', label: 'Review recording in Screen Studio editor', checked: false, phase: 'post' },
    { id: 'ss-10', label: 'Add zoom/pan animations', checked: false, phase: 'post' },
    { id: 'ss-11', label: 'Trim dead air and mistakes', checked: false, phase: 'post' },
    { id: 'ss-12', label: 'Export in target format/resolution', checked: false, phase: 'post' },
  ],
  obs: [
    { id: 'obs-1', label: 'Set scene collection for project', checked: false, phase: 'pre' },
    { id: 'obs-2', label: 'Configure sources (display, camera, audio)', checked: false, phase: 'pre' },
    { id: 'obs-3', label: 'Check stream key / recording output path', checked: false, phase: 'pre' },
    { id: 'obs-4', label: 'Test audio levels on all sources', checked: false, phase: 'pre' },
    { id: 'obs-5', label: 'Enable Studio Mode for scene transitions', checked: false, phase: 'pre' },
    { id: 'obs-6', label: 'Start stream/recording', checked: false, phase: 'during' },
    { id: 'obs-7', label: 'Monitor stats (FPS, dropped frames, CPU)', checked: false, phase: 'during' },
    { id: 'obs-8', label: 'Use scene transitions as needed', checked: false, phase: 'during' },
    { id: 'obs-9', label: 'Stop recording and verify file', checked: false, phase: 'post' },
    { id: 'obs-10', label: 'Review raw footage', checked: false, phase: 'post' },
    { id: 'obs-11', label: 'Move files to project folder', checked: false, phase: 'post' },
  ],
  excalidraw: [
    { id: 'ex-1', label: 'Open Excalidraw (app or browser)', checked: false, phase: 'pre' },
    { id: 'ex-2', label: 'Set canvas background and theme', checked: false, phase: 'pre' },
    { id: 'ex-3', label: 'Import any reference images or templates', checked: false, phase: 'pre' },
    { id: 'ex-4', label: 'Create/refine diagram or whiteboard', checked: false, phase: 'during' },
    { id: 'ex-5', label: 'Use consistent colors and font sizes', checked: false, phase: 'during' },
    { id: 'ex-6', label: 'Group and align elements', checked: false, phase: 'during' },
    { id: 'ex-7', label: 'Export as PNG/SVG for video overlay', checked: false, phase: 'post' },
    { id: 'ex-8', label: 'Save .excalidraw file to project assets', checked: false, phase: 'post' },
    { id: 'ex-9', label: 'Create step-by-step versions for animation', checked: false, phase: 'post' },
  ],
};

const TOOL_INFO: Record<Tool, { label: string; icon: typeof Monitor; description: string; launchHint: string; color: string; glow: string }> = {
  screen_studio: {
    label: 'SCREEN STUDIO',
    icon: Monitor,
    description: 'Screen recording with beautiful zoom & cursor effects',
    launchHint: 'Open Screen Studio app from Applications or Spotlight (⌘ Space → "Screen Studio")',
    color: '#00f0ff',
    glow: 'rgba(0,240,255,0.1)',
  },
  obs: {
    label: 'OBS STUDIO',
    icon: Video,
    description: 'Streaming & recording with scene-based workflows',
    launchHint: 'Open OBS from Applications or Spotlight (⌘ Space → "OBS")',
    color: '#bf5af2',
    glow: 'rgba(191,90,242,0.1)',
  },
  excalidraw: {
    label: 'EXCALIDRAW',
    icon: PenTool,
    description: 'Whiteboard diagrams & visual explanations',
    launchHint: 'Open https://excalidraw.com or use the desktop app',
    color: '#39ff14',
    glow: 'rgba(57,255,20,0.1)',
  },
};

const PHASE_COLORS = {
  pre: { label: 'PRE-PRODUCTION', color: '#00f0ff', icon: '▹' },
  during: { label: 'DURING RECORDING', color: '#ffb800', icon: '◉' },
  post: { label: 'POST-PRODUCTION', color: '#39ff14', icon: '▸' },
};

export default function WorkflowsPage() {
  const [activeTool, setActiveTool] = useState<Tool>('screen_studio');
  const [checklists, setChecklists] = useState(DEFAULT_CHECKLISTS);
  const [notes, setNotes] = useState<Record<Tool, string>>({
    screen_studio: '',
    obs: '',
    excalidraw: '',
  });

  function toggleItem(tool: Tool, itemId: string) {
    setChecklists((prev) => ({
      ...prev,
      [tool]: prev[tool].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  }

  function resetChecklist(tool: Tool) {
    setChecklists((prev) => ({
      ...prev,
      [tool]: prev[tool].map((item) => ({ ...item, checked: false })),
    }));
  }

  const info = TOOL_INFO[activeTool];
  const Icon = info.icon;
  const checklist = checklists[activeTool];
  const phases: { key: 'pre' | 'during' | 'post'; label: string }[] = [
    { key: 'pre', label: 'Pre-Production' },
    { key: 'during', label: 'During Recording' },
    { key: 'post', label: 'Post-Production' },
  ];

  const completedCount = checklist.filter((i) => i.checked).length;
  const pct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Workflow className="h-3 w-3 text-[#39ff14]/50" />
          <span className="text-[9px] font-mono text-[#39ff14]/50 tracking-[0.3em]">WORKFLOWS::ENGINE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-[#39ff14] text-glow-green">Work</span>flows
        </h1>
        <p className="text-xs font-mono text-muted/50 mt-1 tracking-wider">▸ Tool-specific checklist protocols</p>
      </div>

      {/* Tool Tabs */}
      <div className="flex gap-2">
        {(Object.keys(TOOL_INFO) as Tool[]).map((tool) => {
          const ti = TOOL_INFO[tool];
          const TIcon = ti.icon;
          const isActive = activeTool === tool;
          return (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`flex items-center gap-2.5 rounded-md border px-4 py-3 text-[10px] font-mono font-medium tracking-wider transition-all ${
                isActive
                  ? `border-[${ti.color}]/30 bg-[${ti.color}]/5`
                  : 'border-border/40 bg-background/50 text-muted/50 hover:text-muted hover:border-border/60'
              }`}
              style={isActive ? { borderColor: `${ti.color}30`, backgroundColor: `${ti.color}08`, color: ti.color, boxShadow: `0 0 15px ${ti.glow}` } : {}}
            >
              <TIcon className="h-4 w-4" />
              {ti.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Checklist Panel */}
        <div className="lg:col-span-2 neon-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" style={{ color: info.color }} />
              <div>
                <h2 className="text-xs font-mono font-semibold tracking-wider" style={{ color: info.color }}>{info.label}::PROTOCOL</h2>
                <p className="text-[10px] font-mono text-muted/40 tracking-wider">
                  {String(completedCount).padStart(2, '0')}/{String(checklist.length).padStart(2, '0')} — {pct}%
                </p>
              </div>
            </div>
            <button
              onClick={() => resetChecklist(activeTool)}
              className="rounded-md border border-border/40 px-3 py-1 text-[10px] font-mono text-muted/50 hover:text-[#ff3366] hover:border-[#ff3366]/30 tracking-wider transition-all"
            >
              RESET
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 pt-3">
            <div className="h-1 rounded-full bg-border/20 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${info.color}, ${info.color}88)`, boxShadow: `0 0 10px ${info.glow}` }}
              />
            </div>
          </div>

          {/* Phases */}
          <div className="p-4 space-y-5">
            {phases.map((phase) => {
              const items = checklist.filter((i) => i.phase === phase.key);
              const pc = PHASE_COLORS[phase.key];
              return (
                <div key={phase.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px]" style={{ color: pc.color }}>{pc.icon}</span>
                    <h3 className="text-[10px] font-mono font-semibold tracking-[0.2em]" style={{ color: `${pc.color}99` }}>{pc.label}</h3>
                    <div className="flex-1 h-px bg-border/20" />
                  </div>
                  <div className="space-y-0.5">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(activeTool, item.id)}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/[0.02] transition-colors text-left group"
                      >
                        {item.checked ? (
                          <CheckSquare className="h-4 w-4 shrink-0" style={{ color: info.color }} />
                        ) : (
                          <Square className="h-4 w-4 text-muted/30 shrink-0 group-hover:text-muted/50" />
                        )}
                        <span className={`text-xs font-mono ${item.checked ? 'text-muted/40 line-through' : 'text-muted/70'}`}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info & Notes Sidebar */}
        <div className="space-y-4">
          {/* Launch instructions */}
          <div className="neon-card p-4">
            <h3 className="text-[10px] font-mono font-semibold tracking-wider mb-3 flex items-center gap-2" style={{ color: info.color }}>
              <ExternalLink className="h-3.5 w-3.5" /> LAUNCH
            </h3>
            <p className="text-xs text-muted/60">{info.launchHint}</p>
            <p className="text-[10px] font-mono text-muted/30 mt-2 tracking-wider">{info.description}</p>
          </div>

          {/* Notes */}
          <div className="neon-card p-4">
            <h3 className="text-[10px] font-mono font-semibold tracking-wider mb-3 text-[#ffb800]">
              <Zap className="h-3.5 w-3.5 inline mr-1.5" />SESSION::NOTES
            </h3>
            <textarea
              value={notes[activeTool]}
              onChange={(e) => setNotes({ ...notes, [activeTool]: e.target.value })}
              rows={8}
              className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-xs font-mono focus:border-[#00f0ff]/30 focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.05)] resize-none placeholder:text-muted/20 transition-all"
              placeholder="Session notes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
