-- metaVstudio Database Seed Data
-- Realistic cinema & media production data

-- Productions (10 across pipeline stages)
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-001', 'Neon Horizons', 'brand_film', 'in_production', 'Horizon Tech', 'Cinematic brand film exploring AI-driven future cities', 'youtube', '$45,000', '2026-04-15', 'Principal photography in progress downtown LA', '2026-02-10T10:00:00Z', '2026-03-06T14:30:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-002', 'Pulse Drop', 'commercial', 'editing', 'Pulse Audio', '30-sec product reveal for wireless earbuds launch', 'instagram', '$12,000', '2026-03-20', 'A-roll complete, cutting selects', '2026-02-20T09:00:00Z', '2026-03-05T18:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-003', 'Glass & Steel', 'documentary', 'review', 'City Arts Council', 'Documentary on modern architecture and community spaces', 'vimeo', '$28,000', '2026-05-01', 'Rough cut delivered to client for feedback', '2026-01-15T08:00:00Z', '2026-03-04T11:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-004', 'Velocity', 'trailer', 'pre_production', 'Speed Studios', 'Teaser trailer for upcoming action series', 'youtube', '$18,000', '2026-04-30', 'Storyboards approved, casting underway', '2026-03-01T10:00:00Z', '2026-03-07T09:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-005', 'Bloom Campaign', 'campaign', 'concept', 'FloraVida', 'Spring product campaign - 6 social ads + hero film', 'tiktok', '$22,000', '2026-05-15', 'Initial brief from client received', '2026-03-05T16:00:00Z', '2026-03-07T08:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-006', 'Code & Canvas', 'tutorial', 'published', 'Internal', 'AI-assisted video editing tutorial series', 'youtube', '$3,500', '2026-02-28', 'Published 4-part series', '2025-12-01T10:00:00Z', '2026-02-28T12:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-007', 'Midnight Run BTS', 'bts', 'final_delivery', 'Midnight Productions', 'Behind-the-scenes featurette for indie film', NULL, '$8,000', '2026-03-10', 'Final master delivered, awaiting approval', '2026-01-20T14:00:00Z', '2026-03-06T17:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-008', 'Synth Wave', 'music_video', 'scheduled', 'DJ Aura', 'Music video with cyberpunk aesthetic and LED environments', 'youtube', '$15,000', '2026-04-05', 'Location locked, crew confirmed for April 2', '2026-02-25T11:00:00Z', '2026-03-06T10:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-009', 'LaunchPad 2026', 'launch_video', 'briefing', 'TechNova', 'Product launch keynote video for annual conference', NULL, '$35,000', '2026-06-01', 'Kickoff meeting completed, brief in progress', '2026-03-04T09:00:00Z', '2026-03-07T07:00:00Z');
INSERT INTO productions (id, title, type, status, client, description, target_platform, budget, due_date, notes, created_at, updated_at) VALUES
  ('prod-010', 'Urban Threads', 'social_ad', 'ingested', 'StreetStyle Co', 'Social media ad pack - 3 reels + 1 story', 'instagram', '$6,500', '2026-03-18', 'All footage ingested and proxied', '2026-02-18T13:00:00Z', '2026-03-05T15:00:00Z');

-- Legacy Projects (4)
INSERT INTO projects (id, title, type, status, description, target_platform, due_date, notes, created_at, updated_at) VALUES
  ('proj-001', 'AI Workflow Tutorial', 'tutorial', 'published', 'Step-by-step guide to AI-assisted video editing', 'youtube', '2026-01-15', 'Series complete', '2025-11-01T10:00:00Z', '2026-01-15T12:00:00Z');
INSERT INTO projects (id, title, type, status, description, target_platform, due_date, notes, created_at, updated_at) VALUES
  ('proj-002', 'Studio Setup Guide', 'explainer', 'editing', 'Home studio setup for content creators on a budget', 'youtube', '2026-03-25', 'Editing in DaVinci Resolve', '2026-01-10T08:00:00Z', '2026-03-05T14:00:00Z');
INSERT INTO projects (id, title, type, status, description, target_platform, due_date, notes, created_at, updated_at) VALUES
  ('proj-003', 'Product Promo Reel', 'promo', 'recording', 'Monthly product showcase compilation', 'instagram', '2026-03-30', 'Shooting remaining 3 products', '2026-02-15T09:00:00Z', '2026-03-06T11:00:00Z');
