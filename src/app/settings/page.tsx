import { getPreferences } from '@/lib/data';
import PreferencesEditor from '@/components/PreferencesEditor';
import { Settings, Cpu, Database, Rocket } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const preferences = getPreferences();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-3 w-3 text-muted/30 animate-[spin_8s_linear_infinite]" />
          <span className="text-[9px] font-mono text-muted/30 tracking-[0.3em]">SYSTEM::CONFIG</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-xs font-mono text-muted/50 mt-1 tracking-wider">▸ Creator preferences & system configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PreferencesEditor preferences={preferences} />

        {/* System Info */}
        <div className="space-y-4">
          <div className="neon-card p-4">
            <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#00f0ff] mb-3 flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5" /> AI::CONFIG
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'PROVIDER', value: 'Ollama (local)' },
                { label: 'MODEL', value: process.env.OLLAMA_MODEL || 'kimi-k2.5:cloud' },
                { label: 'ENDPOINT', value: process.env.OLLAMA_BASE_URL || 'http://localhost:11434' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-muted/40 tracking-wider">{item.label}</span>
                  <span className="text-[10px] font-mono text-[#00f0ff]/70">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="neon-card p-4">
            <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#bf5af2] mb-3 flex items-center gap-2">
              <Database className="h-3.5 w-3.5" /> SYSTEM::INFO
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'APP', value: 'metaVstudio MVP' },
                { label: 'STACK', value: 'Next.js · SQLite · Ollama' },
                { label: 'STORAGE', value: './data/metavstudio.db' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-muted/40 tracking-wider">{item.label}</span>
                  <span className="text-[10px] font-mono text-[#bf5af2]/70">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="neon-card p-4">
            <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#39ff14] mb-3 flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5" /> FUTURE::INTEGRATIONS
            </h3>
            <div className="space-y-1.5">
              {[
                'AppleScript automation',
                'macOS Shortcuts',
                'Folder watchers',
                'OBS WebSocket control',
                'Export pipelines',
                'Agent-based task execution',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[10px] font-mono text-[#39ff14]/60 tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-[#39ff14]/50" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/integrations"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-[#39ff14] hover:text-[#39ff14] tracking-wider"
            >
              VIEW INTEGRATIONS →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
