'use client'

import { useState } from 'react'
import TierBadge from './tier-badge'
import PlayerProfileModal from './player-profile-modal'

interface PlayerCardProps {
  rank: number
  name: string
  tier: string
  wins: number
  losses: number
  region: string
  tierColor?: string
  tiers?: string[]
  stats?: Record<string, { tier: string; rank: number; points: number }>
}

export default function PlayerCard({
  rank,
  name,
  tier,
  wins,
  losses,
  region,
  tiers = ['HT1', 'HT2', 'HT3', 'HT4', 'LT1', 'LT2', 'LT3', 'LT4'],
  stats = {},
}: PlayerCardProps) {
  const [showModal, setShowModal] = useState(false)
  const winRate = ((wins / (wins + losses)) * 100).toFixed(1)

  // Different styles for top 3
  const isTop3 = rank <= 3
  const rankColors = {
    1: 'from-yellow-400 to-yellow-600',
    2: 'from-gray-300 to-gray-500',
    3: 'from-orange-400 to-orange-600',
  }

  const getRankStyle = () => {
    if (!isTop3) return { badge: 'from-orange-400 to-orange-600', size: 'w-16 h-16', textSize: 'text-2xl' }

    const color = rankColors[rank as 1 | 2 | 3]
    if (rank === 1) return { badge: color, size: 'w-20 h-20', textSize: 'text-3xl', scale: 'scale-105', shadow: 'shadow-2xl' }
    if (rank === 2) return { badge: color, size: 'w-18 h-18', textSize: 'text-2xl', scale: 'scale-100', shadow: 'shadow-lg' }
    return { badge: color, size: 'w-16 h-16', textSize: 'text-2xl', scale: 'scale-100', shadow: 'shadow-lg' }
  }

  const style = getRankStyle()

  const handleClick = () => setShowModal(true)

  if (rank === 1) {
    // 1st Place - Premium Style
    return (
      <>
        <PlayerProfileModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          player={{ name, tier, rank, region, wins, losses, tiers, stats }}
        />
        <button onClick={handleClick} className="w-full slide-in-right group relative mb-4 text-left">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/50 to-yellow-400/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          <div className={`relative glass-morphism rounded-2xl px-6 py-6 hover:bg-card/80 transition-all duration-300 cursor-pointer border-2 border-yellow-500/50 ${style.scale}`}>
            <div className="flex items-center gap-6">
              <div className={`flex-shrink-0 ${style.shadow}`}>
                <div className={`${style.size} bg-gradient-to-br ${style.badge} rounded-xl flex items-center justify-center`}>
                  <span className={`text-white font-black ${style.textSize}`}>👑</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-foreground mb-1">{name}</h3>
                <p className="text-sm text-yellow-300 font-bold mb-3">{tier}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Win Rate: </span>
                    <span className="font-bold text-yellow-300">{winRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Record: </span>
                    <span className="font-bold text-yellow-300">{wins}W-{losses}L</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 hidden lg:flex items-center gap-1">
                {tiers.slice(0, 5).map((t, i) => (
                  <div key={i} className="scale-90">
                    <TierBadge tier={t} label={t} />
                  </div>
                ))}
              </div>
              <span className="flex-shrink-0 bg-yellow-500/30 text-yellow-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-500/50">
                {region}
              </span>
            </div>
          </div>
        </button>
      </>
    )
  }

  if (rank === 2) {
    // 2nd Place - Silver Style
    return (
      <>
        <PlayerProfileModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          player={{ name, tier, rank, region, wins, losses, tiers, stats }}
        />
        <button onClick={handleClick} className="w-full slide-in-right group relative mb-4 text-left">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400/40 to-gray-500/40 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          <div className={`relative glass-morphism rounded-xl px-5 py-5 hover:bg-card/80 transition-all duration-300 cursor-pointer border-2 border-gray-400/40`}>
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 ${style.shadow}`}>
                <div className={`${style.size} bg-gradient-to-br ${style.badge} rounded-lg flex items-center justify-center`}>
                  <span className={`text-gray-900 font-black ${style.textSize}`}>🥈</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
                  <span className="text-xs font-semibold text-gray-300">{tier}</span>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-muted-foreground">Win Rate: </span>
                    <span className="font-bold text-gray-300">{winRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Record: </span>
                    <span className="font-bold text-gray-300">{wins}W-{losses}L</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 hidden lg:flex items-center gap-1">
                {tiers.slice(0, 4).map((t, i) => (
                  <div key={i} className="scale-75">
                    <TierBadge tier={t} label={t} />
                  </div>
                ))}
              </div>
              <span className="flex-shrink-0 bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-semibold border border-red-500/30">
                {region}
              </span>
            </div>
          </div>
        </button>
      </>
    )
  }

  if (rank === 3) {
    // 3rd Place - Bronze Style
    return (
      <>
        <PlayerProfileModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          player={{ name, tier, rank, region, wins, losses, tiers, stats }}
        />
        <button onClick={handleClick} className="w-full slide-in-right group relative mb-4 text-left">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/40 to-amber-600/40 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          <div className={`relative glass-morphism rounded-xl px-5 py-5 hover:bg-card/80 transition-all duration-300 cursor-pointer border-2 border-orange-600/40`}>
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 ${style.shadow}`}>
                <div className={`${style.size} bg-gradient-to-br ${style.badge} rounded-lg flex items-center justify-center`}>
                  <span className={`text-white font-black ${style.textSize}`}>🥉</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
                  <span className="text-xs font-semibold text-orange-300">{tier}</span>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-muted-foreground">Win Rate: </span>
                    <span className="font-bold text-orange-300">{winRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Record: </span>
                    <span className="font-bold text-orange-300">{wins}W-{losses}L</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 hidden lg:flex items-center gap-1">
                {tiers.slice(0, 4).map((t, i) => (
                  <div key={i} className="scale-75">
                    <TierBadge tier={t} label={t} />
                  </div>
                ))}
              </div>
              <span className="flex-shrink-0 bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-semibold border border-red-500/30">
                {region}
              </span>
            </div>
          </div>
        </button>
      </>
    )
  }

  // Regular players
  return (
    <>
      <PlayerProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        player={{ name, tier, rank, region, wins, losses, tiers, stats }}
      />
      <button onClick={handleClick} className="w-full slide-in-right group relative mb-3 text-left">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

        <div className="relative glass-morphism rounded-xl px-5 py-4 hover:bg-card/80 transition-all duration-300 cursor-pointer border border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">{rank}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
                <span className="text-xs font-semibold bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">
                  {tier}
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div>
                  <span className="text-muted-foreground">Win Rate: </span>
                  <span className="font-bold text-yellow-400">{winRate}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Record: </span>
                  <span className="font-bold text-foreground">{wins}W-{losses}L</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <span className="bg-red-500/20 text-red-300 px-2.5 py-1 rounded text-xs font-semibold border border-red-500/30">
                {region}
              </span>
            </div>

            <div className="flex-shrink-0 hidden lg:flex items-center gap-1">
              {tiers.slice(0, 4).map((t, i) => (
                <div key={i} className="scale-75">
                  <TierBadge tier={t} label={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </button>
    </>
  )
}
