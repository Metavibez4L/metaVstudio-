import { getProjects } from '@/lib/data';
import { STATUS_LABELS, STATUS_COLORS, PROJECT_TYPE_LABELS } from '@/lib/types';
import type { ProjectStatus } from '@/lib/types';
import Link from 'next/link';
import { Plus, FolderKanban, Terminal } from 'lucide-react';
import ProjectCreateButton from '@/components/ProjectCreateButton';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ status?: string; new?: string }>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = params.status || 'all';
  const showNewForm = params.new === '1';
  const projects = getProjects(statusFilter);

  const statuses: ('all' | ProjectStatus)[] = ['all', 'idea', 'planning', 'recording', 'editing', 'ready_to_publish', 'published', 'archived'];

  const filterColors: Record<string, string> = {
    all: 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]',
    idea: 'border-[#bf5af2] bg-[#bf5af2]/10 text-[#bf5af2]',
    planning: 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]',
    recording: 'border-[#ff3366] bg-[#ff3366]/10 text-[#ff3366]',
    editing: 'border-[#ffb800] bg-[#ffb800]/10 text-[#ffb800]',
    ready_to_publish: 'border-[#39ff14] bg-[#39ff14]/10 text-[#39ff14]',
    published: 'border-emerald-400 bg-emerald-400/10 text-emerald-400',
    archived: 'border-gray-500 bg-gray-500/10 text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-3 w-3 text-[#bf5af2]/50" />
            <span className="text-[9px] font-mono text-[#bf5af2]/50 tracking-[0.3em]">PROJECTS::INDEX</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-glow-magenta">Projects</h1>
          <p className="text-xs font-mono text-muted/50 mt-1 tracking-wider">▸ Content project management</p>
        </div>
        <ProjectCreateButton />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/projects${s === 'all' ? '' : `?status=${s}`}`}
            className={`shrink-0 rounded-md border px-3 py-1.5 text-[10px] font-mono font-medium tracking-wider transition-all ${
              statusFilter === s
                ? filterColors[s]
                : 'border-border/40 bg-background/50 text-muted/50 hover:text-muted hover:border-border/60'
            }`}
          >
            {(s === 'all' ? 'ALL' : STATUS_LABELS[s]).toUpperCase()}
          </Link>
        ))}
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="neon-card flex flex-col items-center justify-center py-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-border/30 mb-4">
            <FolderKanban className="h-6 w-6 text-muted/30" />
          </div>
          <p className="text-xs font-mono text-muted/50 tracking-wider">NO PROJECTS FOUND</p>
          <Link href="/projects?new=1" className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-4 py-2 text-xs font-mono font-medium text-[#00f0ff] hover:bg-[#00f0ff]/10 tracking-wider transition-all">
            <Plus className="h-3.5 w-3.5" /> INITIALIZE PROJECT
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group neon-card p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.08)] hover:border-[#00f0ff]/20"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold truncate group-hover:text-[#00f0ff] transition-colors">{project.title}</h3>
                  <p className="text-[10px] font-mono text-muted/40 mt-0.5 tracking-wider">{PROJECT_TYPE_LABELS[project.type].toUpperCase()}</p>
                </div>
                <span className={`ml-2 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider ${STATUS_COLORS[project.status as ProjectStatus]}`}>
                  {STATUS_LABELS[project.status as ProjectStatus].toUpperCase()}
                </span>
              </div>
              {project.description && (
                <p className="mt-2 text-xs text-muted/60 line-clamp-2">{project.description}</p>
              )}
              <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-muted/40 tracking-wider">
                {project.targetPlatform && (
                  <span className="rounded border border-border/30 bg-background/50 px-1.5 py-0.5">{project.targetPlatform.toUpperCase()}</span>
                )}
                {project.dueDate && (
                  <span>DUE: {new Date(project.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showNewForm && <ProjectCreateButton autoOpen />}
    </div>
  );
}
