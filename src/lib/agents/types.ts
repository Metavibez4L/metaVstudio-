// ─── Multi-Agent Production System — Core Types ───────
// Disciplined production team with clear roles, boundaries,
// handoffs, and structured outputs.

import type {
  ProductionProject,
  CreativeBrief,
  Campaign,
  Deliverable,
  Scene,
  Shot,
  StoryboardFrame,
  EditVersion,
  ProductionNote,
  ProductionStatus,
  ProductionType,
  Platform,
  DeliverableType,
  ShotType,
  CameraMovement,
  Asset,
} from '../types';

// ─── Agent Roles ───────────────────────────────────────

export type AgentRole =
  | 'executive-producer'
  | 'creative-director'
  | 'script-architect'
  | 'shot-planner'
  | 'post-supervisor'
  | 'campaign-strategist'
  | 'asset-librarian';

export const AGENT_ROLES: AgentRole[] = [
  'executive-producer',
  'creative-director',
  'script-architect',
  'shot-planner',
  'post-supervisor',
  'campaign-strategist',
  'asset-librarian',
];

export const AGENT_DISPLAY_NAMES: Record<AgentRole, string> = {
  'executive-producer': 'Executive Producer',
  'creative-director': 'Creative Director',
  'script-architect': 'Script Architect',
  'shot-planner': 'Shot Planner',
  'post-supervisor': 'Post Supervisor',
  'campaign-strategist': 'Campaign Strategist',
  'asset-librarian': 'Asset Librarian',
};

// ─── Production Context ────────────────────────────────
// Full snapshot of a production's state, passed to agents.

export interface ProductionContext {
  production: ProductionProject;
  briefs: CreativeBrief[];
  campaigns: Campaign[];
  deliverables: Deliverable[];
  scenes: Scene[];
  shots: Shot[];
  storyboardFrames: StoryboardFrame[];
  editVersions: EditVersion[];
  notes: ProductionNote[];
  assets: Asset[];
}

// ─── Agent Task Types ──────────────────────────────────
// Each maps to a specific agent capability.

export type AgentTaskType =
  // Executive Producer
  | 'production-roadmap'
  | 'milestone-plan'
  | 'task-routing'
  | 'status-summary'
  | 'blocker-report'
  | 'next-steps'
  // Creative Director
  | 'creative-brief'
  | 'treatment'
  | 'campaign-concept'
  | 'brand-story'
  | 'tone-direction'
  | 'visual-language'
  // Script Architect
  | 'hero-script'
  | 'promo-script'
  | 'short-form-script'
  | 'ad-hooks'
  | 'voiceover-draft'
  | 'cta-variants'
  | 'platform-script'
  // Shot Planner
  | 'shot-list'
  | 'scene-breakdown'
  | 'visual-plan'
  | 'camera-notes'
  | 'coverage-map'
  | 'broll-plan'
  // Post Supervisor
  | 'edit-plan'
  | 'revision-checklist'
  | 'delivery-matrix'
  | 'export-list'
  | 'post-notes'
  // Campaign Strategist
  | 'ad-angle-matrix'
  | 'audience-variants'
  | 'platform-copy'
  | 'campaign-rollout'
  | 'repurposing-plan'
  | 'cta-tree'
  // Asset Librarian
  | 'asset-map'
  | 'tag-structure'
  | 'naming-convention'
  | 'linked-assets';

