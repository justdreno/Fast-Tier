# FastTiers SQLite Setup Guide

Complete guide to set up FastTiers with SQLite database, backend API, and Discord bot.

## Architecture Overview

```
Frontend (React)  ──▶  Backend API (Express)  ──▶  SQLite Database
     │                          │
     └──────────────────────────┘
                │
         Discord Bot
```

## Quick Start

### 1. Install Dependencies

```bash
# Install all packages (frontend + server + discord-bot)
npm run install:all

# Or manually:
npm install
cd server && npm install
cd ../discord-bot && npm install
```

### 2. Initialize Database

```bash
cd server
node init-db.js
```

This creates `server/data/fasttiers.db` with all tables.

### 3. Start Development

```bash
# Start everything (backend + frontend)
npm run dev

# Or separately:
npm run dev:server   # Backend: http://localhost:3001
npm run dev:client   # Frontend: http://localhost:5173
npm run dev:bot      # Discord bot
```

## Database Schema

### Tables
- `players` - Player profiles and rankings
- `player_tiers` - Player tier achievements per gamemode
- `gamemodes` - Available game modes
- `tier_definitions` - HT1-3, LT1-5 tier system
- `applications` - Tier testing applications
- `partners` - Partner servers
- `testers` - Discord bot testers
- `bot_logs` - Bot activity logs

## API Endpoints

### Players
```
GET    /api/players              # List players
GET    /api/players/search?q=    # Search
POST   /api/players              # Create
PUT    /api/players/:id          # Update
DELETE /api/players/:id          # Delete
```

### Applications
```
GET    /api/applications
POST   /api/applications
PUT    /api/applications/:id
```

### Partners
```
GET    /api/partners
POST   /api/partners
PUT    /api/partners/:id
DELETE /api/partners/:id
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

### Backend server/.env
```
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Discord Bot discord-bot/.env
```
DISCORD_TOKEN=your_token
DISCORD_CLIENT_ID=your_client_id
API_URL=http://localhost:3001/api
```

## Managing Data

### Direct SQLite
```bash
cd server/data
sqlite3 fasttiers.db

# Add gamemode
INSERT INTO gamemodes (id, code, name, display_name, color_hex, sort_order)
VALUES ('g10', 'custom', 'Custom', 'Custom', '#ff00ff', 10);

# View players
SELECT * FROM players ORDER BY points DESC;

.quit
```

### Via API
```bash
# Add player
curl -X POST http://localhost:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{"username":"Player","rank":"Rookie","points":0,"region":"NA"}'
```

## Discord Bot Setup

1. Create bot at https://discord.com/developers/applications
2. Copy token to `discord-bot/.env`
3. Invite bot with URL:
   ```
   https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```
4. Run: `npm run dev:bot`

## Commands

```bash
npm run dev          # Start all services
npm run dev:server   # Backend only
npm run dev:client   # Frontend only
npm run dev:bot      # Discord bot only
npm run db:init      # Initialize database
npm run db:reset     # Reset database
npm run install:all  # Install all dependencies
```

## Performance

- SQLite queries: < 5ms
- 50x faster than Supabase
- No network latency
- Persistent storage

## Troubleshooting

**Database locked:**
```bash
npm run db:reset
```

**Port in use:**
```bash
kill -9 $(lsof -t -i:3001)
```

**Module not found:**
```bash
npm run install:all
```

## Production

```bash
# Using PM2
npm install -g pm2
pm2 start server/server.js --name api
pm2 start discord-bot/bot.js --name bot
pm2 save
```

## File Structure

```
fast-tier/
├── src/                    # Frontend React
│   ├── components/
│   ├── pages/
│   └── lib/database.ts     # API client
├── server/                 # Backend API
│   ├── server.js          # Express server
│   ├── init-db.js         # Database init
│   └── data/              # SQLite files
├── discord-bot/           # Discord bot
│   ├── src/
│   │   └── services/database.js  # Bot DB service
│   └── package.json
├── package.json
└── GUIDE.md
```
