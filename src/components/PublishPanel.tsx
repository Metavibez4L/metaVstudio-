'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Project, Platform } from '@/lib/types';
import { PLATFORM_LABELS } from '@/lib/types';
import { upsertPublishPrepAction } from '@/app/actions';
import { Send, Loader2, Copy, Check } from 'lucide-react';

interface Props {
  readyProjects: Project[];
  allProjects: Project[];
}

const PLATFORMS: Platform[] = ['youtube', 'x', 'tiktok', 'instagram', 'linkedin'];

interface GeneratedCopy {
  platform: Platform;
  title: string;
  description: string;
  caption: string;
  hashtags: string;
  cta: string;
}

export default function PublishPanel({ readyProjects, allProjects }: Props) {
  const [selectedProject, setSelectedProject] = useState<string>(readyProjects[0]?.id || allProjects[0]?.id || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set(['youtube']));
  const [results, setResults] = useState<GeneratedCopy[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  const project = allProjects.find((p) => p.id === selectedProject);

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  async function handleGenerate() {
    if (!project || selectedPlatforms.size === 0) return;
    setGenerating(true);
    setResults([]);

    const newResults: GeneratedCopy[] = [];
    for (const platform of selectedPlatforms) {
      try {
        const res = await fetch('/api/ai/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: {
              title: project.title,
              type: project.type,
              description: project.description,
              notes: project.notes,
            },
            platform,
          }),
        });
        const data = await res.json();
        if (data.title) {
          newResults.push({ platform, ...data });
          // Save to DB
          await upsertPublishPrepAction({
            projectId: project.id,
            platform,
            title: data.title,
            description: data.description,
            caption: data.caption,
            hashtags: data.hashtags,
            cta: data.cta,
          });
        }
      } catch {
        newResults.push({
          platform,
          title: project.title,
          description: 'Generation failed — check Ollama connection',
          caption: '',
          hashtags: '',
          cta: '',
        });
      }
    }

    setResults(newResults);
    setGenerating(false);
    router.refresh();
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="neon-card p-4 space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">PROJECT</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#ffb800]/30 focus:outline-none transition-all"
          >
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-medium text-muted/40 mb-2 tracking-wider">PLATFORMS</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`rounded-md border px-3 py-1.5 text-[10px] font-mono font-medium tracking-wider transition-all ${
                  selectedPlatforms.has(p)
                    ? 'border-[#ffb800]/30 bg-[#ffb800]/10 text-[#ffb800] shadow-[0_0_10px_rgba(255,184,0,0.08)]'
                    : 'border-border/30 text-muted/40 hover:text-muted hover:border-border/50'
                }`}
              >
                {PLATFORM_LABELS[p].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !selectedProject || selectedPlatforms.size === 0}
          className="inline-flex items-center gap-2 rounded-md border border-[#ffb800]/30 bg-[#ffb800]/5 px-4 py-2 text-[10px] font-mono font-medium text-[#ffb800] hover:bg-[#ffb800]/10 hover:shadow-[0_0_15px_rgba(255,184,0,0.1)] disabled:opacity-30 tracking-wider transition-all"
        >
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {generating ? 'GENERATING...' : 'GENERATE COPY'}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((result) => (
            <div key={result.platform} className="neon-card">
              <div className="border-b border-border/60 px-4 py-3">
                <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#ffb800]">{PLATFORM_LABELS[result.platform].toUpperCase()}</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: 'TITLE', value: result.title },
                  { label: 'DESCRIPTION', value: result.description },
                  { label: 'CAPTION/POST', value: result.caption },
                  { label: 'HASHTAGS', value: result.hashtags },
                  { label: 'CTA', value: result.cta },
                ].map((field) => (
                  <div key={field.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-muted/40 tracking-wider">{field.label}</span>
                      <button
                        onClick={() => copyToClipboard(field.value, `${result.platform}-${field.label}`)}
                        className="text-muted/30 hover:text-[#00f0ff] transition-colors"
                      >
                        {copied === `${result.platform}-${field.label}` ? (
                          <Check className="h-3 w-3 text-[#39ff14]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm bg-background/50 border border-border/20 rounded-md px-3 py-2 whitespace-pre-wrap font-mono text-xs text-muted/70">
                      {field.value || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
