'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  FileText,
  Crosshair,
  FrameIcon,
  Package,
  Megaphone,
  SlidersHorizontal,
  Sparkles,
  FolderOpen,
  Settings,
  Zap,
  Clapperboard,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'COMMAND', icon: LayoutDashboard, accent: 'cyan' },
  { href: '/productions', label: 'PRODUCTIONS', icon: Film, accent: 'magenta' },
  { href: '/briefs', label: 'BRIEFS', icon: FileText, accent: 'cyan' },
  { href: '/shots', label: 'SHOTS', icon: Crosshair, accent: 'green' },
  { href: '/storyboards', label: 'STORYBOARD', icon: FrameIcon, accent: 'magenta' },
  { href: '/deliverables', label: 'DELIVERABLES', icon: Package, accent: 'cyan' },
  { href: '/campaigns', label: 'CAMPAIGNS', icon: Megaphone, accent: 'green' },
  { href: '/post', label: 'POST', icon: SlidersHorizontal, accent: 'magenta' },
  { href: '/assistant', label: 'AI DIRECTOR', icon: Sparkles, accent: 'cyan' },
  { href: '/assets', label: 'ASSETS', icon: FolderOpen, accent: 'green' },
  { href: '/settings', label: 'CONFIG', icon: Settings, accent: 'cyan' },
];

const ACCENT_CLASSES = {
  cyan: {
    active: 'border-[#00f0ff]/30 bg-[#00f0ff]/8 text-[#00f0ff]',
    glow: 'shadow-[inset_0_0_12px_rgba(0,240,255,0.08)]',
    dot: 'bg-[#00f0ff]',
  },
  magenta: {
    active: 'border-[#bf5af2]/30 bg-[#bf5af2]/8 text-[#bf5af2]',
    glow: 'shadow-[inset_0_0_12px_rgba(191,90,242,0.08)]',
    dot: 'bg-[#bf5af2]',
  },
  green: {
    active: 'border-[#39ff14]/30 bg-[#39ff14]/8 text-[#39ff14]',
    glow: 'shadow-[inset_0_0_12px_rgba(57,255,20,0.08)]',
    dot: 'bg-[#39ff14]',
  },
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-[#060a14]/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4 relative">
        <div className="relative">
          <Clapperboard className="h-5 w-5 text-[#00f0ff]" />
          <div className="absolute inset-0 h-5 w-5 text-[#00f0ff] blur-sm opacity-50">
            <Clapperboard className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-wider text-[#00f0ff] text-glow-cyan animate-flicker">
            metaV<span className="text-[#bf5af2]">studio</span>
          </span>
          <span className="text-[9px] font-mono text-muted tracking-[0.2em] -mt-0.5">CINEMA::PRODUCTION OS</span>
        </div>
        {/* Top accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px animate-border-flow opacity-30" />
      </div>

      {/* System status */}
      <div className="px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2 text-[9px] font-mono text-muted tracking-wider">
          <div className="status-dot bg-[#39ff14]" />
          <span>SYS::ONLINE</span>
          <span className="ml-auto text-[#39ff14]/60">▸ OLLAMA</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        <p className="px-3 pb-1.5 text-[9px] font-mono text-muted/50 tracking-[0.25em] uppercase">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          const accent = ACCENT_CLASSES[item.accent as keyof typeof ACCENT_CLASSES];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg border px-3 py-2 text-xs font-medium tracking-wider transition-all duration-200 ${
                isActive
                  ? `${accent.active} ${accent.glow}`
                  : 'border-transparent text-muted hover:bg-white/[0.03] hover:text-foreground hover:border-border/50'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-mono">{item.label}</span>
              {isActive && (
                <div className="ml-auto flex items-center gap-1">
                  <div className={`status-dot ${accent.dot}`} />
                </div>
              )}
              {/* Left edge glow on active */}
              {isActive && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full ${accent.dot} opacity-80 blur-[1px]`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-3">
        <div className="flex items-center gap-2 text-[9px] font-mono text-muted/40 tracking-wider">
          <Zap className="h-3 w-3" />
          <span>PRODUCTION OS v2.0</span>
        </div>
      </div>
    </aside>
  );
}
