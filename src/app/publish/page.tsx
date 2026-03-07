import { getProjects } from '@/lib/data';
import PublishPanel from '@/components/PublishPanel';
import { Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PublishPage() {
  const projects = getProjects().filter(
    (p) => p.status === 'ready_to_publish' || p.status === 'editing'
  );
  const allProjects = getProjects().filter((p) => p.status !== 'archived');

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Send className="h-3 w-3 text-[#ffb800]/50" />
          <span className="text-[9px] font-mono text-[#ffb800]/50 tracking-[0.3em]">PUBLISH::PREP</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-[#ffb800]" style={{ textShadow: '0 0 20px rgba(255,184,0,0.15)' }}>Publish</span> Prep
        </h1>
        <p className="text-xs font-mono text-muted/50 mt-1 tracking-wider">▸ Generate platform-specific deliverables</p>
      </div>

      {allProjects.length === 0 ? (
        <div className="neon-card py-16 text-center">
          <p className="text-xs font-mono text-muted/50 tracking-wider">NO PROJECTS AVAILABLE</p>
          <p className="text-[10px] font-mono text-muted/30 mt-1">Create a project first</p>
        </div>
      ) : (
        <PublishPanel
          readyProjects={projects}
          allProjects={allProjects}
        />
      )}
    </div>
  );
}
