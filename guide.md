# FastTier Supabase Database Guide

A comprehensive guide for setting up and managing the FastTier database with Supabase for Discord bot integration.

## Table of Contents
1. [Database Schema Overview](#database-schema-overview)
2. [Tables Structure](#tables-structure)
3. [Supabase Setup](#supabase-setup)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Discord Bot Integration](#discord-bot-integration)
6. [Common Queries](#common-queries)
7. [Best Practices](#best-practices)

---

## Database Schema Overview

The FastTier system tracks Minecraft PvP player rankings across multiple gamemodes.

### Core Entities
- **Players**: Individual players with their stats
- **Gamemodes**: Different PvP modes (Vanilla, UHC, Pot, etc.)
- **Tier Definitions**: Ranking tiers (HT1, HT2, HT3, LT1, LT2, etc.)
- **Player Tiers**: Junction table linking players to their tier in each gamemode
- **Achievements**: Special accomplishments players can earn
- **Player Achievements**: Junction table for earned achievements
- **Applications**: Tier testing queue for players applying for tier test
- **Testers**: Discord users authorized to conduct tier tests
- **Tester Gamemodes**: Junction table linking testers to specific gamemodes they can test

---

## Tables Structure

### 1. Players Table

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid VARCHAR(20) UNIQUE NOT NULL, -- FastTier ID (e.g., FT-00001)
  username VARCHAR(50) NOT NULL,
  rank VARCHAR(50) NOT NULL, -- Combat title
  points INTEGER DEFAULT 0,
  region VARCHAR(10), -- NA, EU, ASIA, LKA, etc.
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_players_points ON players(points DESC);
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_players_uid ON players(uid);
CREATE INDEX idx_players_active ON players(is_active) WHERE is_active = true;
```

### 2. Gamemodes Table

```sql
CREATE TABLE gamemodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL, -- vanilla, uhc, pot, etc.
  name VARCHAR(50) NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50), -- References image file name in public/kits/
  icon_url TEXT, -- Full path to icon image (e.g., /kits/vanilla.svg)
  color_hex VARCHAR(7) DEFAULT '#ffffff', -- Brand color
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default gamemodes
INSERT INTO gamemodes (code, name, display_name, description, icon_name, icon_url, color_hex, sort_order) VALUES
('vanilla', 'Vanilla', 'Vanilla', 'Classic Minecraft PvP with standard mechanics', 'vanilla', '/kits/vanilla.svg', '#ef4444', 1),
('uhc', 'UHC', 'UHC', 'Ultra Hardcore - No natural regeneration', 'uhc', '/kits/uhc.svg', '#dc2626', 2),
('pot', 'Pot', 'Pot', 'Potion PvP with speed and strength pots', 'pot', '/kits/pot.svg', '#f97316', 3),
('nethop', 'NethOP', 'NethOP', 'Nether OP - Powerful nether gear combat', 'nethop', '/kits/nethop.svg', '#ea580c', 4),
('smp', 'SMP', 'SMP', 'Survival Multiplayer PvP scenarios', 'smp', '/kits/smp.svg', '#22c55e', 5),
('sword', 'Sword', 'Sword', 'Sword-focused combat mode', 'sword', '/kits/sword.svg', '#3b82f6', 6),
('axe', 'Axe', 'Axe', 'Axe and shield combat techniques', 'axe', '/kits/axe.svg', '#8b5cf6', 7),
('mace', 'Mace', 'Mace', 'Mace combat with new mechanics', 'mace', '/kits/mace.svg', '#a855f7', 8);
```

### 3. Tier Definitions Table

```sql
CREATE TABLE tier_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) UNIQUE NOT NULL, -- HT1, HT2, HT3, LT1, LT2
  name VARCHAR(50) NOT NULL, -- High Tier 1, Low Tier 1
  tier_type VARCHAR(2) NOT NULL CHECK (tier_type IN ('HT', 'LT')), -- High Tier or Low Tier
  tier_level INTEGER NOT NULL, -- 1, 2, 3, 4, etc.
  min_points INTEGER NOT NULL,
  max_points INTEGER NOT NULL,
  color_hex VARCHAR(7) DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO tier_definitions (code, name, tier_type, tier_level, min_points, max_points, color_hex) VALUES
-- High Tiers
('HT1', 'High Tier 1', 'HT', 1, 400, 500, '#10b981'),
('HT2', 'High Tier 2', 'HT', 2, 350, 399, '#8b5cf6'),
('HT3', 'High Tier 3', 'HT', 3, 300, 349, '#ff9f43'),
('HT4', 'High Tier 4', 'HT', 4, 250, 299, '#ffd700'),
-- Low Tiers
('LT1', 'Low Tier 1', 'LT', 1, 200, 249, '#3b82f6'),
('LT2', 'Low Tier 2', 'LT', 2, 150, 199, '#06b6d4'),
('LT3', 'Low Tier 3', 'LT', 3, 100, 149, '#64748b'),
('LT4', 'Low Tier 4', 'LT', 4, 50, 99, '#94a3b8');
```

### 4. Player Tiers Table (Junction)

```sql
CREATE TABLE player_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  gamemode_id UUID NOT NULL REFERENCES gamemodes(id) ON DELETE CASCADE,
  tier_definition_id UUID NOT NULL REFERENCES tier_definitions(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, gamemode_id) -- One tier per gamemode per player
);

-- Indexes
CREATE INDEX idx_player_tiers_player ON player_tiers(player_id);
CREATE INDEX idx_player_tiers_gamemode ON player_tiers(gamemode_id);
```

### 5. Achievements Table

```sql
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

-- Insert achievements
INSERT INTO achievements (code, name, description, icon_name, color_hex, points_bonus) VALUES
('first_blood', 'First Blood', 'Win your first ranked match', 'Target', '#ef4444', 10),
('win_streak_3', 'Winning Streak', 'Win 3 matches in a row', 'Flame', '#f97316', 25),
('win_streak_5', 'On Fire', 'Win 5 matches in a row', 'Zap', '#eab308', 50),
('tier_climber', 'Tier Climber', 'Advance to a higher tier', 'TrendingUp', '#3b82f6', 30),
('ht1_reached', 'Elite Status', 'Reach High Tier 1 in any gamemode', 'Crown', '#10b981', 100),
('veteran', 'Veteran', 'Play 50 ranked matches', 'Shield', '#8b5cf6', 75),
('undefeated', 'Undefeated', 'Win 10 matches without losing', 'Star', '#ffd700', 150);
```

### 6. Player Achievements Table (Junction)

```sql
CREATE TABLE player_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

CREATE INDEX idx_player_achievements_player ON player_achievements(player_id);
```

### 7. Applications Table (Tier Testing Queue)

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  discord_username VARCHAR(100) NOT NULL,
  discord_user_id VARCHAR(20) NOT NULL, -- Discord ID for DMs
  email VARCHAR(255) NOT NULL,
  region VARCHAR(10) NOT NULL,
  gamemode_id UUID REFERENCES gamemodes(id), -- Gamemode they want to test
  status VARCHAR(20) DEFAULT 'pending', -- pending, invited, testing, completed, expired, cancelled
  reviewed_by UUID REFERENCES players(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  invited_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  ticket_channel_id VARCHAR(20), -- Discord channel ID for testing
  expire_count INTEGER DEFAULT 0, -- Track expired invites
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_gamemode ON applications(gamemode_id);
CREATE INDEX idx_applications_discord_user ON applications(discord_user_id);
CREATE INDEX idx_applications_created ON applications(created_at);
```

### 8. Testers Table

```sql
CREATE TABLE testers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_user_id VARCHAR(20) UNIQUE NOT NULL,
  discord_username VARCHAR(100) NOT NULL,
  can_test_all BOOLEAN DEFAULT false, -- Can test all gamemodes if true
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_testers_active ON testers(is_active);
```

### 9. Tester Gamemodes Table (Junction)

Links testers to specific gamemodes they can test (only used if can_test_all = false).

```sql
CREATE TABLE tester_gamemodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tester_id UUID NOT NULL REFERENCES testers(id) ON DELETE CASCADE,
  gamemode_id UUID NOT NULL REFERENCES gamemodes(id) ON DELETE CASCADE,
  UNIQUE(tester_id, gamemode_id)
);

CREATE INDEX idx_tester_gamemodes_tester ON tester_gamemodes(tester_id);
CREATE INDEX idx_tester_gamemodes_gamemode ON tester_gamemodes(gamemode_id);
```

---

## Supabase Setup

### 1. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Select region closest to your users
5. Create project and wait for provisioning

### 2. Get API Keys
1. Go to Project Settings > API
2. Copy:
   - `Project URL` (VITE_SUPABASE_URL)
   - `anon public` API key (VITE_SUPABASE_ANON_KEY)
   - `service_role secret` key (for admin operations)

### 3. Environment Variables

Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DISCORD_BOT_TOKEN=your-discord-bot-token
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Row Level Security (RLS)

Enable RLS on all tables for security:

```sql
-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
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

-- Only allow inserts/updates via service role or authenticated admin
CREATE POLICY "Allow admin write access" ON players
  FOR ALL USING (auth.role() = 'service_role');
```

---

## Discord Bot Integration

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js discord.js dotenv
```

### 2. Database Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for bot

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 3. Common Discord Bot Operations

```typescript
// bot/commands/player.ts
import { supabase } from '../lib/supabase';

// Get player by username
export async function getPlayerByUsername(username: string) {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers:player_tiers(
        *,
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      ),
      achievements:player_achievements(
        *,
        achievement:achievements(*)
      )
    `)
    .eq('is_active', true)
    .ilike('username', username)
    .single();
  
  if (error) throw error;
  return data;
}

// Get leaderboard
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers:player_tiers(
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      )
    `)
    .eq('is_active', true)
    .order('points', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

// Add new player
export async function addPlayer(playerData: {
  uid: string;
  username: string;
  rank: string;
  points: number;
  region: string;
}) {
  const { data, error } = await supabase
    .from('players')
    .insert([playerData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Update player tier
export async function updatePlayerTier(
  playerId: string,
  gamemodeId: string,
  tierDefinitionId: string
) {
  const { data, error } = await supabase
    .from('player_tiers')
    .upsert({
      player_id: playerId,
      gamemode_id: gamemodeId,
      tier_definition_id: tierDefinitionId,
      achieved_at: new Date().toISOString()
    }, {
      onConflict: 'player_id,gamemode_id'
    });
  
  if (error) throw error;
  return data;
}

// Search players
export async function searchPlayers(query: string) {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers:player_tiers(
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      )
    `)
    .eq('is_active', true)
    .ilike('username', `%${query}%`)
    .order('points', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

### 4. Discord Bot Command Example

```typescript
// bot/commands/rank.ts
import { SlashCommandBuilder } from 'discord.js';
import { getPlayerByUsername } from '../lib/database';

export const data = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Check player rank and stats')
  .addStringOption(option =>
    option.setName('username')
      .setDescription('Minecraft username')
      .setRequired(true)
  );

export async function execute(interaction) {
  const username = interaction.options.getString('username');
  
  await interaction.deferReply();
  
  try {
    const player = await getPlayerByUsername(username);
    
    if (!player) {
      return interaction.editReply(`Player "${username}" not found.`);
    }
    
    // Format tiers
    const tierList = player.tiers
      ?.map(t => `${t.gamemode.display_name}: ${t.tier_definition.code}`)
      .join('\n') || 'No tiers';
    
    const embed = {
      title: `${player.username}'s Profile`,
      description: `**Rank:** ${player.rank}\n**Points:** ${player.points}\n**Region:** ${player.region}`,
      fields: [
        {
          name: 'Gamemodes',
          value: tierList,
          inline: true
        }
      ],
      color: 0xff9f43,
      thumbnail: {
        url: `https://render.crafty.gg/3d/bust/${player.username}`
      }
    };
    
    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('An error occurred while fetching player data.');
  }
}
```

---

## Common Queries

### Get Top Players by Gamemode

```sql
SELECT 
  p.username,
  p.points,
  p.region,
  td.code as tier_code,
  g.display_name as gamemode
FROM players p
JOIN player_tiers pt ON p.id = pt.player_id
JOIN tier_definitions td ON pt.tier_definition_id = td.id
JOIN gamemodes g ON pt.gamemode_id = g.id
WHERE g.code = 'vanilla' 
  AND p.is_active = true
ORDER BY td.tier_level ASC, p.points DESC
LIMIT 10;
```

### Get Player Count by Region

```sql
SELECT 
  region,
  COUNT(*) as player_count,
  AVG(points) as avg_points
FROM players
WHERE is_active = true
GROUP BY region
ORDER BY player_count DESC;
```

### Get Players Without Tiers

```sql
SELECT p.*
FROM players p
LEFT JOIN player_tiers pt ON p.id = pt.player_id
WHERE pt.id IS NULL AND p.is_active = true;
```

### Update Player Points

```sql
UPDATE players 
SET 
  points = points + 50,
  updated_at = NOW()
WHERE uid = 'FT-00001';
```

---

## Best Practices

### 1. Error Handling
Always handle errors gracefully:

```typescript
try {
  const { data, error } = await supabase.from('players').select('*');
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Database error:', error);
  // Log to monitoring service
  throw new Error('Failed to fetch players');
}
```

### 2. Rate Limiting
Implement rate limiting for Discord commands:

```typescript
const rateLimiter = new Map();

export function checkRateLimit(userId: string, command: string, limit = 5, window = 60000) {
  const key = `${userId}:${command}`;
  const now = Date.now();
  const userLimit = rateLimiter.get(key) || { count: 0, resetTime: now + window };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + window;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  rateLimiter.set(key, userLimit);
  return true;
}
```

### 3. Caching
Cache frequently accessed data:

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

export async function getLeaderboardWithCache() {
  const cached = cache.get('leaderboard');
  if (cached) return cached;
  
  const data = await getLeaderboard();
  cache.set('leaderboard', data);
  return data;
}
```

### 4. Data Validation
Validate data before insertion:

```typescript
import { z } from 'zod';

const playerSchema = z.object({
  uid: z.string().regex(/^FT-\d{5}$/),
  username: z.string().min(3).max(50),
  rank: z.string(),
  points: z.number().int().min(0),
  region: z.enum(['NA', 'EU', 'ASIA', 'LKA', 'OTHER'])
});

export function validatePlayer(data: unknown) {
  return playerSchema.parse(data);
}
```

### 5. Backups
Set up automated backups in Supabase Dashboard:
1. Go to Project Settings > Database
2. Enable Point in Time Recovery (PITR)
3. Schedule regular backups

### 6. Monitoring
Monitor database performance:
```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## Troubleshooting

### Connection Issues
- Check firewall settings
- Verify API keys are correct
- Ensure service_role key is used for bot operations

### Performance Issues
- Add indexes on frequently queried columns
- Use pagination for large datasets
- Enable caching

### Data Consistency
- Use transactions for multi-table operations
- Implement foreign key constraints
- Regular data validation checks

---

## Migration Guide

To migrate existing data:

```sql
-- Export existing data
COPY players TO '/tmp/players.csv' WITH CSV HEADER;

-- Import to Supabase (using SQL Editor)
COPY players FROM '/tmp/players.csv' WITH CSV HEADER;

-- Or use Supabase CLI
supabase db dump > backup.sql
supabase db restore backup.sql
```

---

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Discord Developer Portal](https://discord.com/developers/applications)

---

**Last Updated:** 2024
**Version:** 1.0
**Maintainer:** FastTier Team
