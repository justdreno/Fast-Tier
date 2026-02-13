-- ============================================
-- FASTTIER DATABASE - FULL RESET & SETUP
-- ============================================
-- This script will:
-- 1. Drop all existing tables
-- 2. Recreate all tables with proper constraints
-- 3. Insert all tier definitions
-- 4. Insert all gamemodes with image references
-- 5. Set up RLS policies
-- 6. Create indexes
-- ============================================

-- ============================================
-- STEP 1: DROP ALL EXISTING TABLES
-- ============================================

-- Drop junction tables first (foreign key dependencies)
DROP TABLE IF EXISTS player_achievements CASCADE;
DROP TABLE IF EXISTS player_tiers CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

-- Drop main tables
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS tier_definitions CASCADE;
DROP TABLE IF EXISTS gamemodes CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TIER DEFINITIONS TABLE
-- ============================================
CREATE TABLE tier_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  tier_type VARCHAR(2) NOT NULL CHECK (tier_type IN ('HT', 'LT')),
  tier_level INTEGER NOT NULL,
  min_points INTEGER NOT NULL,
  max_points INTEGER NOT NULL,
  color_hex VARCHAR(7) DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GAMEMODES TABLE
-- ============================================
CREATE TABLE gamemodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50), -- References image file name in public/kits/
  icon_url TEXT, -- Full path to icon image
  color_hex VARCHAR(7) DEFAULT '#ffffff',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PLAYERS TABLE
-- ============================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid VARCHAR(20) UNIQUE NOT NULL,
  username VARCHAR(50) NOT NULL,
  rank VARCHAR(50) NOT NULL DEFAULT 'Combat Recruit',
  points INTEGER DEFAULT 0,
  region VARCHAR(10),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PLAYER TIERS TABLE (JUNCTION)
-- ============================================
CREATE TABLE player_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  gamemode_id UUID NOT NULL REFERENCES gamemodes(id) ON DELETE CASCADE,
  tier_definition_id UUID NOT NULL REFERENCES tier_definitions(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, gamemode_id)
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  icon_url TEXT, -- Path to achievement image if available
  color_hex VARCHAR(7) DEFAULT '#ffd700',
  points_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PLAYER ACHIEVEMENTS TABLE (JUNCTION)