INSERT INTO projects (id, title, type, status, description, target_platform, due_date, notes, created_at, updated_at) VALUES
  ('proj-004', 'Quick Tips Series', 'social_clip', 'planning', 'Bite-sized editing tips for social media', 'tiktok', '2026-04-15', '12 episode outlines drafted', '2026-03-01T10:00:00Z', '2026-03-07T08:00:00Z');

-- Assets (7, linked to legacy projects)
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-001', 'proj-001', 'AI Workflow - Final Cut', '/media/exports/ai-workflow-final.mp4', 'video', 'Final export 4K', 'final,4k,tutorial', '2026-01-14T18:00:00Z');
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-002', 'proj-001', 'AI Workflow - Thumbnail', '/media/thumbnails/ai-workflow-thumb.png', 'image', 'YouTube thumbnail', 'thumbnail,youtube', '2026-01-14T19:00:00Z');
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-003', 'proj-002', 'Studio B-Roll Selects', '/media/footage/studio-broll-selects.mov', 'video', 'B-roll package for studio guide', 'broll,studio', '2026-03-04T16:00:00Z');
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-004', 'proj-003', 'Product Shots Pack', '/media/footage/product-shots-march.mov', 'video', 'March product shoot raw footage', 'raw,products', '2026-03-06T10:00:00Z');
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-005', 'proj-002', 'Voiceover Script v2', '/media/scripts/studio-vo-script-v2.pdf', 'document', 'Approved voiceover script', 'script,approved', '2026-03-05T12:00:00Z');
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-006', 'proj-004', 'Quick Tips - Episode Outlines', '/media/scripts/quick-tips-outlines.md', 'document', '12 episode content outlines', 'outlines,planning', '2026-03-07T07:00:00Z');
INSERT INTO assets (id, project_id, name, file_path, type, notes, tags, created_at) VALUES
  ('asset-007', 'proj-003', 'Product Promo - Title Card', '/media/graphics/promo-title-card.psd', 'image', 'Animated title card template', 'graphics,title', '2026-03-05T15:00:00Z');

-- Creative Briefs (3)
INSERT INTO creative_briefs (id, production_id, title, objective, target_audience, key_message, tone, visual_direction, references_text, deliverables, constraints, created_at, updated_at) VALUES
  ('brief-001', 'prod-001', 'Neon Horizons Brand Vision', 'Position Horizon Tech as a leader in AI-driven urban innovation', 'Tech-forward professionals 25-45', 'The future is already here - Horizon Tech builds it', 'Cinematic, aspirational, warm futurism', 'Anamorphic widescreen, neon highlights against natural light, drone aerials', 'Blade Runner 2049 palette, Apple launch energy, Arrival atmosphere', '1x hero film (90s), 3x social cuts (15s/30s/60s)', 'No dystopian imagery, all real locations', '2026-02-10T10:00:00Z', '2026-02-15T14:00:00Z');
INSERT INTO creative_briefs (id, production_id, title, objective, target_audience, key_message, tone, visual_direction, references_text, deliverables, constraints, created_at, updated_at) VALUES
  ('brief-002', 'prod-002', 'Pulse Drop Launch', 'Drive pre-order signups for Pulse X earbuds', 'Music-loving Gen Z 18-28', 'Sound that moves with you', 'Energetic, bold, urban', 'Fast cuts, macro detail, street style talent', 'Nike ad pacing, Beats product reveals', '1x 30s hero, 1x 15s cutdown, 1x 6s bumper', 'Product in first 3 seconds for social', '2026-02-20T09:00:00Z', '2026-02-22T11:00:00Z');
INSERT INTO creative_briefs (id, production_id, title, objective, target_audience, key_message, tone, visual_direction, references_text, deliverables, constraints, created_at, updated_at) VALUES
  ('brief-003', 'prod-005', 'Bloom Spring Campaign', 'Launch FloraVida spring collection with 40% engagement lift', 'Wellness-focused women 22-40', 'Bloom into your best self', 'Fresh, organic, vibrant, uplifting', 'Natural light, botanical settings, earth tones', 'Glossier campaigns, Aesop visual language', '1x hero (60s), 6x social ads (15s each)', 'Diverse talent, no retouching policy', '2026-03-05T16:00:00Z', '2026-03-06T10:00:00Z');

