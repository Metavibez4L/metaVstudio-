import { getProject, getAssets, getDrafts, getPublishPreps } from '@/lib/data';
import { notFound } from 'next/navigation';
import { STATUS_LABELS, STATUS_COLORS, PROJECT_TYPE_LABELS, PLATFORM_LABELS } from '@/lib/types';
import type { ProjectStatus } from '@/lib/types';
import ProjectEditor from '@/components/ProjectEditor';
import AssetList from '@/components/AssetList';
import DraftList from '@/components/DraftList';
import { FolderKanban } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const assets = getAssets(id);
  const drafts = getDrafts(id);
  const publishPreps = getPublishPreps(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="h-3 w-3 text-[#bf5af2]/50" />
            <span className="text-[9px] font-mono text-[#bf5af2]/50 tracking-[0.3em]">PROJECT::DETAIL</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
            <span className={`rounded-md px-2.5 py-0.5 text-[10px] font-mono font-medium tracking-wider ${STATUS_COLORS[project.status as ProjectStatus]}`}>
              {STATUS_LABELS[project.status as ProjectStatus].toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-muted/40 tracking-wider">
            <span>{PROJECT_TYPE_LABELS[project.type].toUpperCase()}</span>
            {project.targetPlatform && (
              <>
                <span className="text-border">·</span>
                <span>{PLATFORM_LABELS[project.targetPlatform].toUpperCase()}</span>
              </>
            )}
            {project.dueDate && (
              <>
                <span className="text-border">·</span>
                <span>DUE {new Date(project.dueDate).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Project Editor */}
      <ProjectEditor project={project} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Drafts */}
        <DraftList drafts={drafts} projectId={id} project={project} />

        {/* Assets */}
        <AssetList assets={assets} projectId={id} />
      </div>
    </div>
  );
}
