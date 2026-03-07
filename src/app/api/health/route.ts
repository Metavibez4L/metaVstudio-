import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/config';
import { getAllServiceHealth } from '@/lib/services';

export async function GET() {
  const config = getConfig();

  const serviceHealth = await getAllServiceHealth();

  return NextResponse.json({
    status: 'ok',
    profile: config.profile,
    appName: config.appName,
    ai: {
      provider: config.ai.provider,
      model: config.ai.provider === 'ollama'
        ? config.ai.ollama.model
        : config.ai.openai.model,
    },
    runtime: {
      backgroundTasks: config.runtime.backgroundTasks,
      scheduledJobs: config.runtime.scheduledJobs,
      maxConcurrentAI: config.runtime.maxConcurrentAI,
      fileWatchers: config.runtime.fileWatchers,
    },
    services: serviceHealth,
    timestamp: new Date().toISOString(),
  });
}
