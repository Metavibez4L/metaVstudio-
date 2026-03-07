'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDraftAction, deleteDraftAction } from '@/app/actions';
import type { ContentDraft, Project } from '@/lib/types';
import { Sparkles, Trash2, Plus, Loader2 } from 'lucide-react';

interface Props {
  drafts: ContentDraft[];
  projectId: string;
  project: Project;
}

const DRAFT_TYPES: { value: ContentDraft['type']; label: string }[] = [
  { value: 'hook', label: 'Hooks' },
  { value: 'script', label: 'Script' },
  { value: 'outline', label: 'Outline' },
  { value: 'shot_list', label: 'Shot List' },
  { value: 'thumbnail_idea', label: 'Thumbnail Ideas' },
  { value: 'post_copy', label: 'Post Copy' },
  { value: 'cta', label: 'CTA Variations' },
];

export default function DraftList({ drafts, projectId, project }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate(type: ContentDraft['type']) {
    setGenerating(type);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          projectContext: {
            title: project.title,
            type: project.type,
            description: project.description,
            targetPlatform: project.targetPlatform,
            notes: project.notes,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      await createDraftAction({
        projectId,
        type,
        content: data.content,
        platform: project.targetPlatform,
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(null);
    }
  }

  async function handleDelete(id: string) {
    await deleteDraftAction(id, projectId);
    router.refresh();
  }

  return (
    <div className="neon-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#bf5af2]" />
          <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#bf5af2]">CONTENT::DRAFTS</h3>
          <span className="text-[10px] font-mono text-muted/30">({drafts.length})</span>
        </div>
      </div>

      {/* Generate buttons */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/60 p-3">
        {DRAFT_TYPES.map((dt) => (
          <button
            key={dt.value}
            onClick={() => handleGenerate(dt.value)}
            disabled={generating !== null}
            className="inline-flex items-center gap-1 rounded-md border border-border/30 bg-background/50 px-2.5 py-1 text-[10px] font-mono text-muted/40 hover:text-[#bf5af2] hover:border-[#bf5af2]/30 disabled:opacity-30 tracking-wider transition-all"
          >
            {generating === dt.value ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
            {dt.label.toUpperCase()}
          </button>
        ))}
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded-md border border-[#ff3366]/20 bg-[#ff3366]/5 px-3 py-2 text-[10px] font-mono text-[#ff3366] tracking-wider">
          {error}
        </div>
      )
      }

      {/* Draft list */}
      <div className="divide-y divide-border/30">
        {drafts.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs font-mono text-muted/30 tracking-wider">
            No drafts yet — use the buttons above to generate with AI
          </div>
        ) : (
          drafts.map((draft) => (
            <div key={draft.id} className="px-4 py-3 group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#bf5af2]/10 border border-[#bf5af2]/20 px-2 py-0.5 text-[10px] font-mono font-medium text-[#bf5af2] tracking-wider">
                    {(DRAFT_TYPES.find(d => d.value === draft.type)?.label || draft.type).toUpperCase()}
                  </span>
                  {draft.platform && (
                    <span className="text-[10px] font-mono text-muted/30 tracking-wider">{draft.platform.toUpperCase()}</span>
                  )}
                </div>
                <button onClick={() => handleDelete(draft.id)} className="opacity-0 group-hover:opacity-100 text-muted/30 hover:text-[#ff3366] transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="prose prose-sm prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-xs font-mono text-foreground/60 bg-background/50 rounded-md border border-border/20 p-3 overflow-x-auto max-h-60 overflow-y-auto">
                  {draft.content}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
