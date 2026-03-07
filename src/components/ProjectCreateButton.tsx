'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { createProjectAction } from '@/app/actions';
import type { ProjectType, Platform, ProjectStatus } from '@/lib/types';

interface Props {
  autoOpen?: boolean;
}

export default function ProjectCreateButton({ autoOpen }: Props) {
  const [open, setOpen] = useState(autoOpen || false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const project = await createProjectAction({
      title: form.get('title') as string,
      type: (form.get('type') as ProjectType) || 'tutorial',
      status: 'idea' as ProjectStatus,
      description: form.get('description') as string || '',
      targetPlatform: (form.get('targetPlatform') as Platform) || null,
      dueDate: (form.get('dueDate') as string) || null,
      notes: '',
    });
    setLoading(false);
    setOpen(false);
    router.push(`/projects/${project.id}`);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-4 py-2 text-xs font-mono font-medium text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] tracking-wider transition-all"
      >
        <Plus className="h-3.5 w-3.5" /> NEW PROJECT
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md neon-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono font-semibold tracking-wider text-[#00f0ff]">INITIALIZE::PROJECT</h2>
          <button onClick={() => { setOpen(false); router.replace('/projects'); }} className="text-muted/40 hover:text-[#ff3366] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">TITLE *</label>
            <input name="title" required className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.05)] transition-all placeholder:text-muted/20" placeholder="Project title..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">TYPE</label>
              <select name="type" className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all">
                <option value="tutorial">Tutorial</option>
                <option value="promo">Promo</option>
                <option value="explainer">Explainer</option>
                <option value="demo">Demo</option>
                <option value="social_clip">Social Clip</option>
                <option value="livestream">Livestream</option>
                <option value="whiteboard">Whiteboard</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">PLATFORM</label>
              <select name="targetPlatform" className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all">
                <option value="">None</option>
                <option value="youtube">YouTube</option>
                <option value="x">X</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">DESCRIPTION</label>
            <textarea name="description" rows={3} className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none resize-none transition-all placeholder:text-muted/20" placeholder="What's this project about?" />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">DUE DATE</label>
            <input name="dueDate" type="date" className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setOpen(false); router.replace('/projects'); }} className="rounded-md border border-border/40 px-4 py-2 text-[10px] font-mono text-muted/50 hover:text-muted hover:border-border/60 tracking-wider transition-all">
              CANCEL
            </button>
            <button type="submit" disabled={loading} className="rounded-md border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-2 text-[10px] font-mono font-medium text-[#00f0ff] hover:bg-[#00f0ff]/15 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] disabled:opacity-30 tracking-wider transition-all">
              {loading ? 'CREATING...' : 'CREATE PROJECT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
