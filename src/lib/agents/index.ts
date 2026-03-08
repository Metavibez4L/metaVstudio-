// ─── Agent System — Public API ─────────────────────────
// Single barrel export for the multi-agent production system.

// Types
export type {
  AgentRole,
  AgentTaskType,
  AgentTask,
  AgentResult,
  AgentResultStatus,
  AgentOutput,
  AgentInvokeRequest,
  OrchestrateRequest,
  OrchestratorPlan,
  OrchestratorStep,
  ProductionContext,
  ProductionAgent,
  HandoffRequest,
  // Output types
  ProductionRoadmapOutput,
  MilestonePlanOutput,
  StatusSummaryOutput,
  NextStepsOutput,
  CreativeBriefOutput,
  TreatmentOutput,
  CampaignConceptOutput,
  ScriptOutput,
  AdHooksOutput,
  CtaVariantsOutput,
  ShotListOutput,
  SceneBreakdownOutput,
  CoverageMapOutput,
  EditPlanOutput,
  DeliveryMatrixOutput,
  RevisionChecklistOutput,
  AdAngleMatrixOutput,
  AudienceVariantsOutput,
  PlatformCopyOutput,
  RepurposingPlanOutput,
  AssetMapOutput,
  GenericAgentOutput,
} from './types';

export {
  AGENT_ROLES,
  AGENT_DISPLAY_NAMES,
  TASK_AGENT_MAP,
} from './types';

// Registry
export { getAgentRegistry } from './registry';

// Context
export { buildProductionContext, serializeContext } from './context';

// Orchestrator
export {
  invokeAgent,
  orchestrate,
  getAgentDirectory,
  getTaskTypes,
  getOpenClawStatus,
} from './orchestrator';
export type { AgentInfo } from './orchestrator';

// OpenClaw integration
export type { AgentExecutionMode } from './base-agent';
export {
  isOpenClawAvailable,
  checkGatewayHealth,
  getOpenClawConfig,
  spawnAgentRun,
  listSessions,
  getSessionStatus,
} from './openclaw-client';
export type { OpenClawConfig, OpenClawSpawnRequest, OpenClawSpawnResult } from './openclaw-client';
