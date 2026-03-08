// ─── macOS Shortcuts Integration ───────────────────────
// Run Shortcuts.app automations from the production OS.
// Uses the `shortcuts` CLI (available on macOS 12+).

import { execFile } from 'child_process';
import { promisify } from 'util';
import type { ShortcutDefinition, ShortcutResult } from './types';

const execFileAsync = promisify(execFile);

/** Run a macOS Shortcut by name */
export async function runShortcut(name: string, input?: string): Promise<ShortcutResult> {
  const start = Date.now();

  if (process.platform !== 'darwin') {
    return { success: false, error: 'macOS Shortcuts requires macOS', durationMs: Date.now() - start };
  }

  try {
    const args = ['run', name];
    if (input) args.push('--input-type', 'text', '--input', input);

    const { stdout, stderr } = await execFileAsync('shortcuts', args, {
      timeout: 60000,
      maxBuffer: 1024 * 1024,
    });

    return {
      success: true,
      output: stdout.trim() || undefined,
      error: stderr.trim() || undefined,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Shortcut execution failed',
      durationMs: Date.now() - start,
    };
  }
}

/** List all available Shortcuts */
export async function listShortcuts(): Promise<ShortcutDefinition[]> {
  if (process.platform !== 'darwin') return [];

  try {
    const { stdout } = await execFileAsync('shortcuts', ['list'], {
      timeout: 10000,
    });

    return stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((name) => ({
        name: name.trim(),
        description: '',
      }));
  } catch {
    return [];
  }
}

/** Check if the shortcuts CLI is available */
export async function isShortcutsAvailable(): Promise<boolean> {
  if (process.platform !== 'darwin') return false;
  try {
    await execFileAsync('shortcuts', ['list'], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
