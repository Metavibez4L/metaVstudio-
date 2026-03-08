import { NextResponse } from 'next/server';
import {
  getAllIntegrationHealth,
  getIntegrationHealth,
  runAppleScript,
  runShortcut,
  listShortcuts,
  executeOBS,
  getAvailablePresets,
  getExportJobs,
  getTaskDefinitionsByCategory,
  getTaskRuns,
  TASK_CATEGORY_LABELS,
  getDefaultWatchFolders,
  getRecentEvents,
} from '@/lib/integrations';
import type { IntegrationId, AppleScriptRequest, OBSRequest } from '@/lib/integrations';

/** GET /api/integrations — health + status for all integrations */
export async function GET() {
  const health = await getAllIntegrationHealth();
  const presets = getAvailablePresets();
  const exportJobs = getExportJobs();
  const taskCategories = getTaskDefinitionsByCategory();
  const taskRuns = getTaskRuns(20);
  const watchFolders = getDefaultWatchFolders();
  const watchEvents = getRecentEvents(20);

  return NextResponse.json({
    integrations: health,
    exportPresets: presets,
    exportJobs,
    agentTasks: {
      categories: Object.entries(taskCategories).map(([key, tasks]) => ({
        id: key,
        label: TASK_CATEGORY_LABELS[key as keyof typeof TASK_CATEGORY_LABELS],
        tasks,
      })),
      recentRuns: taskRuns,
    },
    folderWatch: { folders: watchFolders, recentEvents: watchEvents },
  });
}

/** POST /api/integrations — execute an integration action */
export async function POST(request: Request) {
  const body = await request.json();
  const { integration, action, ...params } = body as {
    integration: IntegrationId;
    action: string;
    [key: string]: unknown;
  };

  if (!integration || !action) {
    return NextResponse.json({ error: 'integration and action required' }, { status: 400 });
  }

  try {
    switch (integration) {
      case 'applescript': {
        const result = await runAppleScript(params as unknown as AppleScriptRequest);
        return NextResponse.json(result);
      }
      case 'shortcuts': {
        if (action === 'list') {
          const shortcuts = await listShortcuts();
          return NextResponse.json({ shortcuts });
        }
        const result = await runShortcut(
          params.name as string,
          params.input as string | undefined,
        );
        return NextResponse.json(result);
      }
      case 'obs': {
        const result = await executeOBS({ action: action as OBSRequest['action'], ...params } as OBSRequest);
        return NextResponse.json(result);
      }
      case 'folder-watcher': {
        // Status only via GET; start/stop requires server restart for now
        const health = await getIntegrationHealth('folder-watcher');
        return NextResponse.json(health);
      }
      case 'export-pipeline': {
        if (action === 'list-presets') {
          return NextResponse.json({ presets: getAvailablePresets() });
        }
        if (action === 'list-jobs') {
          return NextResponse.json({ jobs: getExportJobs() });
        }
        return NextResponse.json({ error: 'Use createExportJob + runExportJob for exports' }, { status: 400 });
      }
      case 'agent-tasks': {
        if (action === 'list') {
          return NextResponse.json({ categories: getTaskDefinitionsByCategory(), runs: getTaskRuns() });
        }
        return NextResponse.json({ error: 'Use /api/agents/invoke for task execution' }, { status: 400 });
      }
      default:
        return NextResponse.json({ error: `Unknown integration: ${integration}` }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Integration action failed' },
      { status: 500 },
    );
  }
}
