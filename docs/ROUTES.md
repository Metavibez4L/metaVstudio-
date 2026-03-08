# Routes & Pages

> metaVstudio — All application routes

---

## Route Map

```
○ = Static (prerendered)
ƒ = Dynamic (server-rendered on demand)
```

| Route | Type | Component | Description |
|-------|------|-----------|-------------|
| `/` | ○ Static | `page.tsx` | Redirect → `/dashboard` |
| `/dashboard` | ƒ Dynamic | `dashboard/page.tsx` | Production command center |

### Production System

| Route | Type | Component | Description |
|-------|------|-----------|-------------|
| `/productions` | ƒ Dynamic | `productions/page.tsx` | Production listing, 12-status filter bar |
| `/productions/[id]` | ƒ Dynamic | `productions/[id]/page.tsx` | Production detail: pipeline, stats, editor, deliverables, notes |
| `/briefs` | ƒ Dynamic | `briefs/page.tsx` | Creative briefs: objective, audience, messaging cards |
| `/shots` | ƒ Dynamic | `shots/page.tsx` | Scenes overview + shot list (type, movement, lens) |
| `/storyboards` | ƒ Dynamic | `storyboards/page.tsx` | Visual frame grid with aspect-ratio placeholders |
| `/deliverables` | ƒ Dynamic | `deliverables/page.tsx` | Delivery matrix with 5-status filter |
| `/campaigns` | ƒ Dynamic | `campaigns/page.tsx` | Campaign cards: objective, channels, hooks, status |
| `/post` | ƒ Dynamic | `post/page.tsx` | Edit versions: selects, music, SFX, VO, color, captions |
| `/assets` | ƒ Dynamic | `assets/page.tsx` | Cross-project asset library (100 recent) |
| `/assistant` | ○ Static | `assistant/page.tsx` | AI Director chat interface (client-side) |
| `/agents` | ƒ Dynamic | `agents/page.tsx` | Agent production team: hierarchy, status, capabilities |
| `/integrations` | ƒ Dynamic | `integrations/page.tsx` | Integration dashboard: 6 modules, health status, controls |
| `/settings` | ƒ Dynamic | `settings/page.tsx` | Creator preferences editor |

### Legacy System (Preserved)

| Route | Type | Component | Description |
|-------|------|-----------|-------------|
| `/projects` | ƒ Dynamic | `projects/page.tsx` | Legacy project listing |
| `/projects/[id]` | ƒ Dynamic | `projects/[id]/page.tsx` | Legacy project detail + assets + drafts |
| `/publish` | ƒ Dynamic | `publish/page.tsx` | Publish prep panel |
| `/workflows` | ○ Static | `workflows/page.tsx` | Workflow checklists |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/ai/chat` | POST | AI Director chat — streaming conversation |
| `/api/ai/generate` | POST | Content generation (14 types) |
| `/api/ai/publish` | POST | Publish-optimized copy generation |
| `/api/health` | GET | System health: DB, AI, storage, config status |
| `/api/preferences` | GET/PUT | Read and write creator preferences |
| `/api/agents/invoke` | POST | Agent invocation or EP-orchestrated execution. Supports `mode`: direct/openclaw/auto |
| `/api/agents/directory` | GET | Agent roster, capabilities, hierarchy, OpenClaw status + tool profiles |
| `/api/integrations` | GET | Integration health status for all 6 modules, export presets, active watchers |
| `/api/integrations` | POST | Execute integration actions (applescript, shortcuts, obs, folder-watcher, export, agent-tasks) |

---

## Navigation (Sidebar)

The sidebar provides 13 navigation items, organized by production workflow:

```
COMMAND          →  /dashboard      (LayoutDashboard)
PRODUCTIONS      →  /productions    (Film)
BRIEFS           →  /briefs         (FileText)
SHOTS            →  /shots          (Crosshair)
STORYBOARD       →  /storyboards    (FrameIcon)
DELIVERABLES     →  /deliverables   (Package)
CAMPAIGNS        →  /campaigns      (Megaphone)
POST             →  /post           (SlidersHorizontal)
AI DIRECTOR      →  /assistant      (Sparkles)
AGENTS           →  /agents         (Bot)
INTEGRATE        →  /integrations   (Plug)
ASSETS           →  /assets         (FolderOpen)
CONFIG           →  /settings       (Settings)
```

---

## Server Actions

### Production Actions (`production-actions.ts`)

| Action | Entity | Revalidates |
|--------|--------|-------------|
| `createProductionAction` | Production | `/productions`, `/dashboard` |
| `updateProductionAction` | Production | `/productions`, `/productions/[id]`, `/dashboard` |
| `deleteProductionAction` | Production | `/productions`, `/dashboard` |
| `createBriefAction` | Creative Brief | `/briefs`, `/productions/[id]` |
| `updateBriefAction` | Creative Brief | `/briefs`, `/productions/[id]` |
| `deleteBriefAction` | Creative Brief | `/briefs`, `/productions/[id]` |
| `createCampaignAction` | Campaign | `/campaigns`, `/productions/[id]` |
| `updateCampaignAction` | Campaign | `/campaigns`, `/productions/[id]` |
| `deleteCampaignAction` | Campaign | `/campaigns`, `/productions/[id]` |
| `createDeliverableAction` | Deliverable | `/deliverables`, `/productions/[id]` |
| `updateDeliverableAction` | Deliverable | `/deliverables`, `/productions/[id]` |
| `deleteDeliverableAction` | Deliverable | `/deliverables`, `/productions/[id]` |
| `createSceneAction` | Scene | `/shots`, `/productions/[id]` |
| `updateSceneAction` | Scene | `/shots`, `/productions/[id]` |
| `deleteSceneAction` | Scene | `/shots`, `/productions/[id]` |
| `createShotAction` | Shot | `/shots`, `/productions/[id]` |
| `updateShotAction` | Shot | `/shots` |
| `deleteShotAction` | Shot | `/shots` |
| `createFrameAction` | Storyboard Frame | `/storyboards`, `/productions/[id]` |
| `deleteFrameAction` | Storyboard Frame | `/storyboards` |
| `createEditVersionAction` | Edit Version | `/post`, `/productions/[id]` |
| `updateEditVersionAction` | Edit Version | `/post` |
| `deleteEditVersionAction` | Edit Version | `/post` |
| `createProductionNoteAction` | Production Note | `/productions/[id]` |
| `deleteProductionNoteAction` | Production Note | `/productions/[id]` |

### Legacy Actions (`actions.ts`)

| Action | Entity |
|--------|--------|
| `createProjectAction` | Project |
| `updateProjectAction` | Project |
| `deleteProjectAction` | Project |
| `createAssetAction` | Asset |
| `deleteAssetAction` | Asset |
| `createDraftAction` | Content Draft |
| `deleteDraftAction` | Content Draft |
| `saveWorkflowAction` | Workflow Template |
| `savePublishPrepAction` | Publish Prep |

---

## Query Parameters

| Route | Param | Values | Purpose |
|-------|-------|--------|---------|
| `/productions` | `status` | Any `ProductionStatus` or `all` | Filter productions by pipeline stage |
| `/deliverables` | `status` | `planned`, `in_progress`, `in_review`, `approved`, `delivered` | Filter by delivery status |
| `/projects` | `status` | Any `ProjectStatus` | Filter legacy projects |
