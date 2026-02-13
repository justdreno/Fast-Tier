# FastTier Discord Bot - Feature Plans

## Plan A: Basic Tier Management Bot

**Best for:** Small server, simple needs

### Core Features
- `/register <minecraft_username>` - Register player to FastTier
- `/rank <username>` - Show player stats and tiers
- `/leaderboard` - Top players by points
- `/grant-tier <player> <gamemode> <tier>` - Grant tier to player
- `/grant-achievement <player> <achievement>` - Give achievement
- `/queue add <username>` - Add to queue
- `/queue remove <username>` - Remove from queue
- `/queue list` - Show current queue
- `/tester add/remove <user>` - Toggle tester role

### How It Works
1. Player runs `/register Marlo` → Bot checks if username exists in DB, creates record
2. Admin runs `/grant-tier Marlo vanilla HT1` → Bot updates DB tier
3. Queue system stored in-memory (JSON file for persistence)

**Tech Stack:** discord.js, Supabase

---

## Plan B: Advanced Queue & Matchmaking Bot (Recommended)

**Best for:** Active server with regular matches

### Core Features
- **Queue System**
  - `/queue join` - Join matchmaking queue
  - `/queue leave` - Leave queue
  - `/queue status` - Show queue count and estimated wait
  - Auto-match when 2 players in queue
  - Region-based queue (NA/EU/ASIA/LKA)

- **Match System**
  - `/match create` - Create a custom match
  - `/match report <winner> <loser>` - Report match result
  - Auto-calculate points after match
  - Auto-update tier based on points

- **Tester Management**
  - `/tester status` - Check if you're a tester
  - `/tester add <user>` - Grant tester (admin)
  - `/tester remove <user>` - Remove tester (admin)
  - Testers can access exclusive commands

- **Player Management**
  - All Plan A features
  - `/profile <user>` - Full player profile
  - `/stats <player>` - Detailed stats
  - `/history <player>` - Recent matches

- **Tier Management**
  - `/tier check <player>` - Check current tier
  - `/tier set <player> <gamemode> <tier>` - Set tier manually
  - Auto tier promotion/demotion based on points

### How It Works
1. Player runs `/queue join` → Bot adds to queue with region
2. When 2+ players queued → Bot creates match, DMs both players
3. After match, winner runs `/match report @winner @loser`
4. Bot calculates points, updates DB, announces result

**Tech Stack:** discord.js, Supabase, Node-cron (scheduled tasks)

---

## Plan C: Full-Featured Ecosystem Bot

**Best for:** Large server, tournaments, economy

### Everything in Plan B plus:

- **Tournament System**
  - `/tournament create <name> <gamemode> <max_players>`
  - `/tournament join` - Register for tournament
  - `/tournament start` - Begin tournament
  - `/tournament bracket` - Show bracket
  - Auto elimination, final winner announced

- **Economy & Rewards**
  - Points earned from matches
  - `/balance` - Check player points
  - `/shop` - Redeem points for rewards
  - Weekly point bonuses for top players

- **Activity & Stats**
  - `/activity` - Server activity stats
  - `/most-active` - Most matches this week
  - `/win-streak <player>` - Current win streak
  - Leaderboards by gamemode, region

- **Role Management**
  - Auto-role based on tier (HT1, HT2, etc.)
  - Region roles (NA, EU, ASIA, LKA)
  - Achievement role badges

- **Moderation**
  - `/ban <player>` - Ban from system
  - `/unban <player>` - Lift ban
  - `/blacklist` - List banned players
  - Match dispute system

- **Web Dashboard Integration**
  - Generate dashboard links
  - View pending applications
  - Approve/reject registrations

### How It Works
1. Full integration with website
2. Tournament brackets generated automatically
3. Points economy drives engagement
4. Roles sync with tier changes

**Tech Stack:** discord.js, Supabase, Express.js (dashboard API), Redis (caching)

---

## Quick Comparison

| Feature | Plan A | Plan B | Plan C |
|---------|--------|--------|--------|
| Queue System | Basic | Advanced | Advanced |
| Match Reporting | ✗ | ✓ | ✓ |
| Tester Management | ✓ | ✓ | ✓ |
| Tier Commands | ✓ | ✓ | ✓ |
| Achievement Commands | ✓ | ✓ | ✓ |
| Tournaments | ✗ | ✗ | ✓ |
| Economy/Shop | ✗ | ✗ | ✓ |
| Auto Roles | ✗ | ✗ | ✓ |
| Moderation | ✗ | ✗ | ✓ |

---

## Recommended: Start with Plan B

Plan B gives you everything you need without overcomplicating:
- Queue + matchmaking
- Match reporting with auto points
- Tester system
- Full tier/achievement management

You can always upgrade to Plan C later.
