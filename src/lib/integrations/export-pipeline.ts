// ─── Export Pipeline ───────────────────────────────────
// Manage export jobs for production deliverables.
// Supports ffmpeg-based encoding with platform presets.
// Queue-based: jobs run via the task runner.

import { execFile } from 'child_process';
import { promisify } from 'util';
import { access, mkdir } from 'fs/promises';
import { resolve, join, dirname } from 'path';
import { v4 as uuid } from 'uuid';
import type { ExportJob, ExportSpec, ExportPreset } from './types';
import { EXPORT_PRESETS } from './types';

const execFileAsync = promisify(execFile);

// ─── Job Queue (in-memory) ─────────────────────────────

const jobs = new Map<string, ExportJob>();

/** Create an export job from a preset */
export function createExportJob(
  preset: ExportPreset,
  outputDir: string,
  options?: { productionId?: string; filenameTemplate?: string; overrides?: Partial<ExportSpec> },
): ExportJob {
  const base = EXPORT_PRESETS[preset];
  const spec: ExportSpec = {
    ...base,
    outputDir: resolve(outputDir),
    filenameTemplate: options?.filenameTemplate || `${preset}-{timestamp}`,
    ...options?.overrides,
  };

  const job: ExportJob = {
    id: uuid(),
    productionId: options?.productionId,
    spec,
    status: 'queued',
    progress: 0,
    createdAt: new Date().toISOString(),
  };

  jobs.set(job.id, job);
  return job;
}

/** Run an export job via ffmpeg */
export async function runExportJob(jobId: string, inputPath: string): Promise<ExportJob> {
  const job = jobs.get(jobId);
  if (!job) throw new Error(`Export job not found: ${jobId}`);

  job.status = 'running';
  job.progress = 0;

  try {
    // Ensure output directory exists
    await mkdir(job.spec.outputDir, { recursive: true });

    const filename = job.spec.filenameTemplate
      .replace('{timestamp}', Date.now().toString())
      .replace('{preset}', job.spec.preset)
      + `.${job.spec.format}`;

    const outputPath = join(job.spec.outputDir, filename);

    // Build ffmpeg arguments
    const args = buildFFmpegArgs(inputPath, outputPath, job.spec);

    await execFileAsync('ffmpeg', args, {
      timeout: 600000, // 10 min max
      maxBuffer: 1024 * 1024 * 10,
    });

    job.status = 'completed';
    job.progress = 100;
    job.outputPath = outputPath;
    job.completedAt = new Date().toISOString();
  } catch (err) {
    job.status = 'failed';
    job.error = err instanceof Error ? err.message : 'Export failed';
    job.completedAt = new Date().toISOString();
  }

  return job;
}

/** Build ffmpeg command arguments */
function buildFFmpegArgs(input: string, output: string, spec: ExportSpec): string[] {
  const args = ['-y', '-i', input];

  // Video settings
  args.push('-vf', `scale=${spec.width}:${spec.height}`);
  args.push('-r', String(spec.fps));

  // Codec
  if (spec.codec === 'h264') {
    args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18');
  } else if (spec.codec === 'vp9') {
    args.push('-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0');
  } else if (spec.codec === 'prores') {
    args.push('-c:v', 'prores_ks', '-profile:v', '3');
  }

  // Bitrate
  if (spec.bitrate && spec.codec !== 'prores') {
    args.push('-b:v', spec.bitrate);
  }

  // Audio
  args.push('-c:a', 'aac', '-b:a', '192k');

  args.push(output);
  return args;
}

/** Get all export jobs */
export function getExportJobs(): ExportJob[] {
  return Array.from(jobs.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Get a specific export job */
export function getExportJob(id: string): ExportJob | undefined {
  return jobs.get(id);
}

/** Check if ffmpeg is available */
export async function isFFmpegAvailable(): Promise<boolean> {
  try {
    await execFileAsync('ffmpeg', ['-version'], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/** Get available presets */
export function getAvailablePresets(): Array<{ preset: ExportPreset; label: string; dims: string }> {
  return [
    { preset: 'youtube-4k', label: 'YouTube 4K', dims: '3840×2160' },
    { preset: 'youtube-1080', label: 'YouTube 1080p', dims: '1920×1080' },
    { preset: 'tiktok-9x16', label: 'TikTok 9:16', dims: '1080×1920' },
    { preset: 'instagram-1x1', label: 'Instagram 1:1', dims: '1080×1080' },
    { preset: 'meta-ad', label: 'Meta Ad', dims: '1080×1080' },
    { preset: 'web-optimized', label: 'Web VP9', dims: '1920×1080' },
    { preset: 'archive', label: 'Archive ProRes', dims: '3840×2160' },
    { preset: 'custom', label: 'Custom', dims: 'Variable' },
  ];
}