-- Scenes (6)
INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at) VALUES
  ('scene-001', 'prod-001', 1, 'City Awakens', 'Aerial drone shot of downtown skyline at dawn', 'Downtown LA', 'dawn', 'Golden hour window 5:45-6:15am', 1, '2026-02-12T10:00:00Z');
INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at) VALUES
  ('scene-002', 'prod-001', 2, 'The Lab', 'Interior of Horizon Tech R&D lab with holographic displays', 'Horizon Tech HQ', 'day', 'NDA required for prototype shots', 2, '2026-02-12T10:30:00Z');
INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at) VALUES
  ('scene-003', 'prod-001', 3, 'Street Integration', 'AI-powered transit system, people with smart infrastructure', 'Metro Station', 'afternoon', 'Permits secured for March 15', 3, '2026-02-12T11:00:00Z');
INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at) VALUES
  ('scene-004', 'prod-001', 4, 'The Vision', 'CEO delivers vision monologue to camera', 'Rooftop', 'golden_hour', 'Talent: CEO Jennifer Wu', 4, '2026-02-12T11:30:00Z');
INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at) VALUES
  ('scene-005', 'prod-002', 1, 'Product Reveal', 'Macro shots of earbuds emerging from case', 'Studio A', 'controlled', 'Macro lens rental needed', 1, '2026-02-22T09:00:00Z');
INSERT INTO scenes (id, production_id, scene_number, title, description, location, time_of_day, notes, sort_order, created_at) VALUES
  ('scene-006', 'prod-002', 2, 'In The Wild', 'Talent wearing earbuds in urban activities', 'Venice Beach', 'day', 'Run-and-gun, 2 talent', 2, '2026-02-22T09:30:00Z');

-- Shots (6)
INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at) VALUES
  ('shot-001', 'scene-001', 'prod-001', 1, 'extreme_wide', 'Skyline panoramic', 'drone_ascending', '24mm anamorphic', 'Dawn warm tones', 'Downtown LA', 'Drone rises to reveal skyline', '', 'Establish scale and tone', '21:9 YouTube, center crop for IG', 1, '2026-02-14T10:00:00Z');
INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at) VALUES
  ('shot-002', 'scene-001', 'prod-001', 2, 'wide', 'Street level', 'dolly_forward', '35mm anamorphic', 'Cool dawn, neon reflections', 'Main Street', 'Camera through empty street as lights flicker', '', 'Ground viewer in environment', '', 2, '2026-02-14T10:15:00Z');
INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at) VALUES
  ('shot-003', 'scene-002', 'prod-001', 1, 'medium', 'Engineer at workstation', 'static', '50mm', 'Soft LED + screen glow', 'R&D Lab', 'Engineer interacts with holographic display', '', 'Show innovation in action', '', 1, '2026-02-14T11:00:00Z');
INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at) VALUES
  ('shot-004', 'scene-004', 'prod-001', 1, 'close_up', 'CEO face, city bokeh', 'slight_push', '85mm', 'Golden hour backlight', 'Rooftop', 'CEO delivers vision statement', 'The future is something we build.', 'Emotional anchor', 'Pull quote for social', 1, '2026-02-14T12:00:00Z');
INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at) VALUES
  ('shot-005', 'scene-005', 'prod-002', 1, 'extreme_close_up', 'Product macro', 'slider_right', '100mm macro', 'Dramatic side key', 'Studio A', 'Case opens, light catches surface', '', 'Hero product reveal', 'Must work as thumbnail', 1, '2026-02-24T10:00:00Z');
INSERT INTO shots (id, scene_id, production_id, shot_number, shot_type, framing, movement, lens, lighting_mood, location, subject_action, dialogue, purpose, platform_notes, sort_order, created_at) VALUES
  ('shot-006', 'scene-006', 'prod-002', 1, 'medium', 'Talent skateboarding', 'handheld_follow', '24mm', 'Natural sunlight', 'Venice Beach', 'Talent skates with earbuds', '', 'Lifestyle context', 'Vertical crop for Reels', 1, '2026-02-24T10:30:00Z');

