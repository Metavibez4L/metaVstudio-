import Link from 'next/link';
import { Film, Plus, Clock, Radio } from 'lucide-react';
import { getProductions } from '@/lib/production-data';
import { PRODUCTION_STATUS_LABELS, PRODUCTION_STATUS_COLORS, PRODUCTION_TYPE_LABELS } from '@/lib/types';
import type { ProductionStatus } from '@/lib/types';
import ProductionCreateButton from '@/components/ProductionCreateButton';

export const dynamic = 'force-dynamic';

export default function ProductionsPage({ searchParams }: { searchParams: Promise<{ status?: string; new?: string }> }) {
  return <ProductionsContent searchParams={searchParams} />;
}

async function ProductionsContent({ searchParams }: { searchParams: Promise<{ status?: string; new?: string }> }) {
  const params = await searchParams;
  const status = params.status;
  const showNew = params.new === '1';
  const productions = getProductions(status);

  const statuses: ProductionStatus[] = ['concept', 'briefing', 'pre_production', 'scheduled', 'in_production', 'ingested', 'editing', 'review', 'revision', 'final_delivery', 'published'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#bf5af2]/50 tracking-[0.3em] uppercase mb-1">
            <Radio className="h-3 w-3 animate-pulse" />
            PRODUCTION::REGISTRY
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-glow-magenta">
            <span className="text-[#bf5af2]">Productions</span>
          </h1>
          <p className="text-xs font-mono text-muted mt-1 tracking-wider">▸ ALL MEDIA PRODUCTION PROJECTS</p>
        </div>
        <ProductionCreateButton autoOpen={showNew} />
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <Link href="/productions" className={`rounded-lg border px-3 py-1.5 text-[10px] font-mono tracking-wider transition-all ${!status || status === 'all' ? 'border-[#00f0ff]/30 bg-[#00f0ff]/8 text-[#00f0ff]' : 'border-border text-muted hover:border-border-bright hover:text-foreground'}`}>
          ALL
        </Link>
        {statuses.map(s => (
          <Link key={s} href={`/productions?status=${s}`} className={`rounded-lg border px-3 py-1.5 text-[10px] font-mono tracking-wider transition-all ${status === s ? 'border-[#00f0ff]/30 bg-[#00f0ff]/8 text-[#00f0ff]' : 'border-border text-muted hover:border-border-bright hover:text-foreground'}`}>
            {PRODUCTION_STATUS_LABELS[s].toUpperCase()}
          </Link>
        ))}
      </div>

      {/* Productions Grid */}
      {productions.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16">
          <Film className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-mono text-muted/40">NO PRODUCTIONS FOUND</p>
          <Link href="/productions?new=1" className="mt-4 flex items-center gap-2 text-xs font-mono text-[#00f0ff] hover:text-[#00f0ff]/80 tracking-wider">
            <Plus className="h-3.5 w-3.5" /> INITIALIZE FIRST PRODUCTION
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productions.map(prod => (
            <Link key={prod.id} href={`/productions/${prod.id}`} className="group neon-card p-5 transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,240,255,0.06)] hover:border-[#00f0ff]/20">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold truncate group-hover:text-[#00f0ff] transition-colors">{prod.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-muted/50 tracking-wider">{PRODUCTION_TYPE_LABELS[prod.type].toUpperCase()}</span>
                    {prod.client && <span className="text-[10px] font-mono text-[#bf5af2]/50">• {prod.client}</span>}
                  </div>
                </div>
                <span className={`ml-3 shrink-0 rounded-md px-2.5 py-1 text-[10px] font-mono font-medium tracking-wider ${PRODUCTION_STATUS_COLORS[prod.status]}`}>
                  {PRODUCTION_STATUS_LABELS[prod.status].toUpperCase()}
                </span>
              </div>
              {prod.description && (
                <p className="text-xs text-muted/60 line-clamp-2 mb-3">{prod.description}</p>
              )}
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted/40">
                {prod.dueDate && (
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{prod.dueDate}</span>
                )}
                {prod.targetPlatform && (
                  <span className="text-[#00f0ff]/40">{prod.targetPlatform.toUpperCase()}</span>
                )}
                {prod.budget && (
                  <span className="text-[#39ff14]/40">{prod.budget}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
