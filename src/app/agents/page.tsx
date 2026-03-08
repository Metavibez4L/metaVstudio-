import {
  getAgentDirectory,
  getTaskTypes,
  AGENT_DISPLAY_NAMES,
} from '@/lib/agents';
import Link from 'next/link';
import {
  Radio,
  Crown,
  Palette,
  PenTool,
  Crosshair,
  SlidersHorizontal,
  Megaphone,
  FolderOpen,
  Zap,
  ArrowRight,
  Network,
  CheckCircle,
  Bot,
  Sparkles,
} from 'lucide-react';
import type { AgentRole, AgentTaskType } from '@/lib/agents';

export const dynamic = 'force-dynamic';

const AGENT_ICONS: Record<AgentRole, typeof Crown> = {
  'executive-producer': Crown,
  'creative-director': Palette,
  'script-architect': PenTool,
  'shot-planner': Crosshair,
  'post-supervisor': SlidersHorizontal,
  'campaign-strategist': Megaphone,
  'asset-librarian': FolderOpen,
};

const AGENT_COLORS: Record<AgentRole, { text: string; glow: string; bg: string; border: string; dot: string }> = {
  'executive-producer': {
    text: 'text-[#ffb800]',
    glow: 'rgba(255,184,0,0.08)',
    bg: 'bg-[#ffb800]/8',
    border: 'border-[#ffb800]/20',
    dot: 'bg-[#ffb800]',
  },
  'creative-director': {
    text: 'text-[#bf5af2]',
    glow: 'rgba(191,90,242,0.08)',
    bg: 'bg-[#bf5af2]/8',
    border: 'border-[#bf5af2]/20',
    dot: 'bg-[#bf5af2]',
  },
  'script-architect': {
    text: 'text-[#00f0ff]',
    glow: 'rgba(0,240,255,0.08)',
    bg: 'bg-[#00f0ff]/8',
    border: 'border-[#00f0ff]/20',
    dot: 'bg-[#00f0ff]',
  },
  'shot-planner': {
    text: 'text-[#39ff14]',
    glow: 'rgba(57,255,20,0.08)',
    bg: 'bg-[#39ff14]/8',
    border: 'border-[#39ff14]/20',
    dot: 'bg-[#39ff14]',
  },
  'post-supervisor': {
    text: 'text-[#ff3366]',
    glow: 'rgba(255,51,102,0.08)',
    bg: 'bg-[#ff3366]/8',
    border: 'border-[#ff3366]/20',
    dot: 'bg-[#ff3366]',
  },
  'campaign-strategist': {
    text: 'text-[#00f0ff]',
    glow: 'rgba(0,240,255,0.08)',
    bg: 'bg-[#00f0ff]/8',
    border: 'border-[#00f0ff]/20',
    dot: 'bg-[#00f0ff]',
  },
  'asset-librarian': {
    text: 'text-[#bf5af2]',
    glow: 'rgba(191,90,242,0.08)',
    bg: 'bg-[#bf5af2]/8',
    border: 'border-[#bf5af2]/20',
    dot: 'bg-[#bf5af2]',
  },
};

const TASK_DISPLAY: Record<string, string> = {
  'production-roadmap': 'Production Roadmap',
  'milestone-plan': 'Milestone Plan',
  'task-routing': 'Task Routing',
  'status-summary': 'Status Summary',
  'blocker-report': 'Blocker Report',
  'next-steps': 'Next Steps',
  'creative-brief': 'Creative Brief',
  'treatment': 'Treatment',
  'campaign-concept': 'Campaign Concept',
  'brand-story': 'Brand Story',
  'tone-direction': 'Tone Direction',
  'visual-language': 'Visual Language',
  'hero-script': 'Hero Script',
  'promo-script': 'Promo Script',
  'short-form-script': 'Short-Form Script',
  'ad-hooks': 'Ad Hooks',
  'voiceover-draft': 'Voiceover Draft',
  'cta-variants': 'CTA Variants',
  'platform-script': 'Platform Script',
  'shot-list': 'Shot List',
  'scene-breakdown': 'Scene Breakdown',
  'visual-plan': 'Visual Plan',
  'camera-notes': 'Camera Notes',
  'coverage-map': 'Coverage Map',
  'broll-plan': 'B-Roll Plan',
  'edit-plan': 'Edit Plan',
  'revision-checklist': 'Revision Checklist',
  'delivery-matrix': 'Delivery Matrix',
  'export-list': 'Export List',
  'post-notes': 'Post Notes',
  'ad-angle-matrix': 'Ad Angle Matrix',
  'audience-variants': 'Audience Variants',
  'platform-copy': 'Platform Copy',
  'campaign-rollout': 'Campaign Rollout',
  'repurposing-plan': 'Repurposing Plan',
  'cta-tree': 'CTA Tree',
  'asset-map': 'Asset Map',
  'tag-structure': 'Tag Structure',
  'naming-convention': 'Naming Convention',
  'linked-assets': 'Linked Assets',
};