// Map task types to their responsible agent
export const TASK_AGENT_MAP: Record<AgentTaskType, AgentRole> = {
  'production-roadmap': 'executive-producer',
  'milestone-plan': 'executive-producer',
  'task-routing': 'executive-producer',
  'status-summary': 'executive-producer',
  'blocker-report': 'executive-producer',
  'next-steps': 'executive-producer',
  'creative-brief': 'creative-director',
  'treatment': 'creative-director',
  'campaign-concept': 'creative-director',
  'brand-story': 'creative-director',
  'tone-direction': 'creative-director',
  'visual-language': 'creative-director',
  'hero-script': 'script-architect',
  'promo-script': 'script-architect',
  'short-form-script': 'script-architect',
  'ad-hooks': 'script-architect',
  'voiceover-draft': 'script-architect',
  'cta-variants': 'script-architect',
  'platform-script': 'script-architect',
  'shot-list': 'shot-planner',
  'scene-breakdown': 'shot-planner',
  'visual-plan': 'shot-planner',
  'camera-notes': 'shot-planner',
  'coverage-map': 'shot-planner',
  'broll-plan': 'shot-planner',
  'edit-plan': 'post-supervisor',
  'revision-checklist': 'post-supervisor',
  'delivery-matrix': 'post-supervisor',
  'export-list': 'post-supervisor',
  'post-notes': 'post-supervisor',
  'ad-angle-matrix': 'campaign-strategist',
  'audience-variants': 'campaign-strategist',
  'platform-copy': 'campaign-strategist',
  'campaign-rollout': 'campaign-strategist',
  'repurposing-plan': 'campaign-strategist',
  'cta-tree': 'campaign-strategist',
  'asset-map': 'asset-librarian',
  'tag-structure': 'asset-librarian',
  'naming-convention': 'asset-librarian',
  'linked-assets': 'asset-librarian',
};

// ─── Agent Task ────────────────────────────────────────

export interface AgentTask {
  id: string;
  type: AgentTaskType;
  /** Natural language goal from user or orchestrator */
  goal: string;
  /** Full production context snapshot */
  productionContext?: ProductionContext;
  /** Target platform (when relevant) */
  platform?: Platform;
  /** Additional instructions or constraints */
  instructions?: string;
  /** Parent task ID if this was spawned by orchestrator */
  parentTaskId?: string;
  /** Priority level */
  priority: 'low' | 'normal' | 'high' | 'critical';
  createdAt: string;
}

// ─── Agent Result ──────────────────────────────────────

export type AgentResultStatus = 'success' | 'partial' | 'failed' | 'needs-handoff';

export interface AgentResult {
  taskId: string;
  agentRole: AgentRole;
  status: AgentResultStatus;
  /** Structured output from the agent */
  output: AgentOutput;
  /** If this result triggers work for another agent */
  handoffs: HandoffRequest[];
  /** Execution metadata */
  meta: {
    startedAt: string;
    completedAt: string;
    tokenEstimate?: number;
    model?: string;
  };
}

// ─── Handoff Protocol ──────────────────────────────────
// When one agent needs another agent to continue work.

