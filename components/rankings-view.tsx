'use client'

import { useState, useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import Image from 'next/image'
import PlayerCard from '@/components/player-card'
import RegionFilter from '@/components/region-filter'

interface RankingsViewProps {
  gameMode: string
}

// Mock data - will be replaced with Supabase data
const MOCK_PLAYERS = [
  {
    id: 1,
    rank: 1,
    name: 'Marlowww',
    tier: 'Combat Grandmaster',
    wins: 1250,
    losses: 156,
    region: 'NA',
    tiers: ['HT1', 'HT2', 'HT3', 'HT4', 'LT1', 'LT2', 'LT3', 'LT4', 'UNRANKED'],
  },
  {
    id: 2,
    rank: 2,
    name: 'ItzRealMe',
    tier: 'Combat Master',
    wins: 1180,
    losses: 201,
    region: 'NA',
    tiers: ['HT1', 'HT3', 'HT2', 'HT4', 'LT1', 'LT2', 'LT3', 'LT4', 'UNRANKED'],
  },
  {
    id: 3,
    rank: 3,
    name: 'Swight',
    tier: 'Combat Master',
    wins: 1050,
    losses: 245,
    region: 'NA',
    tiers: ['HT1', 'HT2', 'HT4', 'HT3', 'LT1', 'LT2', 'LT4', 'LT3', 'UNRANKED'],
  },
  {
    id: 4,
    rank: 4,
    name: 'IceKing99',
    tier: 'Combat Cadet',
    wins: 920,
    losses: 310,
    region: 'NA',
    tiers: ['HT2', 'HT3', 'HT4', 'HT1', 'LT2', 'LT1', 'LT3', 'LT4', 'UNRANKED'],
  },
  {
    id: 5,
    rank: 5,
    name: 'NovaStrike',
    tier: 'Combat Cadet',
    wins: 850,
    losses: 380,
    region: 'EU',
    tiers: ['HT3', 'HT4', 'HT2', 'HT1', 'LT2', 'LT3', 'LT1', 'LT4', 'UNRANKED'],
  },
  {
    id: 6,
    rank: 6,
    name: 'ShadowNinja',
    tier: 'Combat Novice',
    wins: 780,
    losses: 420,
    region: 'EU',
    tiers: ['HT4', 'HT3', 'HT2', 'HT1', 'LT3', 'LT2', 'LT4', 'LT1', 'UNRANKED'],
  },
  {
    id: 7,
    rank: 7,
    name: 'InfernoBlaze',
    tier: 'Combat Novice',
    wins: 650,
    losses: 520,
    region: 'NA',
    tiers: ['LT1', 'LT2', 'LT3', 'LT4', 'HT1', 'HT2', 'HT3', 'HT4', 'UNRANKED'],
  },
  {
    id: 8,
    rank: 8,
    name: 'CrimsonFury',
    tier: 'Combat Trainee',
    wins: 580,
    losses: 580,
    region: 'NA',
    tiers: ['LT2', 'LT3', 'LT4', 'LT1', 'HT2', 'HT3', 'HT4', 'HT1', 'UNRANKED'],
  },
  {
    id: 9,
    rank: 9,
    name: 'VortexX',
    tier: 'Combat Trainee',
    wins: 520,
    losses: 640,
    region: 'EU',
    tiers: ['LT3', 'LT4', 'LT1', 'LT2', 'HT3', 'HT4', 'HT1', 'HT2', 'UNRANKED'],
  },
  {
    id: 10,
    rank: 10,
    name: 'EchoVoid',
    tier: 'Combat Beginner',
    wins: 420,
    losses: 750,
    region: 'Asia',
    tiers: ['LT4', 'LT3', 'LT2', 'LT1', 'HT4', 'HT3', 'HT2', 'HT1', 'UNRANKED'],
  },
]

const STATS_BY_MODE = {
  'Vanilla': { tier: 'Combat Master', rank: 2, points: 420 },
  'UHC': { tier: 'Combat Grandmaster', rank: 1, points: 435 },
  'Pot': { tier: 'Combat Master', rank: 5, points: 380 },
  'NethOP': { tier: 'Combat Cadet', rank: 15, points: 280 },
}

export default function RankingsView({ gameMode }: RankingsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const isOverallMode = gameMode === 'Overall'

  // Memoize filtered players to prevent recalculation on every render
  const filteredPlayers = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return MOCK_PLAYERS.filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(query)
      const matchesRegion = !selectedRegion || player.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [searchQuery, selectedRegion])

  // Memoize callbacks to prevent unnecessary child re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleRegionChange = useCallback((region: string | null) => {
    setSelectedRegion(region)
  }, [])

  if (isOverallMode) {
    // Overall Mode - Premium card layout with top 3
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 fade-in-up">
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              <span className="gradient-text-orange">{gameMode}</span>
            </h1>
            <p className="text-lg text-muted-foreground">Explore the best PvP players across all game modes</p>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-12 h-12 bg-secondary/50 border-white/10 focus:border-primary focus:ring-primary text-base"
                />
              </div>
              <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredPlayers.length} players
          </div>

          {/* Rankings List */}
          <div className="fade-in-up">
            {filteredPlayers.length > 0 ? (
              <div className="space-y-3">
                {filteredPlayers.map((player, index) => (
                  <div key={player.id} style={{ animationDelay: `${index * 50}ms` }} className="fade-in-up">
                    <PlayerCard
                      rank={player.rank}
                      name={player.name}
                      tier={player.tier}
                      wins={player.wins}
                      losses={player.losses}
                      region={player.region}
                      tiers={player.tiers}
                      stats={STATS_BY_MODE}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No players found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  // Other Game Modes - Simplified list layout
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 fade-in-up">
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            <span className="gradient-text-orange">{gameMode}</span>
          </h1>
          <p className="text-lg text-muted-foreground">Top players in {gameMode} mode</p>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 h-12 bg-secondary/50 border-white/10 focus:border-primary focus:ring-primary text-base"
              />
            </div>
            <RegionFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
          </div>
        </div>

        {/* Simplified Table View */}
        <div className="fade-in-up">
          {filteredPlayers.length > 0 ? (
            <div className="glass-morphism rounded-xl border border-white/10 overflow-x-auto scrollbar-hide">
              <div className="min-w-[500px]">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 bg-secondary/30 px-6 py-4 border-b border-white/10">
                  <div className="col-span-1 text-xs font-bold text-muted-foreground uppercase">Rank</div>
                  <div className="col-span-4 text-xs font-bold text-muted-foreground uppercase">Player</div>
                  <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase">Tier</div>
                  <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase">Region</div>
                  <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase text-right">W/L</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                  {filteredPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="fade-in-up grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/20 transition-colors items-center"
                    >
                      <div className="col-span-1">
                        <span className="font-black text-lg text-primary">{player.rank}</span>
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <Image
                          src={`https://minotar.net/helm/${player.name}/32`}
                          alt={`${player.name}'s skin`}
                          width={32}
                          height={32}
                          className="rounded"
                          unoptimized
                        />
                        <p className="font-bold text-foreground truncate">{player.name}</p>
                      </div>
                      <div className="col-span-3">
                        <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs font-bold border border-orange-500/30 truncate inline-block max-w-full">
                          {player.tier}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-sm font-medium">{player.region}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-bold">
                          {player.wins}:{player.losses}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No players found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
