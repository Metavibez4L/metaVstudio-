import { NextRequest, NextResponse } from 'next/server';
import type { AIMessage } from '@/lib/types';
import { getProviderForTask } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: AIMessage[] };

    const provider = getProviderForTask('chat');

    const systemMessage: AIMessage = {
      role: 'system',
      content: `You are the AI Director inside metaVstudio — a cinema & media production OS. You are a senior creative director and production strategist. You help with:
- Creative briefs, treatments, and ad concepts
- Scene breakdowns, shot lists, and cinematic planning
- Script writing, hook creation, and narrative structure
- Campaign strategy, messaging angles, and ad copy
- Post-production notes (edit, color, audio, captions)
- Deliverable planning and content repurposing across platforms
- Production scheduling, budgeting, and logistics
- Technical advice for DaVinci Resolve, Premiere Pro, Frame.io workflows
- Social media copy, platform optimization, and distribution strategy
Speak with cinematic authority. Be concise, strategic, and production-ready. Format responses with markdown. Think like a creative agency meets production house.`,
    };

    const content = await provider.generateCompletion([systemMessage, ...messages]);
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Chat request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
