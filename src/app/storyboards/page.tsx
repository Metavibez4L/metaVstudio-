import { getFrames, getProductions, getScenes } from '@/lib/production-data';
import Link from 'next/link';
import { FrameIcon, Image } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StoryboardsPage() {
  const productions = getProductions();
  const prodMap = Object.fromEntries(productions.map(p => [p.id, p.title]));

  const allFrames = productions.flatMap(p => getFrames(p.id));
  const allScenes = productions.flatMap(p => getScenes(p.id));
  const sceneMap = Object.fromEntries(allScenes.map(s => [s.id, s]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Storyboard</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">VISUAL PLANNING &middot; FRAME DESIGN &middot; SEQUENCE</p>
        </div>
      </div>

      {allFrames.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
          <FrameIcon className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-medium text-muted/40">No storyboard frames yet</p>
          <p className="text-xs text-muted/30 mt-1">Create frames from a production detail page</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allFrames.map(frame => {
            const scene = frame.sceneId ? sceneMap[frame.sceneId] : null;
            return (
              <div key={frame.id} className="neon-card overflow-hidden hover:border-[#bf5af2]/20 transition-colors">
                {/* Frame visual area */}
                <div className="aspect-video bg-zinc-900/80 border-b border-border/30 flex items-center justify-center relative">
                  {frame.imageRef ? (
                    <Image className="h-6 w-6 text-muted/20" />
                  ) : (
                    <div className="text-center px-3">
                      <p className="text-[9px] font-mono text-muted/20 tracking-wider mb-1">FRAME {String(frame.frameNumber).padStart(3, '0')}</p>
                      {frame.imagePrompt && <p className="text-[10px] text-muted/30 line-clamp-3">{frame.imagePrompt}</p>}
                    </div>
                  )}
                  {scene && (
                    <span className="absolute top-2 left-2 rounded bg-[#bf5af2]/20 px-1.5 py-0.5 text-[8px] font-mono text-[#bf5af2]/80">
                      SC {String(scene.sceneNumber).padStart(2, '0')}
                    </span>
                  )}
                </div>
                {/* Frame details */}
                <div className="p-3 space-y-1.5">
                  <p className="text-[10px] font-mono font-semibold text-[#bf5af2]/70">FRAME {String(frame.frameNumber).padStart(3, '0')}</p>
                  {frame.description && <p className="text-xs text-muted/60 line-clamp-2">{frame.description}</p>}
                  {frame.cameraNote && (
                    <p className="text-[10px] font-mono text-[#00f0ff]/50">CAM: {frame.cameraNote}</p>
                  )}
                  {frame.dialogue && (
                    <p className="text-[10px] text-[#ffb800]/50 italic line-clamp-1">&quot;{frame.dialogue}&quot;</p>
                  )}
                  <Link href={`/productions/${frame.productionId}`} className="block text-[9px] font-mono text-muted/30 hover:text-[#00f0ff] tracking-wider transition-colors">
                    {prodMap[frame.productionId] || 'Unknown'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