export interface HandoffRequest {
  fromAgent: AgentRole;
  toAgent: AgentRole;
  taskType: AgentTaskType;
  goal: string;
  /** Context from the originating agent's work */
  context: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

// ─── Structured Output Types ───────────────────────────
// Each agent produces typed, reusable outputs.

export type AgentOutput =
  | ProductionRoadmapOutput
  | MilestonePlanOutput
  | StatusSummaryOutput
  | NextStepsOutput
  | CreativeBriefOutput
  | TreatmentOutput
  | CampaignConceptOutput
  | ScriptOutput
  | AdHooksOutput
  | CtaVariantsOutput
  | ShotListOutput
  | SceneBreakdownOutput
  | CoverageMapOutput
  | EditPlanOutput
  | DeliveryMatrixOutput
  | RevisionChecklistOutput
  | AdAngleMatrixOutput
  | AudienceVariantsOutput
  | PlatformCopyOutput
  | RepurposingPlanOutput
  | AssetMapOutput
  | GenericAgentOutput;

// ─── Executive Producer Outputs ────────────────────────

export interface ProductionRoadmapOutput {
  kind: 'production-roadmap';
  phases: Array<{
    name: string;
    status: ProductionStatus;
    tasks: string[];
    dependencies: string[];
    estimatedDuration: string;
  }>;
  criticalPath: string[];
  summary: string;
}

export interface MilestonePlanOutput {
  kind: 'milestone-plan';
  milestones: Array<{
    name: string;
    description: string;
    deliverables: string[];
    assignedTo: AgentRole[];
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  }>;
  summary: string;
}

export interface StatusSummaryOutput {
  kind: 'status-summary';
  overallStatus: string;
  completedItems: string[];
  inProgressItems: string[];
  blockers: string[];
  nextPriorities: string[];
  summary: string;
}

export interface NextStepsOutput {
  kind: 'next-steps';
  immediate: Array<{ action: string; assignedTo: AgentRole; reason: string }>;
  upcoming: Array<{ action: string; assignedTo: AgentRole; reason: string }>;
  summary: string;
}

// ─── Creative Director Outputs ─────────────────────────

export interface CreativeBriefOutput {
  kind: 'creative-brief';
  objective: string;
  targetAudience: string;
  keyMessage: string;
  tone: string;
  visualDirection: string;
  references: string[];
  deliverables: string[];
  constraints: string[];
  summary: string;
}

export interface TreatmentOutput {
  kind: 'treatment';
  title: string;
  logline: string;
  visualStyle: string;
  narrativeApproach: string;
  moodAndTone: string;
  pacing: string;
  colorPalette: string;
  musicDirection: string;
  keyMoments: Array<{ moment: string; description: string; visualNote: string }>;
  summary: string;
}

export interface CampaignConceptOutput {
  kind: 'campaign-concept';
  conceptName: string;
  bigIdea: string;
  messagingPillars: string[];
  visualIdentity: string;
  channels: Platform[];
  variations: Array<{ name: string; angle: string; hook: string }>;
  summary: string;
}

// ─── Script Architect Outputs ──────────────────────────

export interface ScriptOutput {
  kind: 'script';
  title: string;
  format: 'hero' | 'promo' | 'short-form' | 'voiceover' | 'platform';
  targetDuration: string;
  targetPlatform?: Platform;
  scenes: Array<{
    sceneNumber: number;
    location: string;
    action: string;
    dialogue: string;
    visualNote: string;
    duration: string;
  }>;
  summary: string;
}

export interface AdHooksOutput {
  kind: 'ad-hooks';
  hooks: Array<{
    text: string;
    style: 'question' | 'statement' | 'statistic' | 'story' | 'challenge' | 'contrast';
    targetEmotion: string;
    platform?: Platform;
  }>;
  summary: string;
}

export interface CtaVariantsOutput {
  kind: 'cta-variants';
  variants: Array<{
    text: string;
    type: 'soft' | 'medium' | 'hard';
    placement: 'opening' | 'mid' | 'closing' | 'overlay';
    platform?: Platform;
  }>;
  summary: string;
}

// ─── Shot Planner Outputs ──────────────────────────────

export interface ShotListOutput {
  kind: 'shot-list';
  shots: Array<{
    shotNumber: number;
    sceneRef: string;
    shotType: ShotType;
    framing: string;
    movement: CameraMovement;
    lens: string;
    lighting: string;
    subjectAction: string;
    purpose: string;
    duration: string;
  }>;
  summary: string;
}

export interface SceneBreakdownOutput {
  kind: 'scene-breakdown';
  scenes: Array<{
    sceneNumber: number;
    title: string;
    intExt: 'INT' | 'EXT' | 'INT/EXT';
    location: string;
    timeOfDay: string;
    description: string;
    talent: string[];
    props: string[];
    keyActions: string[];
    estimatedDuration: string;
  }>;
  summary: string;
}

export interface CoverageMapOutput {
  kind: 'coverage-map';
  scenes: Array<{
    sceneRef: string;
    requiredAngles: string[];
    bRoll: string[];
    safetyShots: string[];
    priorityOrder: string[];
  }>;
  totalSetups: number;
  summary: string;
}

// ─── Post Supervisor Outputs ───────────────────────────

export interface EditPlanOutput {
  kind: 'edit-plan';
  stages: Array<{
    name: string;
    description: string;
    tasks: string[];
    deliverableRef?: string;
  }>;
  timeline: string;
  summary: string;
}

export interface DeliveryMatrixOutput {
  kind: 'delivery-matrix';
  deliverables: Array<{
    title: string;
    type: DeliverableType;
    platform: Platform;
    format: string;
    aspectRatio: string;
    duration: string;
    specs: string;
    status: 'pending' | 'in-progress' | 'delivered';
  }>;
  summary: string;
}

export interface RevisionChecklistOutput {
  kind: 'revision-checklist';
  items: Array<{
    category: 'picture' | 'audio' | 'color' | 'graphics' | 'captions' | 'delivery';
    item: string;
    status: 'pending' | 'done';
    notes: string;
  }>;
  summary: string;
}

// ─── Campaign Strategist Outputs ───────────────────────

export interface AdAngleMatrixOutput {
  kind: 'ad-angle-matrix';
  angles: Array<{
    name: string;
    messagingAngle: string;
    targetSegment: string;
    hook: string;
    proof: string;
    cta: string;
  }>;
  summary: string;
}

export interface AudienceVariantsOutput {
  kind: 'audience-variants';
  variants: Array<{
    audienceSegment: string;
    painPoint: string;
    desiredOutcome: string;
    messagingApproach: string;
    hookStyle: string;
    toneShift: string;
  }>;
  summary: string;
}

export interface PlatformCopyOutput {
  kind: 'platform-copy';
  platforms: Array<{
    platform: Platform;
    headline: string;
    body: string;
    hashtags: string[];
    cta: string;
    specs: string;
  }>;
  summary: string;
}

export interface RepurposingPlanOutput {
  kind: 'repurposing-plan';
  sourceAsset: string;
  derivatives: Array<{
    title: string;
    platform: Platform;
    format: string;
    duration: string;
    hook: string;
    editNotes: string;
  }>;
  postingCadence: string;
  summary: string;
}

// ─── Asset Librarian Outputs ───────────────────────────

export interface AssetMapOutput {
  kind: 'asset-map';
  categories: Array<{
    category: string;
    assets: Array<{
      name: string;
      type: string;
      linkedTo: string[];
      tags: string[];
    }>;
  }>;
  namingConvention: string;
  summary: string;
}

// ─── Generic fallback output ───────────────────────────

export interface GenericAgentOutput {
  kind: 'generic';
  content: string;
  summary: string;
}

// ─── Agent Interface ───────────────────────────────────
// Every production agent implements this contract.

export interface ProductionAgent {
  readonly role: AgentRole;
  readonly displayName: string;
  readonly description: string;
  /** Task types this agent can handle */
  readonly capabilities: AgentTaskType[];

