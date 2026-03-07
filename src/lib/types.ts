// ═══════════════════════════════════════════════════════
// metaVstudio — AI Cinema & Media Production OS
// Domain Models & Type Definitions
// ═══════════════════════════════════════════════════════

// ─── Production Status (12-stage pipeline) ─────────────

export type ProductionStatus =
  | 'concept'
  | 'briefing'
  | 'pre_production'
  | 'scheduled'
  | 'in_production'
  | 'ingested'
  | 'editing'
  | 'review'
  | 'revision'
  | 'final_delivery'
  | 'published'
  | 'archived';

// ─── Legacy Project Status (kept for backward compat) ──

export type ProjectStatus =
  | 'idea'
  | 'planning'
  | 'recording'
  | 'editing'
  | 'ready_to_publish'
  | 'published'
  | 'archived';

export type ProjectType =
  | 'tutorial'
  | 'promo'
  | 'explainer'
  | 'demo'
  | 'social_clip'
  | 'livestream'
  | 'whiteboard';

// ─── Production Types ──────────────────────────────────

export type ProductionType =
  | 'commercial'
  | 'brand_film'
  | 'product_film'
  | 'promo'
  | 'trailer'
  | 'short_film'
  | 'documentary'
  | 'social_ad'
  | 'music_video'
  | 'pitch_video'
  | 'tutorial'
  | 'explainer'
  | 'campaign'
  | 'launch_video'
  | 'bts'
  | 'other';

export type Platform =
  | 'youtube'
  | 'x'
  | 'tiktok'
  | 'instagram'
  | 'linkedin'
  | 'meta_ads'
  | 'youtube_ads'
  | 'tiktok_ads'
  | 'website'
  | 'email';

// ─── Deliverable Types ─────────────────────────────────

export type DeliverableType =
  | 'hero_film'
  | 'short_ad'
  | 'vertical_cutdown'
  | 'social_clip'
  | 'teaser'
  | 'trailer'
  | 'bts'
  | 'still_pull'
  | 'announcement'
  | 'podcast_clip'
  | 'gif'
  | 'other';

export type DeliverableStatus =
  | 'planned'
  | 'in_progress'
  | 'in_review'
  | 'approved'
  | 'delivered';

// ─── Shot & Scene Types ────────────────────────────────

export type ShotType =
  | 'wide'
  | 'medium'
  | 'close_up'
  | 'extreme_close_up'
  | 'over_shoulder'
  | 'pov'
  | 'aerial'
  | 'insert'
  | 'cutaway'
  | 'b_roll'
  | 'establishing'
  | 'tracking'
  | 'static'
  | 'handheld';

export type CameraMovement =
  | 'static'
  | 'pan'
  | 'tilt'
  | 'dolly'
  | 'truck'
  | 'crane'
  | 'handheld'
  | 'steadicam'
  | 'gimbal'
  | 'zoom'
  | 'rack_focus'
  | 'whip_pan'
  | 'orbit';

// ─── Asset Types (expanded) ────────────────────────────

export type AssetType =
  | 'script'
  | 'thumbnail'
  | 'raw_capture'
  | 'export'
  | 'caption'
  | 'reference'
  | 'other'
  | 'raw_footage'
  | 'audio'
  | 'music'
  | 'storyboard_ref'
  | 'treatment_doc'
  | 'shot_reference'
  | 'cut_version'
  | 'subtitle'
  | 'poster'
  | 'campaign_asset'
  | 'moodboard';

// ═══════════════════════════════════════════════════════
// Core Entities
// ═══════════════════════════════════════════════════════

// ─── Production Project (primary entity) ───────────────

