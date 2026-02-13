-- Add discord_id column to players table
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS discord_id VARCHAR(20);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_players_discord_id ON players(discord_id);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;