  /** Check if this agent can handle a given task */
  canHandle(taskType: AgentTaskType): boolean;

  /** Execute a task and return structured output */
  execute(task: AgentTask, mode?: 'direct' | 'openclaw' | 'auto'): Promise<AgentResult>;
}

// ─── Orchestrator Types ────────────────────────────────

export interface OrchestratorPlan {
  goal: string;
  productionId?: string;
  steps: OrchestratorStep[];
  createdAt: string;
}

export interface OrchestratorStep {
  order: number;
  agentRole: AgentRole;
  taskType: AgentTaskType;
  goal: string;
  dependsOn: number[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  resultId?: string;
}

// ─── Invocation Request (API contract) ─────────────────

export interface AgentInvokeRequest {
  /** Specific task type — routes to correct agent */
  taskType: AgentTaskType;
  /** Natural language goal */
  goal: string;
  /** Production ID to load context from */
  productionId?: string;
  /** Target platform */
  platform?: Platform;
  /** Extra instructions */
  instructions?: string;
  /** Execution mode: 'direct' (Ollama), 'openclaw' (gateway + tools), 'auto' (detect) */
  mode?: 'direct' | 'openclaw' | 'auto';
}

export interface OrchestrateRequest {
  /** High-level user goal — EP will decompose */
  goal: string;
  /** Production ID to load context from */
  productionId?: string;
  /** Priority */
  priority?: 'low' | 'normal' | 'high' | 'critical';
  /** Execution mode: 'direct' (Ollama), 'openclaw' (gateway + tools), 'auto' (detect) */
  mode?: 'direct' | 'openclaw' | 'auto';
}