-- Deliverables (8)
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-001', 'prod-001', 'Hero Brand Film', 'video', 'youtube', 'H.265 4K 21:9', '90s', 'in_progress', 'Primary deliverable', '2026-02-15T10:00:00Z', '2026-03-06T14:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-002', 'prod-001', 'Social Cut - 60s', 'video', 'instagram', 'H.264 1080p 1:1', '60s', 'planned', 'Square crop for feed', '2026-02-15T10:00:00Z', '2026-02-15T10:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-003', 'prod-001', 'Social Cut - 15s', 'video', 'tiktok', 'H.264 1080p 9:16', '15s', 'planned', 'Vertical for TikTok and Reels', '2026-02-15T10:00:00Z', '2026-02-15T10:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-004', 'prod-002', 'Pulse Hero Ad', 'video', 'instagram', 'H.264 1080p 1:1', '30s', 'in_progress', 'First assembly complete', '2026-02-22T10:00:00Z', '2026-03-05T18:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-005', 'prod-002', 'Pulse Bumper', 'video', 'youtube', 'H.264 1080p 16:9', '6s', 'planned', 'Pre-roll bumper', '2026-02-22T10:00:00Z', '2026-02-22T10:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-006', 'prod-003', 'Glass & Steel - Full Cut', 'video', 'vimeo', 'ProRes 4K 16:9', '22min', 'review', 'Rough cut for client review', '2026-01-20T10:00:00Z', '2026-03-04T11:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-007', 'prod-007', 'Midnight Run BTS Featurette', 'video', NULL, 'H.265 4K 16:9', '8min', 'delivered', 'Final master delivered', '2026-01-25T10:00:00Z', '2026-03-06T17:00:00Z');
INSERT INTO deliverables (id, production_id, title, type, platform, format, duration, status, notes, created_at, updated_at) VALUES
  ('del-008', 'prod-006', 'AI Tutorial Ep 1-4', 'video', 'youtube', 'H.264 1080p 16:9', '12min avg', 'delivered', 'All 4 episodes live', '2025-12-10T10:00:00Z', '2026-02-28T12:00:00Z');

-- Campaigns (2)
INSERT INTO campaigns (id, production_id, name, objective, channels, target_audience, hooks, cta_variants, messaging_angles, ad_copy, status, created_at, updated_at) VALUES
  ('camp-001', 'prod-002', 'Pulse Drop Launch Campaign', 'Drive 10K pre-orders in first week', 'Instagram, TikTok, YouTube Pre-roll', 'Music-loving Gen Z 18-28', 'Sound that moves with you|Your ears deserve better', 'Pre-order now|Get early access', 'Premium quality|Active lifestyle|Bold style', 'Pulse X: engineered for the way you move.', 'active', '2026-02-23T10:00:00Z', '2026-03-05T14:00:00Z');
INSERT INTO campaigns (id, production_id, name, objective, channels, target_audience, hooks, cta_variants, messaging_angles, ad_copy, status, created_at, updated_at) VALUES
  ('camp-002', 'prod-005', 'Bloom Spring 2026', 'Achieve 40% engagement lift vs Q4', 'TikTok, Instagram Reels, Pinterest', 'Wellness-focused women 22-40', 'Bloom into your best self|Spring starts with you', 'Shop the collection|Discover your bloom', 'Self-care ritual|Sustainable beauty|Inclusive', 'FloraVida invites you to bloom - naturally, beautifully.', 'draft', '2026-03-06T10:00:00Z', '2026-03-07T08:00:00Z');

-- Production Notes (6)
INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES
  ('note-001', 'prod-001', 'creative', 'Client loved Dawn City sequence - approved aerial permits', '2026-02-18T14:00:00Z');
INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES
  ('note-002', 'prod-001', 'logistics', 'Drone operator confirmed March 12-15, backup March 19-20', '2026-03-01T09:00:00Z');
INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES
  ('note-003', 'prod-002', 'creative', 'Director requests slower reveal on product macro', '2026-03-03T11:00:00Z');
INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES
  ('note-004', 'prod-003', 'feedback', 'Client: love architect interviews, want more community voices in act 3', '2026-03-04T15:00:00Z');
INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES
  ('note-005', 'prod-004', 'general', 'Casting call posted - 2 leads and 4 stunt performers', '2026-03-06T10:00:00Z');
INSERT INTO production_notes (id, production_id, category, content, created_at) VALUES
  ('note-006', 'prod-008', 'logistics', 'LED wall rental confirmed from Stage 7, April 2-3', '2026-03-05T16:00:00Z');
