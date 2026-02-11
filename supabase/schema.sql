-- Enable Row Level Security (RLS)
alter table if exists players enable row level security;
alter table if exists tiers enable row level security;

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  rank TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  region TEXT NOT NULL CHECK (region IN ('NA', 'EU')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tiers table
CREATE TABLE IF NOT EXISTS tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  gamemode TEXT NOT NULL CHECK (gamemode IN ('vanilla', 'uhc', 'pot', 'nethop', 'smp', 'sword', 'axe', 'mace', 'ltms')),
  tier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_points ON players(points DESC);
CREATE INDEX IF NOT EXISTS idx_players_region ON players(region);
CREATE INDEX IF NOT EXISTS idx_tiers_player_id ON tiers(player_id);
CREATE INDEX IF NOT EXISTS idx_tiers_gamemode ON tiers(gamemode);

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
CREATE POLICY "Enable read access for all users" ON players
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON tiers
  FOR SELECT USING (true);

-- Insert sample data (optional - you can remove this if you want to start fresh)
INSERT INTO players (uid, username, rank, points, region) VALUES
  ('FT-00291', 'Marlowww', 'Combat Grandmaster', 435, 'NA'),
  ('FT-00184', 'ItzRealMe', 'Combat Master', 330, 'NA'),
  ('FT-00327', 'Swight', 'Combat Master', 290, 'NA'),
  ('FT-00412', 'coldified', 'Combat Master', 281, 'EU'),
  ('FT-00158', 'janeky', 'Combat Expert', 275, 'EU')
ON CONFLICT (uid) DO NOTHING;

-- Insert sample tiers
INSERT INTO tiers (player_id, gamemode, tier)
SELECT p.id, t.gamemode, t.tier
FROM players p
CROSS JOIN LATERAL (VALUES
  ('vanilla', 'HT1'),
  ('uhc', 'HT1'),
  ('pot', 'LT1'),
  ('sword', 'LT1'),
  ('axe', 'HT1'),
  ('mace', 'HT1'),
  ('nethop', 'LT1'),
  ('smp', 'LT2')
) AS t(gamemode, tier)
WHERE p.username = 'Marlowww'
ON CONFLICT DO NOTHING;
