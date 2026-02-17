# New Ranking System Documentation

## Overview
The ranking system has been completely redesigned to match the MCPVP system:
- **Ranks** are now based on **TOTAL accumulated points** across all gamemodes
- **Tiers** give specific point values when achieved
- Points are additive across all gamemodes

## SQL Migration
Run the SQL file: `migrations/new_ranking_system.sql`

## Rank Titles (Based on Total Points)

| Rank Title | Min Points | Max Points | Description |
|------------|------------|------------|-------------|
| Combat Grandmaster | 400 | ∞ | Obtained 400+ total points |
| Combat Master | 250 | 399 | Obtained 250+ total points |
| Combat Ace | 100 | 249 | Obtained 100+ total points |
| Combat Specialist | 50 | 99 | Obtained 50+ total points |
| Combat Cadet | 20 | 49 | Obtained 20+ total points |
| Combat Novice | 10 | 19 | Obtained 10+ total points |
| Rookie | 0 | 9 | Starting rank for players with less than 10 points |

## Tier Points (Per Gamemode)

| Tier | High Tier (HT) Points | Low Tier (LT) Points |
|------|----------------------|---------------------|
| Tier 1 | 60 | 45 |
| Tier 2 | 30 | 20 |
| Tier 3 | 10 | 6 |
| Tier 4 | 4 | 3 |
| Tier 5 | 2 | 1 |

## How Points Work

### Example Calculation
A player with:
- Vanilla: HT1 (60 pts)
- UHC: HT1 (60 pts)  
- Pot: LT1 (45 pts)
- Sword: HT2 (30 pts)
- Axe: HT3 (10 pts)
- Mace: LT4 (3 pts)
- NethOP: HT5 (2 pts)
- SMP: LT5 (1 pt)

**Total Points: 60 + 60 + 45 + 30 + 10 + 3 + 2 + 1 = 211 points**
**Rank: Combat Ace** (100-249 points)

### Key Differences from Old System
1. **Old**: Each gamemode had its own tier, player had one global rank
2. **New**: Player accumulates points from ALL gamemodes, rank is based on total
3. **Old**: Min/max points per tier level
4. **New**: Fixed point value per tier, no ranges

## Database Changes

### New/Modified Tables

#### tier_definitions
- Added: `points_value` (INTEGER) - how many points this tier gives
- Removed: `min_points`, `max_points` (no longer needed)

#### rank_definitions (NEW TABLE)
Stores all possible rank titles with their point thresholds

### Database Functions (Auto-Created)

1. **calculate_player_points(player_uuid)**
   - Calculates total points from all player tiers
   - Used automatically when tiers change

2. **get_player_rank_title(points)**
   - Returns rank title based on total points
   - Example: 211 points → "Combat Ace"

3. **update_player_points_and_rank()** 
   - Trigger function that auto-updates player points and rank
   - Runs whenever a tier is added/updated/removed

## Discord Bot Updates Needed

### Tier Progression Logic
```
Promotion: LT1 → LT2 → LT3 → LT4 → LT5 → HT5 → HT4 → HT3 → HT2 → HT1
Demotion:  HT1 → HT2 → HT3 → HT4 → HT5 → LT5 → LT4 → LT3 → LT2 → LT1
```

### Command Updates
- `/tester promote` - Move player up one tier level
- `/tester demote` - Move player down one tier level  
- Points and rank will auto-update via database triggers

### Point Calculation
No need to calculate manually - database handles it automatically via triggers!

## Frontend Updates

### What Changed
1. `TierDefinition` interface now has `points_value` instead of `min_points`/`max_points`
2. New `RankDefinition` interface for rank titles
3. Mock data updated to reflect new point values

### What Stays the Same
- Player display logic
- Leaderboard sorting (still by points DESC)
- Profile modal display
- All UI components

## Testing the Migration

1. **Backup your database first!**
2. Run the SQL migration file
3. Verify tier_definitions has correct point values
4. Check that existing players have updated points/ranks
5. Test adding/updating tiers through Discord bot

## Example Scenarios

### New Player Journey
1. Start: 0 points = **Rookie**
2. Get LT5 in Vanilla: 1 point = **Rookie**
3. Get HT5 in 5 gamemodes: 10 points = **Combat Novice**
4. Get HT1 in 7 gamemodes: 420 points = **Combat Grandmaster**

### Tier Loss Impact
If a player loses HT1 (60 pts) in one gamemode:
- Points decrease by 60
- Rank may drop if falls below threshold
- All handled automatically by database trigger
