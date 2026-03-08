import { NextResponse } from 'next/server';
import { getAgentDirectory, getTaskTypes, getOpenClawStatus } from '@/lib/agents';

/**
 * GET /api/agents/directory
 *
 * Returns the full agent roster, capabilities, hierarchy,
 * OpenClaw gateway status, and per-agent tool profiles.
 */
export async function GET() {
  const agents = getAgentDirectory();
  const taskTypes = getTaskTypes();
  const openclaw = await getOpenClawStatus();

  return NextResponse.json({
    agents,
    taskTypes,
    hierarchy: {
      orchestrator: 'executive-producer',
      specialists: [
        'creative-director',
        'script-architect',
        'shot-planner',
        'post-supervisor',
        'campaign-strategist',
        'asset-librarian',
      ],
    },
    execution: {
      mode: openclaw.mode,
      openclawAvailable: openclaw.available,
      gateway: openclaw.gateway,
      toolProfiles: {
        'executive-producer': { profile: 'full', tools: ['sessions', 'memory', 'fs', 'web', 'runtime', 'image'] },
        'creative-director': { profile: 'coding', tools: ['fs', 'web', 'memory', 'image', 'browser'] },
        'script-architect': { profile: 'coding', tools: ['fs', 'web', 'memory'] },
        'shot-planner': { profile: 'coding', tools: ['fs', 'web', 'memory', 'image'] },
        'post-supervisor': { profile: 'coding', tools: ['fs', 'runtime', 'web', 'memory', 'pdf'] },
        'campaign-strategist': { profile: 'coding', tools: ['fs', 'web', 'memory', 'browser'] },
        'asset-librarian': { profile: 'coding', tools: ['fs', 'runtime', 'memory', 'image'] },
      },
    },
  });
}
