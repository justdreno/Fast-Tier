# FastTier Discord Bot - Complete Tier Testing System

## Your Tier Testing Workflow (Main Feature)

### 1. Tester Management (Admin)
- `/tester add <user>` - Admin adds tester to bot
- `/tester remove <user>` - Admin removes tester
- `/tester list` - List all testers

### 2. Player Application
Players apply for tier test:
- **Via Website:** Apply page → `applications` table in DB
- **Via Discord:** `/apply` command
- Application includes: Minecraft username, Discord username, Discord ID, region
- Status flow: `pending` → `invited` → `testing` → `completed` or `expired`

### 3. Queue System
- `/queue list` - View all pending applications
- `/queue remove <player>` - Admin removes from queue
- Players can only have 1 active application
- Queue ordered by `created_at`

### 4. Tester Flow

```
/available → Bot fetches queue → Filters players IN Discord server → Shows list
     ↓
Tester selects player number → Bot DMs player: "Accept invite for tier test?"
     ↓
Player has 3 minutes to respond
     ↓
[Accept] → Bot creates ticket channel → Tester + Player added → Grant tier
         → [Decline/Timeout] → Player moved to end of queue → Tester notified to pick next
```

### 5. Commands

**Admin:**
| Command | Description |
|---------|-------------|
| `/tester add <user>` | Add tester |
| `/tester remove <user>` | Remove tester |
| `/queue remove <player>` | Remove from queue |

**Tester:**
| Command | Description |
|---------|-------------|
| `/available` | Show players in queue who are in server |
| `/invite <player>` | Send invite to specific player |
| `/cancel-invite <player>` | Cancel pending invite |
| `/tier grant <player> <gamemode> <tier>` | Grant tier after test |
| `/ticket close` | Close testing ticket |

**Player:**
| Command | Description |
|---------|-------------|
| `/apply` | Apply for tier test |
| `/my-application` | Check application status |
| `/cancel-application` | Cancel pending application |

### 6. Ticket System
- Auto-create channel: `testing-{player}-{gamemode}`
- Add tester + player to channel
- Show player stats, current tier, target tier
- Close ticket → Prompt to grant tier

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN                                   │
│   /tester add @user                                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PLAYER                                     │
│   /apply or Website Apply                                       │
│   → Added to queue (status: pending)                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TESTER                                     │
│   /available                                                    │
│   → Bot filters: queue + in Discord server                    │
│   → Shows: 1. Marlo (NA), 2. ProGamer (EU), 3. Slayer (ASIA)│
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
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test queue table
CREATE TABLE test_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id),
  discord_user_id VARCHAR(20) NOT NULL,
  discord_username VARCHAR(100) NOT NULL,
  gamemode_id UUID REFERENCES gamemodes(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, invited, testing, completed, expired
  invited_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  tested_by UUID REFERENCES testers(id),
  ticket_channel_id VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_test_queue_status ON test_queue(status);
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

---

## Tech Stack

- **discord.js** - Bot framework
- **Supabase** - Database
- **node-cron** - Timeout checker
- **discord-modals** - For accept/decline buttons
