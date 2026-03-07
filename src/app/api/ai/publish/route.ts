import { NextRequest, NextResponse } from 'next/server';
import { generatePublishCopy } from '@/lib/ai/provider';
import type { Platform } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { project, platform } = await req.json() as {
      project: { title: string; type: string; description: string; notes: string };
      platform: Platform;
    };

    if (!project?.title || !platform) {
      return NextResponse.json({ error: 'Missing project or platform' }, { status: 400 });
    }

    const result = await generatePublishCopy(project, platform);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Publish copy generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