export interface ProductionProject {
  id: string;
  title: string;
  type: ProductionType;
  status: ProductionStatus;
  client: string;
  description: string;
  targetPlatform: Platform | null;
  budget: string;
  dueDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Creative Brief ────────────────────────────────────

export interface CreativeBrief {
  id: string;
  productionId: string;
  title: string;
  objective: string;
  targetAudience: string;
  keyMessage: string;
  tone: string;
  visualDirection: string;
  references: string;
  deliverables: string;
  constraints: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Campaign ──────────────────────────────────────────

export interface Campaign {
  id: string;
  productionId: string;
  name: string;
  objective: string;
  channels: string;
  targetAudience: string;
  hooks: string;
  ctaVariants: string;
  messagingAngles: string;
  adCopy: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// ─── Deliverable ───────────────────────────────────────

export interface Deliverable {
  id: string;
  productionId: string;
  title: string;
  type: DeliverableType;
  platform: Platform | null;
  format: string;
  duration: string;
  status: DeliverableStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Scene ─────────────────────────────────────────────

export interface Scene {
  id: string;
  productionId: string;
  sceneNumber: number;
  title: string;
  description: string;
  location: string;
  timeOfDay: string;
  notes: string;
  sortOrder: number;
  createdAt: string;
}

// ─── Shot ──────────────────────────────────────────────

export interface Shot {
  id: string;
  sceneId: string;
  productionId: string;
  shotNumber: number;
  shotType: ShotType;
  framing: string;
  movement: CameraMovement;
  lens: string;
  lightingMood: string;
  location: string;
  subjectAction: string;
  dialogue: string;
  purpose: string;
  platformNotes: string;
  sortOrder: number;
  createdAt: string;
}

// ─── Storyboard Frame ──────────────────────────────────

export interface StoryboardFrame {
  id: string;
  productionId: string;
  sceneId: string | null;
  frameNumber: number;
  description: string;
  cameraNote: string;
  dialogue: string;
  imageRef: string;
  imagePrompt: string;
  sortOrder: number;
  createdAt: string;
}

// ─── Edit Version (post-production) ────────────────────

export interface EditVersion {
  id: string;
  productionId: string;
  deliverableId: string | null;
  versionNumber: number;
  cutType: string;
  selectsNotes: string;
  musicNotes: string;
  sfxNotes: string;
  voNotes: string;
  colorNotes: string;
  captionNotes: string;
  status: 'in_progress' | 'in_review' | 'approved' | 'rejected';
  notes: string;
  createdAt: string;
}

// ─── Production Note ───────────────────────────────────

export interface ProductionNote {
  id: string;
  productionId: string;
  category: 'general' | 'talent' | 'location' | 'gear' | 'schedule' | 'creative' | 'post';
  content: string;
  createdAt: string;
}

// ─── Legacy Project (preserved) ────────────────────────

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  description: string;
  targetPlatform: Platform | null;
  dueDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  filePath: string;
  type: AssetType;
  notes: string;
  tags: string;
  createdAt: string;
}

export interface ContentDraft {
  id: string;
  projectId: string;
  type: 'hook' | 'script' | 'outline' | 'shot_list' | 'thumbnail_idea' | 'post_copy' | 'cta'
    | 'creative_brief' | 'treatment' | 'ad_concept' | 'scene_breakdown' | 'edit_notes'
    | 'delivery_checklist' | 'repurposing_plan';
  content: string;
  platform: Platform | null;
  createdAt: string;
}

export interface WorkflowTemplate {
  id: string;
  tool: 'screen_studio' | 'obs' | 'excalidraw' | 'davinci' | 'premiere' | 'frameio';
  projectId: string | null;
  checklist: WorkflowChecklistItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  phase: 'pre' | 'during' | 'post';
}

export interface CreatorPreference {
  key: string;
  value: string;
  updatedAt: string;
}

export interface PublishPrep {
  id: string;
  projectId: string;
  platform: Platform;
  title: string;
  description: string;
  caption: string;
  hashtags: string;
  cta: string;
  createdAt: string;
  updatedAt: string;
}

// ─── AI Types ──────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIGenerateRequest {
  type: ContentDraft['type'];
  projectContext?: {
    title: string;
    type: ProductionType | ProjectType;
    description: string;
    targetPlatform: Platform | null;
    notes: string;
  };
  additionalInstructions?: string;
  platform?: Platform;
}

// ═══════════════════════════════════════════════════════
// Display Constants
// ═══════════════════════════════════════════════════════

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  concept: 'Concept',
  briefing: 'Briefing',
  pre_production: 'Pre-Production',
  scheduled: 'Scheduled',
  in_production: 'In Production',
  ingested: 'Ingested',
  editing: 'Editing',
  review: 'Review',
  revision: 'Revision',
  final_delivery: 'Final Delivery',
  published: 'Published',
  archived: 'Archived',
};

export const PRODUCTION_STATUS_COLORS: Record<ProductionStatus, string> = {
  concept: 'bg-purple-500/20 text-[#bf5af2] shadow-[inset_0_0_8px_rgba(191,90,242,0.1)]',
  briefing: 'bg-cyan-500/15 text-[#00f0ff] shadow-[inset_0_0_8px_rgba(0,240,255,0.1)]',
  pre_production: 'bg-blue-500/15 text-[#4da6ff] shadow-[inset_0_0_8px_rgba(77,166,255,0.1)]',
  scheduled: 'bg-indigo-500/15 text-indigo-300 shadow-[inset_0_0_8px_rgba(129,140,248,0.1)]',
  in_production: 'bg-red-500/15 text-[#ff3366] shadow-[inset_0_0_8px_rgba(255,51,102,0.1)]',
  ingested: 'bg-orange-500/15 text-orange-300 shadow-[inset_0_0_8px_rgba(251,146,60,0.1)]',
  editing: 'bg-yellow-500/15 text-[#ffb800] shadow-[inset_0_0_8px_rgba(255,184,0,0.1)]',
  review: 'bg-amber-500/15 text-amber-300 shadow-[inset_0_0_8px_rgba(252,211,77,0.1)]',
  revision: 'bg-rose-500/15 text-rose-300 shadow-[inset_0_0_8px_rgba(251,113,133,0.1)]',
  final_delivery: 'bg-green-500/15 text-[#39ff14] shadow-[inset_0_0_8px_rgba(57,255,20,0.1)]',
  published: 'bg-emerald-500/15 text-emerald-300 shadow-[inset_0_0_8px_rgba(52,211,153,0.1)]',
  archived: 'bg-zinc-500/15 text-zinc-500 shadow-[inset_0_0_8px_rgba(113,113,122,0.05)]',
};

export const PRODUCTION_TYPE_LABELS: Record<ProductionType, string> = {
  commercial: 'Commercial',
  brand_film: 'Brand Film',
  product_film: 'Product Film',
  promo: 'Promo',
  trailer: 'Trailer',
  short_film: 'Short Film',
  documentary: 'Documentary',
  social_ad: 'Social Ad',
  music_video: 'Music Video',
  pitch_video: 'Pitch Video',
  tutorial: 'Tutorial',
  explainer: 'Explainer',
  campaign: 'Campaign',
  launch_video: 'Launch Video',
  bts: 'Behind the Scenes',
  other: 'Other',
};

export const DELIVERABLE_TYPE_LABELS: Record<DeliverableType, string> = {
  hero_film: 'Hero Film',
  short_ad: 'Short Ad',
  vertical_cutdown: 'Vertical Cutdown',
  social_clip: 'Social Clip',
  teaser: 'Teaser',
  trailer: 'Trailer',
  bts: 'Behind the Scenes',
  still_pull: 'Still Pull',
  announcement: 'Announcement',
  podcast_clip: 'Podcast Clip',
  gif: 'GIF',
  other: 'Other',
};

export const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  wide: 'Wide',
  medium: 'Medium',
  close_up: 'Close-Up',
  extreme_close_up: 'Extreme Close-Up',
  over_shoulder: 'Over the Shoulder',
  pov: 'POV',
  aerial: 'Aerial',
  insert: 'Insert',
  cutaway: 'Cutaway',
  b_roll: 'B-Roll',
  establishing: 'Establishing',
  tracking: 'Tracking',
  static: 'Static',
  handheld: 'Handheld',
};

