// ─── Agent Registry ────────────────────────────────────
// Central lookup for all production agents.
// Singleton — agents are instantiated once and reused.

import type { AgentRole, AgentTaskType, ProductionAgent } from './types';
import { TASK_AGENT_MAP } from './types';
import { ExecutiveProducerAgent } from './agents/executive-producer';
import { CreativeDirectorAgent } from './agents/creative-director';
import { ScriptArchitectAgent } from './agents/script-architect';
import { ShotPlannerAgent } from './agents/shot-planner';
import { PostSupervisorAgent } from './agents/post-supervisor';
import { CampaignStrategistAgent } from './agents/campaign-strategist';
import { AssetLibrarianAgent } from './agents/asset-librarian';

class AgentRegistry {
  private agents = new Map<AgentRole, ProductionAgent>();

  constructor() {
    this.register(new ExecutiveProducerAgent());
    this.register(new CreativeDirectorAgent());
    this.register(new ScriptArchitectAgent());
    this.register(new ShotPlannerAgent());
    this.register(new PostSupervisorAgent());
    this.register(new CampaignStrategistAgent());
    this.register(new AssetLibrarianAgent());
  }

  private register(agent: ProductionAgent): void {
    this.agents.set(agent.role, agent);
  }

  /** Get an agent by role */
  getAgent(role: AgentRole): ProductionAgent | undefined {
    return this.agents.get(role);
  }

  /** Get the agent responsible for a task type */
  getAgentForTask(taskType: AgentTaskType): ProductionAgent | undefined {
    const role = TASK_AGENT_MAP[taskType];
    if (!role) return undefined;
    return this.agents.get(role);
  }

  /** Get all registered agents */
  getAllAgents(): ProductionAgent[] {
    return Array.from(this.agents.values());
  }

  /** Get all agent roles */
  getRoles(): AgentRole[] {
    return Array.from(this.agents.keys());
  }

  /** Get available task types grouped by agent */
  getCapabilityMap(): Record<AgentRole, AgentTaskType[]> {
    const map: Record<string, AgentTaskType[]> = {};
    for (const [role, agent] of this.agents) {
      map[role] = agent.capabilities;
    }
    return map as Record<AgentRole, AgentTaskType[]>;
  }
}

// ─── Singleton ─────────────────────────────────────────

let _registry: AgentRegistry | null = null;

export function getAgentRegistry(): AgentRegistry {
  if (!_registry) {
    _registry = new AgentRegistry();
  }
  return _registry;
}
