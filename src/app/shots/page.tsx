import { getShots, getScenes, getProductions } from '@/lib/production-data';
import Link from 'next/link';
import { Crosshair, Film, Camera } from 'lucide-react';
import { SHOT_TYPE_LABELS, CAMERA_MOVEMENT_LABELS } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ShotsPage() {
  const productions = getProductions();
  const prodMap = Object.fromEntries(productions.map(p => [p.id, p.title]));

  // Get all scenes and shots across all productions
  const allScenes = productions.flatMap(p => getScenes(p.id));
  const sceneMap = Object.fromEntries(allScenes.map(s => [s.id, s]));
  const allShots = getShots();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Shot Design</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">CINEMATIC PLANNING &middot; SHOT LIST &middot; COVERAGE</p>
        </div>
      </div>

      {/* Scenes overview */}
      {allScenes.length > 0 && (
        <div>
          <p className="text-[9px] font-mono text-muted/40 tracking-[0.2em] mb-3">SCENES ({allScenes.length})</p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {allScenes.map(scene => {
              const sceneShotCount = allShots.filter(s => s.sceneId === scene.id).length;
              return (
                <div key={scene.id} className="neon-card p-3 space-y-1.5 hover:border-[#bf5af2]/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Film className="h-3.5 w-3.5 text-[#bf5af2]/60" />
                      <span className="text-[10px] font-mono font-semibold text-[#bf5af2]/80">SC {String(scene.sceneNumber).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[9px] font-mono text-muted/30">{sceneShotCount} shots</span>
                  </div>
                  <p className="text-sm font-medium">{scene.title}</p>
                  {scene.location && <p className="text-[10px] font-mono text-muted/40">{scene.location} {scene.timeOfDay ? `— ${scene.timeOfDay}` : ''}</p>}
                  {scene.description && <p className="text-xs text-muted/50 line-clamp-2">{scene.description}</p>}
                  <Link href={`/productions/${scene.productionId}`} className="text-[9px] font-mono text-[#00f0ff]/40 hover:text-[#00f0ff] tracking-wider transition-colors">
                    {prodMap[scene.productionId] || 'Unknown'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shots list */}
      <div>
        <p className="text-[9px] font-mono text-muted/40 tracking-[0.2em] mb-3">ALL SHOTS ({allShots.length})</p>
        {allShots.length === 0 ? (
          <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
            <Crosshair className="h-10 w-10 text-muted/20 mb-3" />
            <p className="text-sm font-medium text-muted/40">No shots planned yet</p>
            <p className="text-xs text-muted/30 mt-1">Add scenes and shots from a production detail page</p>
          </div>
        ) : (
          <div className="neon-card divide-y divide-border/30">
            {allShots.map(shot => {
              const scene = sceneMap[shot.sceneId];
              return (
                <div key={shot.id} className="px-4 py-3 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-shrink-0 flex items-center gap-2 w-28">
                    <Camera className="h-3.5 w-3.5 text-[#39ff14]/60" />
                    <div>
                      <p className="text-[10px] font-mono font-semibold text-[#39ff14]/80">SHOT {String(shot.shotNumber).padStart(3, '0')}</p>
                      {scene && <p className="text-[9px] font-mono text-muted/30">SC {String(scene.sceneNumber).padStart(2, '0')}</p>}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-[#00f0ff]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#00f0ff]/70">{SHOT_TYPE_LABELS[shot.shotType]}</span>
                      <span className="rounded bg-[#bf5af2]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#bf5af2]/70">{CAMERA_MOVEMENT_LABELS[shot.movement]}</span>
                      {shot.lens && <span className="text-[9px] font-mono text-muted/30">{shot.lens}</span>}
                    </div>
                    {shot.subjectAction && <p className="text-xs text-muted/60 line-clamp-1">{shot.subjectAction}</p>}
                    {shot.purpose && <p className="text-[10px] text-muted/40 mt-0.5 line-clamp-1">{shot.purpose}</p>}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {shot.lightingMood && <p className="text-[9px] font-mono text-[#ffb800]/50">{shot.lightingMood}</p>}
                    <Link href={`/productions/${shot.productionId}`} className="text-[9px] font-mono text-muted/30 hover:text-[#00f0ff] transition-colors">
                      {prodMap[shot.productionId] || 'Unknown'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
