import { getCampaigns, getProductions } from '@/lib/production-data';
import Link from 'next/link';
import { Megaphone } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CAMPAIGN_STATUS_STYLES: Record<string, string> = {
  draft: 'bg-zinc-500/10 text-zinc-400',
  active: 'bg-[#39ff14]/10 text-[#39ff14]',
  paused: 'bg-[#ffb800]/10 text-[#ffb800]',
  completed: 'bg-emerald-500/10 text-emerald-300',
};

export default async function CampaignsPage() {
  const productions = getProductions();
  const prodMap = Object.fromEntries(productions.map(p => [p.id, p.title]));
  const allCampaigns = productions.flatMap(p => getCampaigns(p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">AD STRATEGY &middot; MESSAGING &middot; DISTRIBUTION</p>
        </div>
      </div>

      {allCampaigns.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
          <Megaphone className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-medium text-muted/40">No campaigns yet</p>
          <p className="text-xs text-muted/30 mt-1">Create campaigns from a production detail page</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {allCampaigns.map(c => (
            <div key={c.id} className="neon-card p-4 space-y-3 hover:border-[#ff3366]/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{c.name}</h3>
                  <Link href={`/productions/${c.productionId}`} className="text-[10px] font-mono text-[#bf5af2]/60 hover:text-[#bf5af2] tracking-wider transition-colors">
                    {prodMap[c.productionId] || 'Unknown'}
                  </Link>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[9px] font-mono tracking-wider ${CAMPAIGN_STATUS_STYLES[c.status] || ''}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              {c.objective && (
                <div>
                  <p className="text-[9px] font-mono text-muted/30 tracking-wider">OBJECTIVE</p>
                  <p className="text-xs text-muted/60 line-clamp-2">{c.objective}</p>
                </div>
              )}
              {c.channels && (
                <div>
                  <p className="text-[9px] font-mono text-muted/30 tracking-wider">CHANNELS</p>
                  <p className="text-xs text-muted/60">{c.channels}</p>
                </div>
              )}
              {c.hooks && (
                <div>
                  <p className="text-[9px] font-mono text-muted/30 tracking-wider">HOOKS</p>
                  <p className="text-xs text-muted/50 line-clamp-2">{c.hooks}</p>
                </div>
              )}
              {c.targetAudience && (
                <span className="inline-block rounded-md bg-[#ff3366]/5 px-2 py-0.5 text-[10px] font-mono text-[#ff3366]/50">{c.targetAudience}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
