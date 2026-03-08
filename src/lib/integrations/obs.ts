// ─── OBS WebSocket Control ─────────────────────────────
// Control OBS Studio via its WebSocket protocol (v5).
// Commands: recording, streaming, scene switching, source toggling.
// Requires OBS with WebSocket server enabled (port 4455 default).

import { getConfig } from '../config';
import type { OBSAction, OBSRequest, OBSResult, OBSStatus } from './types';

/** Get the configured OBS WebSocket URL */
function getOBSUrl(): string {
  return getConfig().integrations.obsWebSocketUrl || 'ws://localhost:4455';
}

/**
 * Send a request to the OBS WebSocket server.
 * Uses the HTTP fallback (obs-websocket v5 also exposes a REST-like interface
 * on the same port via HTTP for simple commands).
 *
 * For full bidirectional WebSocket control, install obs-websocket-js.
 * This implementation uses fetch to the OBS WebSocket HTTP interface.
 */
async function obsRequest(requestType: string, requestData?: Record<string, unknown>): Promise<Record<string, unknown>> {
  const wsUrl = getOBSUrl();
  // Convert ws:// to http:// for the REST endpoint
  const httpUrl = wsUrl.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://');

  const body = {
    op: 6, // Request opcode
    d: {
      requestType,
      requestId: `mvs-${Date.now()}`,
      ...(requestData ? { requestData } : {}),
    },
  };

  const res = await fetch(httpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`OBS request failed: ${res.status}`);
  }

  return res.json();
}

/** Execute an OBS action */
export async function executeOBS(request: OBSRequest): Promise<OBSResult> {
  try {
    switch (request.action) {
      case 'get-status': {
        const status = await getOBSStatus();
        return { success: true, data: status as unknown as Record<string, unknown> };
      }
      case 'start-recording': {
        await obsRequest('StartRecord');
        return { success: true };
      }
      case 'stop-recording': {
        await obsRequest('StopRecord');
        return { success: true };
      }
      case 'start-streaming': {
        await obsRequest('StartStream');
        return { success: true };
      }
      case 'stop-streaming': {
        await obsRequest('StopStream');
        return { success: true };
      }
      case 'switch-scene': {
        if (!request.sceneName) return { success: false, error: 'sceneName required' };
        await obsRequest('SetCurrentProgramScene', { sceneName: request.sceneName });
        return { success: true };
      }
      case 'get-scenes': {
        const data = await obsRequest('GetSceneList');
        return { success: true, data };
      }
      case 'toggle-source': {
        if (!request.sceneName || !request.sourceName) {
          return { success: false, error: 'sceneName and sourceName required' };
        }
        await obsRequest('SetSceneItemEnabled', {
          sceneName: request.sceneName,
          sceneItemId: request.sourceName,
          sceneItemEnabled: request.visible ?? true,
        });
        return { success: true };
      }
      default:
        return { success: false, error: `Unknown action: ${request.action}` };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'OBS command failed' };
  }
}

/** Get OBS connection status */
export async function getOBSStatus(): Promise<OBSStatus> {
  try {
    const [recordStatus, streamStatus, sceneList] = await Promise.all([
      obsRequest('GetRecordStatus').catch(() => null),
      obsRequest('GetStreamStatus').catch(() => null),
      obsRequest('GetSceneList').catch(() => null),
    ]);

    return {
      connected: true,
      recording: !!(recordStatus as Record<string, unknown>)?.outputActive,
      streaming: !!(streamStatus as Record<string, unknown>)?.outputActive,
      currentScene: (sceneList as Record<string, unknown>)?.currentProgramSceneName as string | undefined,
      scenes: ((sceneList as Record<string, unknown>)?.scenes as Array<{ sceneName: string }> | undefined)?.map(s => s.sceneName),
    };
  } catch {
    return { connected: false, recording: false, streaming: false };
  }
}

/** Check if OBS WebSocket is reachable */
export async function isOBSAvailable(): Promise<boolean> {
  try {
    const status = await getOBSStatus();
    return status.connected;
  } catch {
    return false;
  }
}