export const CAMERA_MOVEMENT_LABELS: Record<CameraMovement, string> = {
  static: 'Static',
  pan: 'Pan',
  tilt: 'Tilt',
  dolly: 'Dolly',
  truck: 'Truck',
  crane: 'Crane',
  handheld: 'Handheld',
  steadicam: 'Steadicam',
  gimbal: 'Gimbal',
  zoom: 'Zoom',
  rack_focus: 'Rack Focus',
  whip_pan: 'Whip Pan',
  orbit: 'Orbit',
};

// Legacy display constants (preserved)
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: 'Idea',
  planning: 'Planning',
  recording: 'Recording',
  editing: 'Editing',
  ready_to_publish: 'Ready to Publish',
  published: 'Published',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  idea: 'bg-purple-500/20 text-[#bf5af2] shadow-[inset_0_0_8px_rgba(191,90,242,0.1)]',
  planning: 'bg-cyan-500/15 text-[#00f0ff] shadow-[inset_0_0_8px_rgba(0,240,255,0.1)]',
  recording: 'bg-red-500/15 text-[#ff3366] shadow-[inset_0_0_8px_rgba(255,51,102,0.1)]',
  editing: 'bg-yellow-500/15 text-[#ffb800] shadow-[inset_0_0_8px_rgba(255,184,0,0.1)]',
  ready_to_publish: 'bg-green-500/15 text-[#39ff14] shadow-[inset_0_0_8px_rgba(57,255,20,0.1)]',
  published: 'bg-emerald-500/15 text-emerald-300 shadow-[inset_0_0_8px_rgba(52,211,153,0.1)]',
  archived: 'bg-zinc-500/15 text-zinc-500 shadow-[inset_0_0_8px_rgba(113,113,122,0.05)]',
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  tutorial: 'Tutorial',
  promo: 'Promo',
  explainer: 'Explainer',
  demo: 'Demo',
  social_clip: 'Social Clip',
  livestream: 'Livestream',
  whiteboard: 'Whiteboard',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  x: 'X',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  meta_ads: 'Meta Ads',
  youtube_ads: 'YouTube Ads',
  tiktok_ads: 'TikTok Ads',
  website: 'Website',
  email: 'Email',
};
