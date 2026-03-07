'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProductionAction, deleteProductionAction } from '@/app/production-actions';
import type { ProductionProject, ProductionStatus, ProductionType, Platform } from '@/lib/types';
import { PRODUCTION_STATUS_LABELS, PRODUCTION_STATUS_COLORS, PRODUCTION_TYPE_LABELS, PLATFORM_LABELS } from '@/lib/types';
import { Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  production: ProductionProject;
}

export default function ProductionEditor({ production }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(production);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    await updateProductionAction(production.id, {
      title: form.title,
      type: form.type,
      status: form.status,
      description: form.description,
      targetPlatform: form.targetPlatform,
      client: form.client,
      budget: form.budget,
      dueDate: form.dueDate,
      notes: form.notes,
    });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Delete this production and all linked data?')) return;
    await deleteProductionAction(production.id);
    router.push('/productions');
  }

  async function handleStatusChange(newStatus: ProductionStatus) {
    await updateProductionAction(production.id, { status: newStatus });
    router.refresh();
  }

  const pipeline: ProductionStatus[] = ['concept', 'briefing', 'pre_production', 'scheduled', 'in_production', 'ingested', 'editing', 'review', 'revision', 'final_delivery', 'published'];

  return (
    <div className="neon-card">
      {/* Status pipeline */}
      <div className="flex gap-1 overflow-x-auto border-b border-border/60 p-3">
        {pipeline.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`shrink-0 rounded-md px-3 py-1 text-[10px] font-mono font-medium tracking-wider transition-all ${
              production.status === s
                ? `${PRODUCTION_STATUS_COLORS[s]} border border-current/20`
                : 'border border-border/30 bg-background/50 text-muted/40 hover:text-muted hover:border-border/50'
            }`}
          >
            {PRODUCTION_STATUS_LABELS[s].toUpperCase()}
          </button>
        ))}
      </div>

      {/* Toggle Edit */}
      <button
        onClick={() => setEditing(!editing)}
        className="flex w-full items-center justify-between px-4 py-3 text-[10px] font-mono text-muted/40 hover:text-[#00f0ff] tracking-wider transition-colors"
      >
        <span>{editing ? '▾ EDITING PRODUCTION DETAILS' : '▸ EDIT PRODUCTION DETAILS'}</span>
        {editing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {editing && (
        <div className="border-t border-border/60 p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">TITLE</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">TYPE</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as ProductionType })}
                className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all"
              >
                {Object.entries(PRODUCTION_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">PLATFORM</label>
              <select
                value={form.targetPlatform || ''}
                onChange={(e) => setForm({ ...form, targetPlatform: (e.target.value as Platform) || null })}
                className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all"
              >
                <option value="">None</option>
                {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">CLIENT</label>
              <input
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">BUDGET</label>
              <input
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all"
                placeholder="$0"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">DUE DATE</label>
              <input
                type="date"
                value={form.dueDate || ''}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value || null })}
                className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">DESCRIPTION</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none resize-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-medium text-muted/40 mb-1 tracking-wider">NOTES</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-border/30 bg-background/50 px-3 py-2 text-sm font-mono focus:border-[#00f0ff]/30 focus:outline-none resize-none transition-all"
              placeholder="Production notes, references, ideas..."
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button onClick={handleDelete} className="inline-flex items-center gap-1.5 rounded-md border border-[#ff3366]/20 px-3 py-1.5 text-[10px] font-mono text-[#ff3366]/70 hover:text-[#ff3366] hover:bg-[#ff3366]/5 tracking-wider transition-all">
              <Trash2 className="h-3 w-3" /> DELETE PRODUCTION
            </button>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md border border-[#39ff14]/30 bg-[#39ff14]/5 px-4 py-2 text-[10px] font-mono font-medium text-[#39ff14] hover:bg-[#39ff14]/10 hover:shadow-[0_0_15px_rgba(57,255,20,0.1)] disabled:opacity-30 tracking-wider transition-all">
              <Save className="h-3.5 w-3.5" /> {saving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </div>
      )}

      {/* Read-only details when not editing */}
      {!editing && production.description && (
        <div className="border-t border-border/60 px-4 py-3">
          <p className="text-sm text-muted/60">{production.description}</p>
        </div>
      )}
      {!editing && production.notes && (
        <div className="border-t border-border/60 px-4 py-3">
          <p className="text-[10px] font-mono font-medium text-muted/30 mb-1 tracking-wider">NOTES</p>
          <p className="text-sm whitespace-pre-wrap text-muted/70">{production.notes}</p>
        </div>
      )}
    </div>
  );
}
