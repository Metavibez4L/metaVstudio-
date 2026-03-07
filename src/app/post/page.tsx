import { getEditVersions, getProductions, getDeliverables } from '@/lib/production-data';
import Link from 'next/link';
import { SlidersHorizontal, Music, Mic, Palette, Captions, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const EDIT_STATUS_STYLES: Record<string, string> = {
  in_progress: 'bg-[#00f0ff]/10 text-[#00f0ff]',
  in_review: 'bg-[#ffb800]/10 text-[#ffb800]',
  approved: 'bg-[#39ff14]/10 text-[#39ff14]',
  rejected: 'bg-[#ff3366]/10 text-[#ff3366]',
};

export default async function PostPage() {
  const productions = getProductions();
  const prodMap = Object.fromEntries(productions.map(p => [p.id, p.title]));

  const allVersions = productions.flatMap(p => getEditVersions(p.id));
  const allDeliverables = productions.flatMap(p => getDeliverables(p.id));
  const deliverableMap = Object.fromEntries(allDeliverables.map(d => [d.id, d.title]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Post-Production</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">EDIT VERSIONS &middot; COLOR &middot; AUDIO &middot; FINISHING</p>
        </div>
      </div>

      {allVersions.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
          <SlidersHorizontal className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-medium text-muted/40">No edit versions yet</p>
          <p className="text-xs text-muted/30 mt-1">Track edits from a production detail page</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allVersions.map(v => (
            <div key={v.id} className="neon-card p-4 space-y-3 hover:border-[#bf5af2]/20 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">v{v.versionNumber}</span>
                    {v.cutType && <span className="rounded bg-[#bf5af2]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#bf5af2]/70">{v.cutType}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Link href={`/productions/${v.productionId}`} className="text-[10px] font-mono text-[#00f0ff]/50 hover:text-[#00f0ff] tracking-wider transition-colors">
                      {prodMap[v.productionId] || 'Unknown'}
                    </Link>
                    {v.deliverableId && deliverableMap[v.deliverableId] && (
                      <span className="text-[10px] font-mono text-muted/30">/ {deliverableMap[v.deliverableId]}</span>
                    )}
                  </div>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-[9px] font-mono tracking-wider ${EDIT_STATUS_STYLES[v.status] || ''}`}>
                  {v.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              {/* Post notes grid */}
              <div className="grid gap-2 grid-cols-2 lg:grid-cols-3">
                {v.selectsNotes && (
                  <div className="rounded-lg bg-zinc-900/50 border border-border/20 p-2.5">
                    <p className="text-[9px] font-mono text-muted/30 tracking-wider mb-1">SELECTS</p>
                    <p className="text-xs text-muted/60 line-clamp-2">{v.selectsNotes}</p>
                  </div>
                )}
                {v.musicNotes && (
                  <div className="rounded-lg bg-zinc-900/50 border border-border/20 p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Music className="h-3 w-3 text-[#bf5af2]/40" />
                      <p className="text-[9px] font-mono text-muted/30 tracking-wider">MUSIC</p>
                    </div>
                    <p className="text-xs text-muted/60 line-clamp-2">{v.musicNotes}</p>
                  </div>
                )}
                {v.sfxNotes && (
                  <div className="rounded-lg bg-zinc-900/50 border border-border/20 p-2.5">
                    <p className="text-[9px] font-mono text-muted/30 tracking-wider mb-1">SFX</p>
                    <p className="text-xs text-muted/60 line-clamp-2">{v.sfxNotes}</p>
                  </div>
                )}
                {v.voNotes && (
                  <div className="rounded-lg bg-zinc-900/50 border border-border/20 p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Mic className="h-3 w-3 text-[#ffb800]/40" />
                      <p className="text-[9px] font-mono text-muted/30 tracking-wider">VO</p>
                    </div>
                    <p className="text-xs text-muted/60 line-clamp-2">{v.voNotes}</p>
                  </div>
                )}
                {v.colorNotes && (
                  <div className="rounded-lg bg-zinc-900/50 border border-border/20 p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Palette className="h-3 w-3 text-[#39ff14]/40" />
                      <p className="text-[9px] font-mono text-muted/30 tracking-wider">COLOR</p>
                    </div>
                    <p className="text-xs text-muted/60 line-clamp-2">{v.colorNotes}</p>
                  </div>
                )}
                {v.captionNotes && (
                  <div className="rounded-lg bg-zinc-900/50 border border-border/20 p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <Captions className="h-3 w-3 text-[#00f0ff]/40" />
                      <p className="text-[9px] font-mono text-muted/30 tracking-wider">CAPTIONS</p>
                    </div>
                    <p className="text-xs text-muted/60 line-clamp-2">{v.captionNotes}</p>
                  </div>
                )}
              </div>

              {v.notes && (
                <div className="border-t border-border/20 pt-2 mt-2">
                  <p className="text-xs text-muted/50">{v.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
