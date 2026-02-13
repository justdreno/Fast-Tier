-- ============================================
-- INSERT SAMPLE PLAYERS WITH STATS AND ACHIEVEMENTS
-- ============================================

-- Get tier definition IDs
DO $$
DECLARE
  ht1_id UUID;
  ht2_id UUID;
  ht3_id UUID;
  ht4_id UUID;
  vanilla_id UUID;
  uhc_id UUID;
  pot_id UUID;
  nethop_id UUID;
  smp_id UUID;
  sword_id UUID;
  axe_id UUID;
  mace_id UUID;
  first_blood_id UUID;
  win_streak_3_id UUID;
  tier_climber_id UUID;
BEGIN
  -- Get tier IDs
  SELECT id INTO ht1_id FROM tier_definitions WHERE code = 'HT1';
  SELECT id INTO ht2_id FROM tier_definitions WHERE code = 'HT2';
  SELECT id INTO ht3_id FROM tier_definitions WHERE code = 'HT3';
  SELECT id INTO ht4_id FROM tier_definitions WHERE code = 'HT4';
  
  -- Get gamemode IDs
  SELECT id INTO vanilla_id FROM gamemodes WHERE code = 'vanilla';
  SELECT id INTO uhc_id FROM gamemodes WHERE code = 'uhc';
  SELECT id INTO pot_id FROM gamemodes WHERE code = 'pot';
  SELECT id INTO nethop_id FROM gamemodes WHERE code = 'nethop';
  SELECT id INTO smp_id FROM gamemodes WHERE code = 'smp';
  SELECT id INTO sword_id FROM gamemodes WHERE code = 'sword';
  SELECT id INTO axe_id FROM gamemodes WHERE code = 'axe';
  SELECT id INTO mace_id FROM gamemodes WHERE code = 'mace';
  
  -- Get achievement IDs
  SELECT id INTO first_blood_id FROM achievements WHERE code = 'first_blood';
  SELECT id INTO win_streak_3_id FROM achievements WHERE code = 'win_streak_3';
  SELECT id INTO tier_climber_id FROM achievements WHERE code = 'tier_climber';

  -- ============================================
  -- PLAYER 1: whoap (BEST - All HT4, 500 points)
  -- ============================================
  INSERT INTO players (uid, username, rank, points, region, is_active) VALUES
  ('FT-00001', 'whoap', 'Combat Legend', 500, 'NA', true)
  ON CONFLICT (uid) DO NOTHING;

  -- whoap's tiers (all gamemodes HT4 = 250-299 points)
  INSERT INTO player_tiers (player_id, gamemode_id, tier_definition_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00001'), vanilla_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), uhc_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), pot_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), nethop_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), smp_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), sword_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), axe_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), mace_id, ht4_id)
  ON CONFLICT DO NOTHING;

  -- whoap's achievements
  INSERT INTO player_achievements (player_id, achievement_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00001'), first_blood_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), win_streak_3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00001'), tier_climber_id)
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- PLAYER 2: JustDreno (5 HT4, others HT3, 420 points)
  -- ============================================
  INSERT INTO players (uid, username, rank, points, region, is_active) VALUES
  ('FT-00002', 'JustDreno', 'Combat Master', 420, 'EU', true)
  ON CONFLICT (uid) DO NOTHING;

  -- JustDreno's tiers (first 5 gamemodes HT4, rest HT3)
  INSERT INTO player_tiers (player_id, gamemode_id, tier_definition_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00002'), vanilla_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), uhc_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), pot_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), nethop_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), smp_id, ht4_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), sword_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), axe_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), mace_id, ht3_id)
  ON CONFLICT DO NOTHING;

  -- JustDreno's achievements
  INSERT INTO player_achievements (player_id, achievement_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00002'), first_blood_id),
    ((SELECT id FROM players WHERE uid = 'FT-00002'), tier_climber_id)
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- PLAYER 3: xSlayer (HT2/HT3, 380 points)
  -- ============================================
  INSERT INTO players (uid, username, rank, points, region, is_active) VALUES
  ('FT-00003', 'xSlayer', 'Combat Master', 380, 'ASIA', true)
  ON CONFLICT (uid) DO NOTHING;

  INSERT INTO player_tiers (player_id, gamemode_id, tier_definition_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00003'), vanilla_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00003'), uhc_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00003'), pot_id, ht2_id),
    ((SELECT id FROM players WHERE uid = 'FT-00003'), sword_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00003'), axe_id, ht3_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO player_achievements (player_id, achievement_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00003'), first_blood_id)
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- PLAYER 4: PvP_God (HT3, 310 points)
  -- ============================================
  INSERT INTO players (uid, username, rank, points, region, is_active) VALUES
  ('FT-00004', 'PvP_God', 'Combat Adept', 310, 'NA', true)
  ON CONFLICT (uid) DO NOTHING;

  INSERT INTO player_tiers (player_id, gamemode_id, tier_definition_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00004'), vanilla_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00004'), uhc_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00004'), pot_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00004'), nethop_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00004'), mace_id, ht3_id)
  ON CONFLICT DO NOTHING;

  -- ============================================
  -- PLAYER 5: GhostBlade (HT3/HT2, 295 points)
  -- ============================================
  INSERT INTO players (uid, username, rank, points, region, is_active) VALUES
  ('FT-00005', 'GhostBlade', 'Combat Adept', 295, 'LKA', true)
  ON CONFLICT (uid) DO NOTHING;

  INSERT INTO player_tiers (player_id, gamemode_id, tier_definition_id) VALUES
    ((SELECT id FROM players WHERE uid = 'FT-00005'), vanilla_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00005'), sword_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00005'), axe_id, ht2_id),
    ((SELECT id FROM players WHERE uid = 'FT-00005'), mace_id, ht3_id),
    ((SELECT id FROM players WHERE uid = 'FT-00005'), pot_id, ht3_id)
  ON CONFLICT DO NOTHING;

END $$;

-- Verify data
SELECT 
  p.uid,
  p.username,
  p.points,
  p.region,
  p.rank,
  COUNT(pt.id) as gamemodes_count
FROM players p
LEFT JOIN player_tiers pt ON p.id = pt.player_id
GROUP BY p.id
ORDER BY p.points DESC;
