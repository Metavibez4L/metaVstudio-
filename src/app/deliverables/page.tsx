import { getDeliverables, getProductions } from '@/lib/production-data';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { DELIVERABLE_TYPE_LABELS, PLATFORM_LABELS } from '@/lib/types';
import type { DeliverableStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<DeliverableStatus, string> = {
  planned: 'bg-zinc-500/10 text-zinc-400',
  in_progress: 'bg-[#00f0ff]/10 text-[#00f0ff]',
  in_review: 'bg-[#ffb800]/10 text-[#ffb800]',
  approved: 'bg-emerald-500/10 text-emerald-300',
  delivered: 'bg-[#39ff14]/10 text-[#39ff14]',
};

export default async function DeliverablesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status: filterStatus } = await searchParams;
  const productions = getProductions();
  const prodMap = Object.fromEntries(productions.map(p => [p.id, p.title]));
  const allDeliverables = productions.flatMap(p => getDeliverables(p.id));

  const filtered = filterStatus && filterStatus !== 'all'
    ? allDeliverables.filter(d => d.status === filterStatus)
    : allDeliverables;

  const statuses: DeliverableStatus[] = ['planned', 'in_progress', 'in_review', 'approved', 'delivered'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Deliverables</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">FORMATS &middot; OUTPUTS &middot; DELIVERY MATRIX</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-1.5 flex-wrap">
        <Link href="/deliverables" className={`rounded-md px-3 py-1.5 text-[10px] font-mono tracking-wider border transition-all ${!filterStatus || filterStatus === 'all' ? 'border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]' : 'border-border/30 text-muted/40 hover:text-muted'}`}>
          ALL ({allDeliverables.length})
        </Link>
        {statuses.map(s => {
          const count = allDeliverables.filter(d => d.status === s).length;
          return (
            <Link key={s} href={`/deliverables?status=${s}`} className={`rounded-md px-3 py-1.5 text-[10px] font-mono tracking-wider border transition-all ${filterStatus === s ? STATUS_STYLES[s] + ' border-current/20' : 'border-border/30 text-muted/40 hover:text-muted'}`}>
              {s.toUpperCase().replace('_', ' ')} ({count})
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-medium text-muted/40">No deliverables found</p>
          <p className="text-xs text-muted/30 mt-1">Create deliverables from a production detail page</p>
        </div>
      ) : (
        <div className="neon-card divide-y divide-border/30">
          {filtered.map(d => (
            <div key={d.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <Package className="h-4 w-4 text-[#ffb800]/50 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-muted/40">{DELIVERABLE_TYPE_LABELS[d.type]}</span>
                    {d.platform && <span className="text-[10px] font-mono text-[#bf5af2]/50">{PLATFORM_LABELS[d.platform]}</span>}
                    {d.format && <span className="text-[10px] font-mono text-muted/30">{d.format}</span>}
                    {d.duration && <span className="text-[10px] font-mono text-[#00f0ff]/40">{d.duration}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/productions/${d.productionId}`} className="text-[9px] font-mono text-muted/30 hover:text-[#00f0ff] tracking-wider transition-colors">
                  {prodMap[d.productionId] || 'Unknown'}
                </Link>
                <span className={`rounded-md px-2 py-0.5 text-[9px] font-mono tracking-wider ${STATUS_STYLES[d.status]}`}>
                  {d.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
