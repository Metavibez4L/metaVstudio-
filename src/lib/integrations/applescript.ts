// ─── AppleScript Automation ────────────────────────────
// Execute AppleScript commands for macOS app control.
// Used for: Screen Studio, DaVinci Resolve, Finder, notifications.

import { execFile } from 'child_process';
import { promisify } from 'util';
import type { AppleScriptCommand, AppleScriptRequest, AppleScriptResult } from './types';

const execFileAsync = promisify(execFile);

const SCRIPT_TEMPLATES: Record<AppleScriptCommand, (req: AppleScriptRequest) => string> = {
  'open-app': (r) => `tell application "${sanitize(r.appName || '')}" to activate`,
  'activate-app': (r) => `tell application "${sanitize(r.appName || '')}" to activate`,
  'quit-app': (r) => `tell application "${sanitize(r.appName || '')}" to quit`,
  'finder-reveal': (r) => `tell application "Finder" to reveal POSIX file "${sanitize(r.filePath || '')}"
tell application "Finder" to activate`,
  'notification': (r) => `display notification "${sanitize(r.message || '')}" with title "${sanitize(r.title || 'metaVstudio')}"`,
  'screen-studio-record': () => `tell application "Screen Studio" to activate
delay 1
tell application "System Events"
  tell process "Screen Studio"
    click menu item "Start Recording" of menu "Recording" of menu bar 1
  end tell
end tell`,
  'screen-studio-stop': () => `tell application "System Events"
  tell process "Screen Studio"
    click menu item "Stop Recording" of menu "Recording" of menu bar 1
  end tell
end tell`,
  'davinci-open': () => `tell application "DaVinci Resolve" to activate`,
  'custom': (r) => r.script || '',
};

/** Sanitize strings for AppleScript injection prevention */
function sanitize(input: string): string {
  return input.replace(/[\\"]/g, '\\$&').replace(/[\r\n]/g, ' ');
}

/** Execute an AppleScript command */
export async function runAppleScript(request: AppleScriptRequest): Promise<AppleScriptResult> {
  const start = Date.now();

  if (process.platform !== 'darwin') {
    return { success: false, error: 'AppleScript requires macOS', durationMs: Date.now() - start };
  }

  const template = SCRIPT_TEMPLATES[request.command];
  if (!template) {
    return { success: false, error: `Unknown command: ${request.command}`, durationMs: Date.now() - start };
  }

  // For custom scripts, validate it's not empty
  if (request.command === 'custom' && !request.script) {
    return { success: false, error: 'Custom command requires a script', durationMs: Date.now() - start };
  }

  const script = template(request);

  try {
    const { stdout, stderr } = await execFileAsync('osascript', ['-e', script], {
      timeout: 15000,
      maxBuffer: 1024 * 512,
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
      error: err instanceof Error ? err.message : 'AppleScript execution failed',
      durationMs: Date.now() - start,
    };
  }
}

/** Check if AppleScript is available (macOS only) */
export async function isAppleScriptAvailable(): Promise<boolean> {
  if (process.platform !== 'darwin') return false;
  try {
    await execFileAsync('osascript', ['-e', 'return "ok"'], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/** List running applications via AppleScript */
export async function getRunningApps(): Promise<string[]> {
  if (process.platform !== 'darwin') return [];
  try {
    const { stdout } = await execFileAsync('osascript', [
      '-e', 'tell application "System Events" to get name of every process whose background only is false',
    ], { timeout: 5000 });
    return stdout.trim().split(', ').filter(Boolean);
  } catch {
    return [];
  }
}