-- ============================================
CREATE TABLE player_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  discord_username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  region VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by UUID REFERENCES players(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================

-- Players indexes
CREATE INDEX idx_players_points ON players(points DESC);
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_players_uid ON players(uid);
CREATE INDEX idx_players_active ON players(is_active) WHERE is_active = true;
CREATE INDEX idx_players_region ON players(region);

-- Player tiers indexes
CREATE INDEX idx_player_tiers_player ON player_tiers(player_id);
CREATE INDEX idx_player_tiers_gamemode ON player_tiers(gamemode_id);
CREATE INDEX idx_player_tiers_tier ON player_tiers(tier_definition_id);

-- Player achievements indexes
CREATE INDEX idx_player_achievements_player ON player_achievements(player_id);
CREATE INDEX idx_player_achievements_achievement ON player_achievements(achievement_id);

-- Applications indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_username ON applications(username);
CREATE INDEX idx_applications_created ON applications(created_at DESC);

-- Gamemodes index
CREATE INDEX idx_gamemodes_sort ON gamemodes(sort_order);

-- ============================================
-- STEP 4: INSERT TIER DEFINITIONS
-- ============================================

INSERT INTO tier_definitions (code, name, tier_type, tier_level, min_points, max_points, color_hex) VALUES
-- High Tiers (HT)
('HT1', 'High Tier 1', 'HT', 1, 400, 500, '#10b981'),
('HT2', 'High Tier 2', 'HT', 2, 350, 399, '#8b5cf6'),
('HT3', 'High Tier 3', 'HT', 3, 300, 349, '#ff9f43'),
('HT4', 'High Tier 4', 'HT', 4, 250, 299, '#ffd700'),
-- Low Tiers (LT)
('LT1', 'Low Tier 1', 'LT', 1, 200, 249, '#3b82f6'),
('LT2', 'Low Tier 2', 'LT', 2, 150, 199, '#06b6d4'),
('LT3', 'Low Tier 3', 'LT', 3, 100, 149, '#64748b'),
('LT4', 'Low Tier 4', 'LT', 4, 50, 99, '#94a3b8');

-- ============================================
-- STEP 5: INSERT GAMEMODES WITH IMAGES
-- ============================================

INSERT INTO gamemodes (code, name, display_name, description, icon_name, icon_url, color_hex, sort_order, is_active) VALUES
('vanilla', 'Vanilla', 'Vanilla', 'Classic Minecraft PvP with standard mechanics', 'vanilla', '/kits/vanilla.svg', '#ef4444', 1, true),
('uhc', 'UHC', 'UHC', 'Ultra Hardcore - No natural regeneration', 'uhc', '/kits/uhc.svg', '#dc2626', 2, true),
('pot', 'Pot', 'Pot', 'Potion PvP with speed and strength pots', 'pot', '/kits/pot.svg', '#f97316', 3, true),
('nethop', 'NethOP', 'NethOP', 'Nether OP - Powerful nether gear combat', 'nethop', '/kits/nethop.svg', '#ea580c', 4, true),
('smp', 'SMP', 'SMP', 'Survival Multiplayer PvP scenarios', 'smp', '/kits/smp.svg', '#22c55e', 5, true),
('sword', 'Sword', 'Sword', 'Sword-focused combat mode', 'sword', '/kits/sword.svg', '#3b82f6', 6, true),
('axe', 'Axe', 'Axe', 'Axe and shield combat techniques', 'axe', '/kits/axe.svg', '#8b5cf6', 7, true),
('mace', 'Mace', 'Mace', 'Mace combat with new mechanics', 'mace', '/kits/mace.svg', '#a855f7', 8, true);

-- ============================================
-- STEP 6: INSERT ACHIEVEMENTS
-- ============================================
-- Note: These are placeholder achievements. 
-- Add icon_url when you have achievement images.

INSERT INTO achievements (code, name, description, icon_name, color_hex, points_bonus) VALUES
('first_blood', 'First Blood', 'Win your first ranked match', 'Target', '#ef4444', 10),
('win_streak_3', 'Winning Streak', 'Win 3 matches in a row', 'Flame', '#f97316', 25),
('win_streak_5', 'On Fire', 'Win 5 matches in a row', 'Zap', '#eab308', 50),
('tier_climber', 'Tier Climber', 'Advance to a higher tier', 'TrendingUp', '#3b82f6', 30),
('ht1_reached', 'Elite Status', 'Reach High Tier 1 in any gamemode', 'Crown', '#10b981', 100),
('veteran', 'Veteran', 'Play 50 ranked matches', 'Shield', '#8b5cf6', 75),
('undefeated', 'Undefeated', 'Win 10 matches without losing', 'Star', '#ffd700', 150);

-- ============================================
-- STEP 7: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamemodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================

-- Public read access for all tables
CREATE POLICY "Allow public read access" ON players
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON player_tiers
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON player_achievements
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON gamemodes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON tier_definitions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON achievements
  FOR SELECT USING (true);

-- Applications - users can only see their own
CREATE POLICY "Allow users to read own applications" ON applications
  FOR SELECT USING (
    auth.uid()::text = username OR 
    auth.role() = 'service_role'
  );

-- Service role can write to all tables
CREATE POLICY "Allow service role write access" ON players
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write access" ON player_tiers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write access" ON player_achievements
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write access" ON gamemodes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write access" ON tier_definitions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write access" ON achievements
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role write access" ON applications
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- STEP 9: CREATE TRIGGER FOR UPDATED_AT
-- ============================================

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Verify data
SELECT 'Tier Definitions' as table_name, COUNT(*) as count FROM tier_definitions
UNION ALL
SELECT 'Gamemodes', COUNT(*) FROM gamemodes
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements;
