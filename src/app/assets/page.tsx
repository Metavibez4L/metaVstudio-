import { getRecentAssets } from '@/lib/data';
import Link from 'next/link';
import { FolderOpen, File, Film, Music, Image, FileText } from 'lucide-react';
import type { AssetType } from '@/lib/types';

export const dynamic = 'force-dynamic';

const ASSET_ICONS: Partial<Record<AssetType, typeof File>> = {
  raw_footage: Film,
  raw_capture: Film,
  export: Film,
  cut_version: Film,
  audio: Music,
  music: Music,
  thumbnail: Image,
  poster: Image,
  moodboard: Image,
  shot_reference: Image,
  storyboard_ref: Image,
  campaign_asset: Image,
  script: FileText,
  treatment_doc: FileText,
  caption: FileText,
  subtitle: FileText,
};

export default async function AssetsPage() {
  const assets = getRecentAssets(100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Asset Library</h1>
          <p className="text-[10px] font-mono text-muted/40 tracking-wider mt-0.5">FILES &middot; MEDIA &middot; REFERENCES &middot; DOCUMENTS</p>
        </div>
        <span className="text-[10px] font-mono text-muted/30">{assets.length} ASSETS</span>
      </div>

      {assets.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-10 w-10 text-muted/20 mb-3" />
          <p className="text-sm font-medium text-muted/40">No assets yet</p>
          <p className="text-xs text-muted/30 mt-1">Upload assets from a project detail page</p>
        </div>
      ) : (
        <div className="neon-card divide-y divide-border/30">
          {assets.map(asset => {
            const Icon = ASSET_ICONS[asset.type] || File;
            const typeColor = asset.type.includes('footage') || asset.type === 'raw_capture' || asset.type.includes('export') || asset.type === 'cut_version'
              ? 'text-[#ff3366]/50' : asset.type.includes('audio') || asset.type === 'music'
              ? 'text-[#bf5af2]/50' : asset.type.includes('thumbnail') || asset.type.includes('poster') || asset.type.includes('image') || asset.type.includes('moodboard') || asset.type.includes('reference') || asset.type.includes('storyboard') || asset.type.includes('campaign')
              ? 'text-[#ffb800]/50' : 'text-[#00f0ff]/50';

            return (
              <div key={asset.id} className="px-4 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <Icon className={`h-4 w-4 flex-shrink-0 ${typeColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-muted/40">{asset.type.replace(/_/g, ' ').toUpperCase()}</span>
                    {asset.tags && <span className="text-[10px] font-mono text-[#39ff14]/40">{asset.tags}</span>}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <Link href={`/projects/${asset.projectId}`} className="text-[10px] font-mono text-[#bf5af2]/40 hover:text-[#bf5af2] tracking-wider transition-colors">
                    {asset.projectTitle}
                  </Link>
                  {asset.filePath && <p className="text-[9px] font-mono text-muted/20 truncate max-w-[200px]">{asset.filePath}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
