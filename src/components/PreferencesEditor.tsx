'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreatorPreference } from '@/lib/types';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Props {
  preferences: CreatorPreference[];
}

const PREFERENCE_LABELS: Record<string, string> = {
  preferred_tone: 'Preferred Tone',
  brand_voice: 'Brand Voice',
  video_style: 'Video Style',
  cta_style: 'CTA Style',
  platform_preferences: 'Platform Preferences',
  naming_convention: 'Naming Convention',
  preferred_content_length: 'Preferred Content Length',
};

export default function PreferencesEditor({ preferences }: Props) {
  const [prefs, setPrefs] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const router = useRouter();

  function updatePref(key: string, value: string) {
    setPrefs(prefs.map((p) => (p.key === key ? { ...p, value } : p)));
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences: prefs }),
    });
    setSaving(false);
    router.refresh();
  }

  async function handleAdd() {
    if (!newKey.trim()) return;
    const key = newKey.trim().toLowerCase().replace(/\s+/g, '_');
    setPrefs([...prefs, { key, value: newValue, updatedAt: new Date().toISOString() }]);
    setNewKey('');
    setNewValue('');
  }

  function handleRemove(key: string) {
    setPrefs(prefs.filter((p) => p.key !== key));
  }

  return (
    <div className="neon-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h3 className="text-[10px] font-mono font-semibold tracking-wider text-[#bf5af2]">CREATOR::PREFERENCES</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#39ff14]/30 bg-[#39ff14]/5 px-3 py-1.5 text-[10px] font-mono font-medium text-[#39ff14] hover:bg-[#39ff14]/10 disabled:opacity-30 tracking-wider transition-all"
        >
          <Save className="h-3 w-3" /> {saving ? 'SAVING...' : 'SAVE ALL'}
        </button>
      </div>

      <div className="divide-y divide-border/30">
        {prefs.map((pref) => (
          <div key={pref.key} className="px-4 py-3 group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono font-medium text-muted/40 tracking-wider">
                {(PREFERENCE_LABELS[pref.key] || pref.key).toUpperCase()}
              </label>
              <button
                onClick={() => handleRemove(pref.key)}
                className="opacity-0 group-hover:opacity-100 text-muted/30 hover:text-[#ff3366] transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <input
              value={pref.value}
              onChange={(e) => updatePref(pref.key, e.target.value)}
              className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-sm font-mono focus:border-[#bf5af2]/30 focus:outline-none transition-all"
            />
          </div>
        ))}
      </div>

      {/* Add new preference */}
      <div className="border-t border-border/60 p-4">
        <p className="text-[10px] font-mono font-medium text-muted/30 mb-2 tracking-wider">ADD CUSTOM PREFERENCE</p>
        <div className="flex gap-2">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key (e.g. intro_style)"
            className="w-1/3 rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-[10px] font-mono focus:border-[#bf5af2]/30 focus:outline-none transition-all placeholder:text-muted/20"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            className="flex-1 rounded-md border border-border/30 bg-background/50 px-3 py-1.5 text-[10px] font-mono focus:border-[#bf5af2]/30 focus:outline-none transition-all placeholder:text-muted/20"
          />
          <button
            onClick={handleAdd}
            disabled={!newKey.trim()}
            className="inline-flex items-center gap-1 rounded-md border border-border/30 px-3 py-1.5 text-[10px] font-mono text-muted/40 hover:text-[#bf5af2] hover:border-[#bf5af2]/30 disabled:opacity-30 tracking-wider transition-all"
          >
            <Plus className="h-3 w-3" /> ADD
          </button>
        </div>
      </div>
    </div>
  );
}
