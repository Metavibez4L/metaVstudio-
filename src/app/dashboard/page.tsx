import { getProjects, getProjectCounts, getRecentAssets } from '@/lib/data';
import { getProductions, getProductionCounts } from '@/lib/production-data';
import Link from 'next/link';
import {
  Film,
  FolderKanban,
  Plus,
  Sparkles,
  Send,
  Clock,
  FileText,
  Activity,
  Zap,
  Radio,
  Crosshair,
  Package,
  Megaphone,
  SlidersHorizontal,
} from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS, PROJECT_TYPE_LABELS, PRODUCTION_STATUS_LABELS, PRODUCTION_STATUS_COLORS, PRODUCTION_TYPE_LABELS } from '@/lib/types';
import type { ProjectStatus, ProductionStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const counts = getProjectCounts();
  const prodCounts = getProductionCounts();
  const activeProjects = getProjects().filter((p) => p.status !== 'archived' && p.status !== 'published').slice(0, 3);
  const activeProductions = getProductions().filter((p) => p.status !== 'archived' && p.status !== 'published').slice(0, 5);
  const recentAssets = getRecentAssets(5);

  const totalProductions = Object.values(prodCounts).reduce((a, b) => a + b, 0);
  const inProductionCount = (prodCounts['in_production'] || 0) + (prodCounts['editing'] || 0) + (prodCounts['review'] || 0);
  const deliveredCount = (prodCounts['final_delivery'] || 0) + (prodCounts['published'] || 0);

  const quickActions = [
    { href: '/productions', label: 'NEW PRODUCTION', icon: Film, glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]', color: 'text-[#00f0ff]', border: 'hover:border-[#00f0ff]/30' },
    { href: '/assistant', label: 'AI DIRECTOR', icon: Sparkles, glow: 'hover:shadow-[0_0_20px_rgba(191,90,242,0.15)]', color: 'text-[#bf5af2]', border: 'hover:border-[#bf5af2]/30' },
    { href: '/shots', label: 'SHOT DESIGN', icon: Crosshair, glow: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]', color: 'text-[#39ff14]', border: 'hover:border-[#39ff14]/30' },
    { href: '/deliverables', label: 'DELIVERABLES', icon: Package, glow: 'hover:shadow-[0_0_20px_rgba(255,184,0,0.15)]', color: 'text-[#ffb800]', border: 'hover:border-[#ffb800]/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#00f0ff]/50 tracking-[0.3em] uppercase">
              <Radio className="h-3 w-3 animate-pulse" />
              PRODUCTION::ACTIVE
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-glow-cyan">
            Production <span className="text-[#bf5af2] text-glow-magenta">Command</span>
          </h1>
          <p className="text-xs font-mono text-muted mt-1 tracking-wider">▸ CINEMA &amp; MEDIA PRODUCTION OS</p>
        </div>
        <div className="text-right text-[10px] font-mono text-muted/50 tracking-wider">
          <p>LOCAL::M4-AIR</p>
          <p className="text-[#39ff14]/40">OLLAMA::CONNECTED</p>
        </div>
      </div>

      {/* Production Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'PRODUCTIONS', sublabel: 'total', value: totalProductions, color: 'text-[#00f0ff]', glowColor: 'rgba(0,240,255,0.08)', icon: Film },
          { label: 'IN PROGRESS', sublabel: 'active pipeline', value: inProductionCount, color: 'text-[#ff3366]', glowColor: 'rgba(255,51,102,0.08)', icon: Activity },
          { label: 'DELIVERED', sublabel: 'completed', value: deliveredCount, color: 'text-[#39ff14]', glowColor: 'rgba(57,255,20,0.08)', icon: Zap },
          { label: 'LEGACY', sublabel: 'projects', value: counts.total || 0, color: 'text-[#bf5af2]', glowColor: 'rgba(191,90,242,0.08)', icon: FolderKanban },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="neon-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${stat.color} opacity-60`} />
                <span className="text-[9px] font-mono text-muted/40 tracking-widest">{stat.label}</span>
              </div>
              <p className={`text-3xl font-bold font-mono ${stat.color}`} style={{ textShadow: `0 0 20px ${stat.glowColor}` }}>
                {String(stat.value).padStart(2, '0')}
              </p>
              <p className="text-[10px] font-mono text-muted/40 mt-0.5">{stat.sublabel}</p>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{ background: stat.glowColor }} />
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group neon-card flex items-center gap-3 p-4 transition-all duration-300 ${action.glow} ${action.border}`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${action.color} transition-transform group-hover:scale-110`} />
              </div>
              <span className="text-xs font-mono font-medium tracking-wider text-muted group-hover:text-foreground">{action.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Productions */}
        <div className="neon-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-[#00f0ff]" />
              <h2 className="text-xs font-mono font-semibold tracking-wider text-[#00f0ff]">ACTIVE::PRODUCTIONS</h2>
            </div>
            <Link href="/productions" className="text-[10px] font-mono text-[#00f0ff]/60 hover:text-[#00f0ff] tracking-wider transition-colors">VIEW ALL →</Link>
          </div>
          <div className="divide-y divide-border/30">
            {activeProductions.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-border/30 mb-3">
                  <Film className="h-5 w-5 text-muted/30" />
                </div>
                <p className="text-xs font-mono text-muted/50">NO ACTIVE PRODUCTIONS</p>
                <Link href="/productions" className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-[#00f0ff] hover:text-[#00f0ff] tracking-wider">
                  <Plus className="h-3 w-3" /> START NEW PRODUCTION
                </Link>
              </div>
            ) : (
              activeProductions.map((prod) => (
                <Link key={prod.id} href={`/productions/${prod.id}`} className="group flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-[#00f0ff] transition-colors">{prod.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-muted/40 tracking-wider">{PRODUCTION_TYPE_LABELS[prod.type].toUpperCase()}</span>
                      {prod.client && <span className="text-[10px] font-mono text-[#bf5af2]/40">{prod.client}</span>}
                    </div>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider ${PRODUCTION_STATUS_COLORS[prod.status]}`}>
                    {PRODUCTION_STATUS_LABELS[prod.status].toUpperCase()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column: Legacy Projects + Assets */}
        <div className="space-y-6">
          {/* Legacy Projects (compact) */}
          <div className="neon-card">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-[#bf5af2]" />
                <h2 className="text-xs font-mono font-semibold tracking-wider text-[#bf5af2]">LEGACY::PROJECTS</h2>
              </div>
              <Link href="/projects" className="text-[10px] font-mono text-[#00f0ff]/60 hover:text-[#00f0ff] tracking-wider transition-colors">VIEW ALL →</Link>
            </div>
            <div className="divide-y divide-border/30">
              {activeProjects.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs font-mono text-muted/50">NO ACTIVE PROJECTS</p>
                </div>
              ) : (
                activeProjects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="group flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-[#00f0ff] transition-colors">{project.title}</p>
                    </div>
                    <span className={`ml-3 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider ${STATUS_COLORS[project.status as ProjectStatus]}`}>
                      {STATUS_LABELS[project.status as ProjectStatus].toUpperCase()}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Assets */}
          <div className="neon-card">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#ffb800]" />
                <h2 className="text-xs font-mono font-semibold tracking-wider text-[#ffb800]">RECENT::ASSETS</h2>
              </div>
              <Link href="/assets" className="text-[10px] font-mono text-[#00f0ff]/60 hover:text-[#00f0ff] tracking-wider transition-colors">VIEW ALL →</Link>
            </div>
            <div className="divide-y divide-border/30">
              {recentAssets.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs font-mono text-muted/50">NO ASSETS LOGGED</p>
                </div>
              ) : (
                recentAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-[10px] font-mono text-muted/40 mt-0.5 tracking-wider">{asset.projectTitle.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted/40">
                      <Clock className="h-3 w-3" />
                      {asset.type.toUpperCase()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Production Pipeline Overview */}
      <div className="neon-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-[#00f0ff]" />
          <h2 className="text-xs font-mono font-semibold tracking-wider text-[#00f0ff]">PRODUCTION::PIPELINE</h2>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {(['concept', 'briefing', 'pre_production', 'scheduled', 'in_production', 'ingested', 'editing', 'review', 'revision', 'final_delivery', 'published'] as ProductionStatus[]).map((status) => {
            const count = prodCounts[status] || 0;
            return (
              <Link
                key={status}
                href={`/productions?status=${status}`}
                className={`group flex min-w-[90px] flex-col items-center rounded-xl border border-border/40 bg-background/50 p-3 transition-all duration-200 hover:bg-white/[0.02] ${count > 0 ? 'hover:border-current/20' : ''}`}
              >
                <span className={`text-xl font-bold font-mono ${count > 0 ? PRODUCTION_STATUS_COLORS[status].split(' ')[1] : 'text-muted/20'}`}>
                  {String(count).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-mono text-muted/50 mt-1 tracking-wider group-hover:text-muted transition-colors text-center leading-tight">
                  {PRODUCTION_STATUS_LABELS[status].toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-3 h-0.5 w-full rounded-full bg-border/20 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: totalProductions ? `${(deliveredCount / totalProductions) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #00f0ff, #bf5af2, #39ff14)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] font-mono text-muted/30 tracking-wider">
          <span>CONCEPT</span>
          <span>▸ PRODUCTION PIPELINE ▸</span>
          <span>DELIVERED</span>
        </div>
      </div>
    </div>
  );
}