// Handoff connections for the flow visualization
const HANDOFF_FLOWS: Array<{ from: AgentRole; to: AgentRole; label: string }> = [
  { from: 'executive-producer', to: 'creative-director', label: 'Vision & Concept' },
  { from: 'creative-director', to: 'script-architect', label: 'Scripts & Narrative' },
  { from: 'creative-director', to: 'campaign-strategist', label: 'Campaign Strategy' },
  { from: 'script-architect', to: 'shot-planner', label: 'Shot Design' },
  { from: 'shot-planner', to: 'post-supervisor', label: 'Post Pipeline' },
  { from: 'post-supervisor', to: 'campaign-strategist', label: 'Repurposing' },
  { from: 'post-supervisor', to: 'asset-librarian', label: 'Asset Org' },
];

export default function AgentsPage() {
  const agents = getAgentDirectory();
  const taskTypes = getTaskTypes();

  const totalCapabilities = taskTypes.length;
  const orchestrator = agents.find((a) => a.role === 'executive-producer');
  const specialists = agents.filter((a) => a.role !== 'executive-producer');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#ffb800]/50 tracking-[0.3em] uppercase">
              <Radio className="h-3 w-3 animate-pulse" />
              AGENTS::PRODUCTION TEAM
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-[#ffb800]" style={{ textShadow: '0 0 20px rgba(255,184,0,0.2)' }}>Agent</span>{' '}
            <span className="text-[#bf5af2]" style={{ textShadow: '0 0 20px rgba(191,90,242,0.2)' }}>Production Team</span>
          </h1>
          <p className="text-xs font-mono text-muted mt-1 tracking-wider">▸ MULTI-AGENT CINEMA PRODUCTION SYSTEM</p>
        </div>
        <div className="text-right text-[10px] font-mono text-muted/50 tracking-wider">
          <p>{agents.length} AGENTS REGISTERED</p>
          <p className="text-[#39ff14]/40">{totalCapabilities} CAPABILITIES</p>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'AGENTS', sublabel: 'registered', value: agents.length, color: 'text-[#ffb800]', glowColor: 'rgba(255,184,0,0.08)', icon: Bot },
          { label: 'CAPABILITIES', sublabel: 'task types', value: totalCapabilities, color: 'text-[#00f0ff]', glowColor: 'rgba(0,240,255,0.08)', icon: Zap },
          { label: 'ORCHESTRATOR', sublabel: 'executive producer', value: '01', color: 'text-[#bf5af2]', glowColor: 'rgba(191,90,242,0.08)', icon: Crown },
          { label: 'SPECIALISTS', sublabel: 'production team', value: String(specialists.length).padStart(2, '0'), color: 'text-[#39ff14]', glowColor: 'rgba(57,255,20,0.08)', icon: Network },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="neon-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${stat.color} opacity-60`} />
                <span className="text-[9px] font-mono text-muted/40 tracking-widest">{stat.label}</span>
              </div>
              <p className={`text-3xl font-bold font-mono ${stat.color}`} style={{ textShadow: `0 0 20px ${stat.glowColor}` }}>
                {typeof stat.value === 'number' ? String(stat.value).padStart(2, '0') : stat.value}
              </p>
              <p className="text-[10px] font-mono text-muted/40 mt-0.5">{stat.sublabel}</p>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{ background: stat.glowColor }} />
            </div>
          );
        })}
      </div>

      {/* Hierarchy Visualization */}
      <div className="neon-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-[#ffb800]" />
            <h2 className="text-xs font-mono font-semibold tracking-wider text-[#ffb800]">HIERARCHY::AGENT FLOW</h2>
          </div>
          <span className="text-[10px] font-mono text-muted/40 tracking-wider">PRODUCTION PIPELINE</span>
        </div>
        <div className="p-4 space-y-4">
          {/* EP at top */}
          {orchestrator && (
            <div className="flex justify-center">
              <div className={`neon-card px-6 py-3 ${AGENT_COLORS['executive-producer'].border} relative`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Crown className={`h-5 w-5 ${AGENT_COLORS['executive-producer'].text}`} />
                    <div className={`absolute inset-0 h-5 w-5 ${AGENT_COLORS['executive-producer'].text} blur-sm opacity-50`}>
                      <Crown className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-bold font-mono tracking-wider ${AGENT_COLORS['executive-producer'].text}`}>
                      EXECUTIVE PRODUCER
                    </p>
                    <p className="text-[10px] font-mono text-muted/50">Master Coordinator — Routes all tasks</p>
                  </div>
                  <div className="ml-4 flex items-center gap-1.5">
                    <div className={`status-dot ${AGENT_COLORS['executive-producer'].dot}`} />
                    <span className="text-[9px] font-mono text-muted/40">READY</span>
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-px h-3 bg-gradient-to-b from-[#ffb800]/40 to-transparent" />
              </div>
            </div>
          )}

          {/* Connection line */}
          <div className="flex justify-center">
            <div className="w-px h-4 bg-gradient-to-b from-[#ffb800]/30 to-[#00f0ff]/20" />
          </div>

          {/* Specialists grid */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {specialists.map((agent) => {
              const colors = AGENT_COLORS[agent.role];
              const Icon = AGENT_ICONS[agent.role];
              return (
                <div key={agent.role} className={`neon-card p-3 ${colors.border} relative overflow-hidden`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-4 w-4 ${colors.text}`} />
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${colors.text}`}>
                      {agent.displayName.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-muted/50 mb-2 line-clamp-2 leading-relaxed">
                    {agent.description.split(' — ')[1] || agent.description}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className={`status-dot ${colors.dot}`} />
                    <span className="text-[9px] font-mono text-muted/40">READY</span>
                    <span className="text-[9px] font-mono text-muted/30 ml-auto">{agent.capabilities.length} tasks</span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-2xl" style={{ background: colors.glow }} />
                </div>
              );
            })}
          </div>

          {/* Handoff Flow */}
          <div className="mt-2 pt-3 border-t border-border/30">
            <p className="text-[9px] font-mono text-muted/30 tracking-widest mb-2">HANDOFF PROTOCOL</p>
            <div className="flex flex-wrap gap-2">
              {HANDOFF_FLOWS.map((flow, i) => {
                const fromColors = AGENT_COLORS[flow.from];
                const toColors = AGENT_COLORS[flow.to];
                return (
                  <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono text-muted/40">
                    <span className={fromColors.text}>{AGENT_DISPLAY_NAMES[flow.from].split(' ')[0]}</span>
                    <ArrowRight className="h-2.5 w-2.5 text-muted/20" />
                    <span className={toColors.text}>{AGENT_DISPLAY_NAMES[flow.to].split(' ')[0]}</span>
                    <span className="text-muted/20">({flow.label})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Detail Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#00f0ff]" />
          <h2 className="text-xs font-mono font-semibold tracking-wider text-[#00f0ff]">AGENT::CAPABILITIES</h2>
        </div>

        {agents.map((agent) => {
          const colors = AGENT_COLORS[agent.role];
          const Icon = AGENT_ICONS[agent.role];
          const isEP = agent.role === 'executive-producer';

          return (
            <div key={agent.role} className="neon-card overflow-hidden">
              {/* Agent Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b border-border/60 ${colors.bg}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                    <div className={`absolute inset-0 h-5 w-5 ${colors.text} blur-sm opacity-40`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold font-mono tracking-wider ${colors.text}`}>
                      {agent.displayName.toUpperCase()}
                    </h3>
                    <p className="text-[10px] font-mono text-muted/50">{agent.description.split(' — ')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-muted/40">{isEP ? 'ORCHESTRATOR' : 'SPECIALIST'}</p>
                    <p className={`text-[10px] font-mono font-bold ${colors.text}`}>{agent.capabilities.length} TASKS</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#39ff14]/20 bg-[#39ff14]/5">
                    <div className="status-dot bg-[#39ff14]" />
                    <span className="text-[9px] font-mono text-[#39ff14]/70">ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="p-4">
                <p className="text-[9px] font-mono text-muted/30 tracking-widest mb-3">REGISTERED CAPABILITIES</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {agent.capabilities.map((cap) => (
                    <div
                      key={cap}
                      className={`flex items-center gap-2 rounded-md border ${colors.border} px-3 py-2 transition-colors hover:${colors.bg}`}
                    >
                      <CheckCircle className={`h-3 w-3 ${colors.text} opacity-50 shrink-0`} />
                      <span className="text-[10px] font-mono text-muted/70 truncate">
                        {TASK_DISPLAY[cap] || cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* API Reference */}
      <div className="neon-card">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#39ff14]" />
            <h2 className="text-xs font-mono font-semibold tracking-wider text-[#39ff14]">API::ENDPOINTS</h2>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#39ff14] px-1.5 py-0.5 rounded bg-[#39ff14]/10 border border-[#39ff14]/20">POST</span>
                <span className="text-xs font-mono text-muted">/api/agents/invoke</span>
              </div>
              <p className="text-[10px] font-mono text-muted/40 mt-0.5">Direct agent invocation — route to specific specialist</p>
            </div>
            <span className="text-[9px] font-mono text-muted/30">taskType + goal</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#39ff14] px-1.5 py-0.5 rounded bg-[#39ff14]/10 border border-[#39ff14]/20">POST</span>
                <span className="text-xs font-mono text-muted">/api/agents/invoke</span>
              </div>
              <p className="text-[10px] font-mono text-muted/40 mt-0.5">EP-orchestrated multi-agent execution</p>
            </div>
            <span className="text-[9px] font-mono text-muted/30">orchestrate + goal</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#00f0ff] px-1.5 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20">GET</span>
                <span className="text-xs font-mono text-muted">/api/agents/directory</span>
              </div>
              <p className="text-[10px] font-mono text-muted/40 mt-0.5">Agent roster, capabilities, hierarchy</p>
            </div>
            <span className="text-[9px] font-mono text-muted/30">no params</span>
          </div>
        </div>
      </div>
    </div>
  );
}
