-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS player_achievements CASCADE;
DROP TABLE IF EXISTS player_tiers CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS gamemodes CASCADE;
DROP TABLE IF EXISTS tier_definitions CASCADE;

-- Create tier_definitions table (all possible tiers)
CREATE TABLE IF NOT EXISTS tier_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tier_type TEXT NOT NULL CHECK (tier_type IN ('HT', 'LT')), -- High Tier or Low Tier
  tier_level INTEGER NOT NULL CHECK (tier_level > 0),
  min_points INTEGER DEFAULT 0,
  max_points INTEGER DEFAULT 0,
  color_hex TEXT DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gamemodes table
CREATE TABLE IF NOT EXISTS gamemodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  color_hex TEXT DEFAULT '#ff9f43',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT,
  color_hex TEXT DEFAULT '#ffd700',
  points_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  rank TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  region TEXT NOT NULL CHECK (region IN ('NA', 'EU')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create player_tiers table (junction table for players and their tiers)
CREATE TABLE IF NOT EXISTS player_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  gamemode_id UUID NOT NULL REFERENCES gamemodes(id) ON DELETE CASCADE,
  tier_definition_id UUID NOT NULL REFERENCES tier_definitions(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, gamemode_id)
);

-- Create player_achievements table (junction table for players and achievements)
CREATE TABLE IF NOT EXISTS player_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_points ON players(points DESC);
CREATE INDEX IF NOT EXISTS idx_players_region ON players(region);
CREATE INDEX IF NOT EXISTS idx_player_tiers_player_id ON player_tiers(player_id);
CREATE INDEX IF NOT EXISTS idx_player_tiers_gamemode_id ON player_tiers(gamemode_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_id ON player_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_gamemodes_code ON gamemodes(code);
CREATE INDEX IF NOT EXISTS idx_tier_definitions_code ON tier_definitions(code);
CREATE INDEX IF NOT EXISTS idx_achievements_code ON achievements(code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS policies
ALTER TABLE tier_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamemodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;

-- Create read policies for all tables
CREATE POLICY "Enable read access for all users" ON tier_definitions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON gamemodes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON achievements FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON players FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON player_tiers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON player_achievements FOR SELECT USING (true);

-- Insert tier definitions
INSERT INTO tier_definitions (code, name, tier_type, tier_level, min_points, max_points, color_hex) VALUES
  ('HT1', 'High Tier 1', 'HT', 1, 400, 500, '#10b981'),
  ('HT2', 'High Tier 2', 'HT', 2, 350, 399, '#8b5cf6'),
  ('HT3', 'High Tier 3', 'HT', 3, 300, 349, '#ff9f43'),
  ('LT1', 'Low Tier 1', 'LT', 1, 250, 299, '#3b82f6'),
  ('LT2', 'Low Tier 2', 'LT', 2, 200, 249, '#06b6d4'),
  ('LT3', 'Low Tier 3', 'LT', 3, 150, 199, '#f59e0b')
ON CONFLICT (code) DO NOTHING;

-- Insert gamemodes
INSERT INTO gamemodes (code, name, display_name, description, icon_name, color_hex, sort_order) VALUES
  ('vanilla', 'Vanilla', 'Vanilla', 'Classic Minecraft PvP', 'Heart', '#ef4444', 1),
  ('uhc', 'UHC', 'UHC', 'Ultra Hardcore', 'Heart', '#dc2626', 2),
  ('pot', 'Pot', 'Pot', 'Potion PvP', 'Flame', '#f97316', 3),
  ('nethop', 'NethOP', 'NethOP', 'Nether OP', 'Flame', '#ea580c', 4),
  ('smp', 'SMP', 'SMP', 'Survival Multiplayer', 'Users', '#22c55e', 5),
  ('sword', 'Sword', 'Sword', 'Sword Combat', 'Sword', '#3b82f6', 6),
  ('axe', 'Axe', 'Axe', 'Axe Combat', 'Axe', '#8b5cf6', 7),
  ('mace', 'Mace', 'Mace', 'Mace Combat', 'Hammer', '#a855f7', 8),
  ('ltms', 'LTMs', 'LTMs', 'Limited Time Modes', 'Swords', '#ec4899', 9)
ON CONFLICT (code) DO NOTHING;

-- Insert achievements
INSERT INTO achievements (code, name, description, icon_name, color_hex, points_bonus) VALUES
  ('first_blood', 'First Blood', 'Get your first kill', 'Target', '#ef4444', 10),
  ('killstreak_5', 'Killstreak Master', 'Get 5 kills in a row', 'Zap', '#f97316', 25),
  ('killstreak_10', 'Unstoppable', 'Get 10 kills in a row', 'Zap', '#dc2626', 50),
  ('win_streak_3', 'Winning Streak', 'Win 3 matches in a row', 'Trophy', '#fbbf24', 30),
  ('win_streak_5', 'Legendary Streak', 'Win 5 matches in a row', 'Trophy', '#f59e0b', 75),
  ('vanilla_master', 'Vanilla Master', 'Reach HT1 in Vanilla', 'Heart', '#ef4444', 100),
  ('pot_master', 'Pot Master', 'Reach HT1 in Pot', 'Flame', '#f97316', 100),
  ('all_modes', 'Jack of All Trades', 'Play all gamemodes', 'Grid', '#3b82f6', 50),
  ('top_10', 'Top 10', 'Reach top 10 rankings', 'Medal', '#eab308', 200),
  ('top_3', 'Top 3', 'Reach top 3 rankings', 'Medal', '#ca8a04', 500),
  ('number_1', 'Number One', 'Reach rank 1', 'Crown', '#ffd700', 1000)
ON CONFLICT (code) DO NOTHING;
