import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/ai/provider';
import type { AIGenerateRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: AIGenerateRequest = await req.json();

    if (!body.type) {
      return NextResponse.json({ error: 'Missing content type' }, { status: 400 });
    }

    const content = await generateContent(body);
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
