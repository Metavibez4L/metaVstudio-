import { getBriefs, getProductions } from '@/lib/production-data';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  const briefs = getBriefs();
  const productions = getProductions();
  const prodMap = Object.fromEntries(productions.map(p => [p.id, p.title]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Creative Briefs</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">STRATEGY &middot; MESSAGING &middot; CREATIVE DIRECTION</p>
        </div>
      </div>

      {briefs.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-medium text-muted/40">No creative briefs yet</p>
          <p className="text-xs text-muted/30 mt-1">Create one from a production detail page</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {briefs.map((b) => (
            <div key={b.id} className="neon-card p-4 space-y-3 hover:border-[#00f0ff]/20 transition-colors">
              <div>
                <h3 className="text-sm font-semibold">{b.title}</h3>
                {prodMap[b.productionId] && (
                  <Link href={`/productions/${b.productionId}`} className="text-[10px] font-mono text-[#bf5af2]/60 hover:text-[#bf5af2] tracking-wider transition-colors">
                    {prodMap[b.productionId]}
                  </Link>
                )}
              </div>
              {b.objective && (
                <div>
                  <p className="text-[9px] font-mono text-muted/30 tracking-wider">OBJECTIVE</p>
                  <p className="text-xs text-muted/60 line-clamp-2">{b.objective}</p>
                </div>
              )}
              {b.targetAudience && (
                <div>
                  <p className="text-[9px] font-mono text-muted/30 tracking-wider">AUDIENCE</p>
                  <p className="text-xs text-muted/60 line-clamp-1">{b.targetAudience}</p>
                </div>
              )}
              {b.keyMessage && (
                <div>
                  <p className="text-[9px] font-mono text-muted/30 tracking-wider">KEY MESSAGE</p>
                  <p className="text-xs text-muted/60 line-clamp-2">{b.keyMessage}</p>
                </div>
              )}
              {b.tone && <span className="inline-block rounded-md bg-[#00f0ff]/5 px-2 py-0.5 text-[10px] font-mono text-[#00f0ff]/60">{b.tone}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
