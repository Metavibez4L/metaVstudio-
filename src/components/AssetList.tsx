'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAssetAction, deleteAssetAction } from '@/app/actions';
import type { Asset } from '@/lib/types';
import { FileText, Plus, Trash2, FolderOpen } from 'lucide-react';

interface Props {
  assets: Asset[];
  projectId: string;
}

export default function AssetList({ assets, projectId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await createAssetAction({
      projectId,
      name: form.get('name') as string,
      filePath: form.get('filePath') as string,
      type: form.get('type') as Asset['type'],
      notes: form.get('notes') as string || '',
      tags: '',
    });
    setLoading(false);
    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await deleteAssetAction(id, projectId);
    router.refresh();
  }

  return (
    <div className="neon-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-[#00f0ff]" />
          <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#00f0ff]">ASSETS</h3>
          <span className="text-[10px] font-mono text-muted/30">({assets.length})</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-md border border-border/30 bg-background/50 px-2.5 py-1 text-[10px] font-mono text-muted/40 hover:text-[#00f0ff] hover:border-[#00f0ff]/30 tracking-wider transition-all"
        >
          <Plus className="h-3 w-3" /> ADD
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="border-b border-border/60 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="name" required placeholder="Asset name" className="rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all placeholder:text-muted/20" />
            <select name="type" className="rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all">
              <option value="reference">Reference</option>
              <option value="script">Script</option>
              <option value="thumbnail">Thumbnail</option>
              <option value="raw_capture">Raw Capture</option>
              <option value="export">Export</option>
              <option value="caption">Caption</option>
              <option value="other">Other</option>
            </select>
          </div>
          <input name="filePath" required placeholder="File path (e.g. /Users/.../file.mp4)" className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all placeholder:text-muted/20" />
          <input name="notes" placeholder="Notes (optional)" className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all placeholder:text-muted/20" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md px-3 py-1.5 text-[10px] font-mono text-muted/40 hover:text-muted tracking-wider transition-colors">CANCEL</button>
            <button type="submit" disabled={loading} className="rounded-md border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-3 py-1.5 text-[10px] font-mono font-medium text-[#00f0ff] hover:bg-[#00f0ff]/10 disabled:opacity-30 tracking-wider transition-all">
              {loading ? 'ADDING...' : 'ADD ASSET'}
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-border/30">
        {assets.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs font-mono text-muted/30 tracking-wider">No assets attached yet</div>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between px-4 py-2.5 group">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 text-[#00f0ff]/40 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <p className="text-[10px] font-mono text-muted/30 truncate tracking-wider">{asset.filePath}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-border/30 bg-background/50 px-1.5 py-0.5 text-[10px] font-mono text-muted/40 tracking-wider">{asset.type.toUpperCase()}</span>
                <button onClick={() => handleDelete(asset.id)} className="opacity-0 group-hover:opacity-100 text-muted/30 hover:text-[#ff3366] transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
