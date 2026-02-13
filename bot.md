# FastTier Discord Bot - Complete Tier Testing System

## Your Tier Testing Workflow (Main Feature)

### 1. Tester Management (Admin)
- `/tester add <user> [all|<gamemode1>,<gamemode2>,...]` - Add tester with permissions
  - `all` = Can test ALL gamemodes
  - `vanilla,uhc,pot` = Can only test specific gamemodes
- `/tester remove <user>` - Admin removes tester
- `/tester list` - List all testers with their permissions

### 2. Tester Permissions System
- **Full Tester** (`can_test_all = true`): Can test ANY gamemode
- **Limited Tester** (`can_test_all = false`): Can only test gamemodes in `tester_gamemodes` table
- When `/available` runs, bot filters queue by: tester permissions + player requested gamemode

### 3. Player Application
Players apply for tier test:
- **Via Website:** Apply page → `applications` table in DB
- **Via Discord:** `/apply` command
- Application includes: Minecraft username, Discord username, Discord ID, region, **gamemode**
- Status flow: `pending` → `invited` → `testing` → `completed` or `expired`

### 4. Queue System
- `/queue list` - View all pending applications
- `/queue remove <player>` - Admin removes from queue
- Players can only have 1 active application
- Queue ordered by `created_at`

### 5. Tester Flow with Gamemode Filtering

```
/available → Bot fetches queue → Filters:
                                   1. Players IN Discord server
                                   2. Gamemode matches tester's permissions
                                   → Shows filtered list
     ↓
Tester selects player number → Bot DMs player: 
  "Accept invite for [gamemode] tier test?"
     ↓
Player has 3 minutes to respond
     ↓
[Accept] → Bot creates ticket channel → Tester + Player added → Grant tier
         → [Decline/Timeout] → Player moved to end of queue → Tester notified
```

**Example:**
- Tester A can test: `vanilla, uhc, pot`
- Tester B can test: `ALL` gamemodes
- Player applied for: `vanilla`
- `/available` shows player to BOTH testers
- Player applied for: `mace`
- `/available` shows player ONLY to Tester B

### 6. Commands

**Admin:**
| Command | Description |
|---------|-------------|
| `/tester add <user> all` | Add tester (can test ALL gamemodes) |
| `/tester add <user> vanilla,uhc,pot` | Add tester (limited to specific gamemodes) |
| `/tester remove <user>` | Remove tester |
| `/tester list` | List all testers and their permissions |
| `/queue remove <player>` | Remove from queue |

**Tester:**
| Command | Description |
|---------|-------------|
| `/available` | Show players in queue (filtered by your permissions) |
| `/invite <player>` | Send invite to specific player |
| `/cancel-invite <player>` | Cancel pending invite |
| `/tier grant <player> <gamemode> <tier>` | Grant tier after test |
| `/ticket close` | Close testing ticket |

**Player:**
| Command | Description |
|---------|-------------|
| `/apply <gamemode>` | Apply for tier test (specify gamemode) |
| `/my-application` | Check application status |
| `/cancel-application` | Cancel pending application |

### 7. Ticket System
- Auto-create channel: `testing-{player}-{gamemode}`
- Add tester + player to channel
- Show player stats, current tier, target tier
- Close ticket → Prompt to grant tier

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN                                   │
│   /tester add @ProTester all                                   │
│   /tester add @NewTester vanilla,uhc,sword                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PLAYER                                     │
│   /apply vanilla or Website Apply (select vanilla)             │
│   → Added to queue (status: pending, gamemode: vanilla)        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TESTER A (can test ALL)                    │
│   /available                                                    │
│   → Shows: 1. Marlo (vanilla, NA)                              │
│                                                                 │
│                      TESTER B (vanilla,uhc,sword only)         │
│   /available                                                    │
│   → Shows: 1. Marlo (vanilla, NA) ← CAN TEST                   │
│            2. ProGamer (mace, EU) ← FILTERED OUT               │
│                                                                 │
│   Tester selects: 1                                             │
│   → Bot DMs Marlo: "Accept invite for vanilla tier test?"      │
│                                                                 │
│   [3 minutes timeout]                                           │
│                                                                 │
│   ✓ Accept → Create ticket → /tier grant Marlo vanilla HT1    │
│   ✗ Decline/Timeout → Move to end of queue → Notify tester   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```sql
-- Testers table
CREATE TABLE testers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_user_id VARCHAR(20) UNIQUE NOT NULL,
  discord_username VARCHAR(100) NOT NULL,
  can_test_all BOOLEAN DEFAULT false, -- Can test all gamemodes if true
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tester gamemode permissions (for limited testers)
CREATE TABLE tester_gamemodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tester_id UUID NOT NULL REFERENCES testers(id) ON DELETE CASCADE,
  gamemode_id UUID NOT NULL REFERENCES gamemodes(id) ON DELETE CASCADE,
  UNIQUE(tester_id, gamemode_id)
);

-- Test queue table (applications)
CREATE TABLE test_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id),
  discord_user_id VARCHAR(20) NOT NULL,
  discord_username VARCHAR(100) NOT NULL,
  gamemode_id UUID REFERENCES gamemodes(id), -- Gamemode they want to test
  status VARCHAR(20) DEFAULT 'pending', -- pending, invited, testing, completed, expired
  invited_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  tested_by UUID REFERENCES testers(id),
  ticket_channel_id VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_testers_active ON testers(is_active);
CREATE INDEX idx_tester_gamemodes_tester ON tester_gamemodes(tester_id);
CREATE INDEX idx_tester_gamemodes_gamemode ON tester_gamemodes(gamemode_id);
CREATE INDEX idx_test_queue_status ON test_queue(status);
CREATE INDEX idx_test_queue_gamemode ON test_queue(gamemode_id);
CREATE INDEX idx_test_queue_created ON test_queue(created_at);
```

---

## Timeout Handling

- 3-minute window for player response
- `expires_at` column tracks invite deadline
- Cron job runs every minute to check:
  - Expired invites → set status to `expired`
  - Move player to end of queue
  - Notify tester: "Player didn't respond, pick next"

---

## Additional Features

### Queue Priority
- First come, first serve
- Max 3 expired invites per player per day
- After 3rd expire → remove from queue entirely

### Ticket Permissions
- Private channel (only tester + player)
- Auto-delete ticket after tier granted
- Log: player, tester, gamemode, result

### Gamemode Permission Examples

**Add full tester:**
```
/tester add @ProTester all
```
→ `can_test_all = true`, no entries in `tester_gamemodes`

**Add limited tester:**
```
/tester add @NewTester vanilla,uhc,pot
```
→ `can_test_all = false`, entries added to `tester_gamemodes` for vanilla, uhc, pot

**Check permissions:**
```
/tester list
```
→ Shows:
```
@ProTester - Can test: ALL gamemodes
@NewTester - Can test: vanilla, uhc, pot
```

---

## Tech Stack

- **discord.js** - Bot framework
- **Supabase** - Database
- **node-cron** - Timeout checker
- **discord-modals** - For accept/decline buttons
