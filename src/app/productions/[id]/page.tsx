import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProduction, getDeliverables, getScenes, getShots, getBriefs, getCampaigns, getEditVersions, getProductionNotes } from '@/lib/production-data';
import { PRODUCTION_STATUS_LABELS, PRODUCTION_STATUS_COLORS, PRODUCTION_TYPE_LABELS, DELIVERABLE_TYPE_LABELS } from '@/lib/types';
import type { ProductionStatus } from '@/lib/types';
import ProductionEditor from '@/components/ProductionEditor';
import { Film, FileText, Crosshair, Package, Megaphone, SlidersHorizontal, Clock, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const production = getProduction(id);
  if (!production) return notFound();

  const deliverables = getDeliverables(id);
  const scenes = getScenes(id);
  const shots = getShots(undefined, id);
  const briefs = getBriefs(id);
  const campaigns = getCampaigns(id);
  const editVersions = getEditVersions(id);
  const notes = getProductionNotes(id);

  const pipeline: ProductionStatus[] = ['concept', 'briefing', 'pre_production', 'scheduled', 'in_production', 'ingested', 'editing', 'review', 'revision', 'final_delivery', 'published'];
  const currentIndex = pipeline.indexOf(production.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/productions" className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted/50 hover:text-[#00f0ff] tracking-wider mb-3 transition-colors">
          <ArrowLeft className="h-3 w-3" /> BACK TO PRODUCTIONS
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{production.title}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-mono text-muted/50 tracking-wider">{PRODUCTION_TYPE_LABELS[production.type].toUpperCase()}</span>
              {production.client && <span className="text-[10px] font-mono text-[#bf5af2]/60">CLIENT: {production.client}</span>}
              {production.budget && <span className="text-[10px] font-mono text-[#39ff14]/40">BUDGET: {production.budget}</span>}
              {production.dueDate && <span className="flex items-center gap-1 text-[10px] font-mono text-muted/40"><Clock className="h-3 w-3" />{production.dueDate}</span>}
            </div>
          </div>
          <span className={`rounded-md px-3 py-1.5 text-[10px] font-mono font-semibold tracking-wider ${PRODUCTION_STATUS_COLORS[production.status]}`}>
            {PRODUCTION_STATUS_LABELS[production.status].toUpperCase()}
          </span>
        </div>
      </div>

      {/* Production Pipeline */}
      <div className="neon-card p-4">
        <p className="text-[9px] font-mono text-muted/40 tracking-[0.2em] mb-3">PRODUCTION PIPELINE</p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {pipeline.map((s, i) => {
            const isActive = s === production.status;
            const isPast = i < currentIndex;
            return (
              <div key={s} className={`flex-1 min-w-[80px] text-center rounded-lg border px-2 py-2 text-[9px] font-mono tracking-wider transition-all ${
                isActive ? `${PRODUCTION_STATUS_COLORS[s]} border-current/20` :
                isPast ? 'border-[#39ff14]/10 bg-[#39ff14]/5 text-[#39ff14]/40' :
                'border-border/30 text-muted/30'
              }`}>
                {PRODUCTION_STATUS_LABELS[s].toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor + Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductionEditor production={production} />
        </div>
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="neon-card p-4 space-y-3">
            <p className="text-[9px] font-mono text-muted/40 tracking-[0.2em]">PRODUCTION STATS</p>
            {[
              { label: 'BRIEFS', count: briefs.length, icon: FileText, color: 'text-[#00f0ff]', href: `/briefs` },
              { label: 'SCENES', count: scenes.length, icon: Film, color: 'text-[#bf5af2]', href: `/shots` },
              { label: 'SHOTS', count: shots.length, icon: Crosshair, color: 'text-[#39ff14]', href: `/shots` },
              { label: 'DELIVERABLES', count: deliverables.length, icon: Package, color: 'text-[#ffb800]', href: `/deliverables` },
              { label: 'CAMPAIGNS', count: campaigns.length, icon: Megaphone, color: 'text-[#ff3366]', href: `/campaigns` },
              { label: 'EDIT VERSIONS', count: editVersions.length, icon: SlidersHorizontal, color: 'text-[#bf5af2]', href: `/post` },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href} className="flex items-center justify-between py-1.5 hover:bg-white/[0.02] rounded px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${stat.color} opacity-60`} />
                    <span className="text-[10px] font-mono text-muted/60 tracking-wider">{stat.label}</span>
                  </div>
                  <span className={`text-sm font-mono font-bold ${stat.color}`}>{String(stat.count).padStart(2, '0')}</span>
                </Link>
              );
            })}
          </div>

          {/* Deliverables Preview */}
          {deliverables.length > 0 && (
            <div className="neon-card">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-[10px] font-mono font-semibold tracking-wider text-[#ffb800]">DELIVERABLES</p>
              </div>
              <div className="divide-y divide-border/30">
                {deliverables.slice(0, 5).map(d => (
                  <div key={d.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">{d.title}</p>
                      <p className="text-[10px] font-mono text-muted/40">{DELIVERABLE_TYPE_LABELS[d.type]}</p>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-[9px] font-mono tracking-wider ${
                      d.status === 'delivered' ? 'bg-[#39ff14]/10 text-[#39ff14]' :
                      d.status === 'approved' ? 'bg-emerald-500/10 text-emerald-300' :
                      d.status === 'in_review' ? 'bg-[#ffb800]/10 text-[#ffb800]' :
                      d.status === 'in_progress' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' :
                      'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {d.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {notes.length > 0 && (
            <div className="neon-card">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-[10px] font-mono font-semibold tracking-wider text-[#00f0ff]">RECENT NOTES</p>
              </div>
              <div className="divide-y divide-border/30">
                {notes.slice(0, 4).map(n => (
                  <div key={n.id} className="px-4 py-2.5">
                    <p className="text-[9px] font-mono text-muted/40 tracking-wider mb-0.5">{n.category.toUpperCase()}</p>
                    <p className="text-xs text-muted/70 line-clamp-2">{n.content}</p>
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
