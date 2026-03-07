'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { createProductionAction } from '@/app/production-actions';
import type { ProductionType, Platform } from '@/lib/types';
import { PRODUCTION_TYPE_LABELS, PLATFORM_LABELS } from '@/lib/types';

export default function ProductionCreateButton({ autoOpen = false }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(autoOpen);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const prod = await createProductionAction({
      title: fd.get('title') as string,
      type: (fd.get('type') as ProductionType) || 'commercial',
      status: 'concept',
      client: fd.get('client') as string || '',
      description: fd.get('description') as string || '',
      targetPlatform: (fd.get('platform') as Platform) || null,
      budget: fd.get('budget') as string || '',
      dueDate: (fd.get('dueDate') as string) || null,
      notes: '',
    });
    setLoading(false);
    setOpen(false);
    router.push(`/productions/${prod.id}`);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="group neon-card flex items-center gap-3 px-5 py-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:border-[#00f0ff]/30">
        <Plus className="h-5 w-5 text-[#00f0ff] transition-transform group-hover:scale-110" />
        <span className="text-sm font-mono font-medium tracking-wider text-muted group-hover:text-foreground">NEW PRODUCTION</span>
      </button>
    );
  }

  return (
    <div className="neon-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-mono font-semibold tracking-wider text-[#00f0ff]">INITIALIZE PRODUCTION</h2>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">TITLE *</label>
          <input name="title" required placeholder="Production title..." className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted/30 focus:border-[#00f0ff]/40 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">TYPE</label>
            <select name="type" className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/40 focus:outline-none">
              {(Object.entries(PRODUCTION_TYPE_LABELS) as [ProductionType, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">PLATFORM</label>
            <select name="platform" className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/40 focus:outline-none">
              <option value="">Select...</option>
              {(Object.entries(PLATFORM_LABELS) as [Platform, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">CLIENT</label>
            <input name="client" placeholder="Client name..." className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted/30 focus:border-[#00f0ff]/40 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">BUDGET</label>
            <input name="budget" placeholder="Budget range..." className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted/30 focus:border-[#00f0ff]/40 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">DESCRIPTION</label>
          <textarea name="description" rows={3} placeholder="Production brief..." className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted/30 focus:border-[#00f0ff]/40 focus:outline-none resize-none" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-muted/60 tracking-wider mb-1.5">DUE DATE</label>
          <input name="dueDate" type="date" className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/40 focus:outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-4 py-2.5 text-sm font-mono font-semibold tracking-wider text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all disabled:opacity-50">
          {loading ? 'INITIALIZING...' : 'CREATE PRODUCTION'}
        </button>
      </form>
    </div>
  );
}
