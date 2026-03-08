import { NextRequest, NextResponse } from 'next/server';
import { invokeAgent, orchestrate } from '@/lib/agents';
import type { AgentInvokeRequest, OrchestrateRequest } from '@/lib/agents';

/**
 * POST /api/agents/invoke
 *
 * Direct agent invocation — routes a task to the correct specialist agent.
 * Supports dual-mode execution:
 *   - mode: 'direct' — Ollama/OpenAI (no tools)
 *   - mode: 'openclaw' — OpenClaw gateway (agents get real tools: fs, exec, web, browser, image)
 *   - mode: 'auto' — detect OpenClaw gateway, fallback to direct
 *
 * Body: AgentInvokeRequest
 *   { taskType, goal, productionId?, platform?, instructions?, mode? }
 *
 * Returns: AgentResult
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = body.mode || undefined;

    // Determine if this is a direct invoke or orchestrated request
    if (body.taskType) {
      // Direct agent invocation
      const request: AgentInvokeRequest = {
        taskType: body.taskType,
        goal: body.goal || '',
        productionId: body.productionId,
        platform: body.platform,
        instructions: body.instructions,
        mode,
      };

      if (!request.goal) {
        return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
      }

      const result = await invokeAgent(request);
      return NextResponse.json(result);
    }

    if (body.orchestrate) {
      // Orchestrated multi-agent execution
      const request: OrchestrateRequest = {
        goal: body.goal || '',
        productionId: body.productionId,
        priority: body.priority,
        mode,
      };

      if (!request.goal) {
        return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
      }

      const result = await orchestrate(request);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Request must include either taskType (direct invoke) or orchestrate: true (EP-coordinated)' },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Agent invocation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
