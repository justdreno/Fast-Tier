'use client'

import { memo, useMemo } from 'react'
import { X } from 'lucide-react'
import TierBadge from './tier-badge'
import SkinViewer3D from './skin-viewer'

interface PlayerProfileModalProps {
  isOpen: boolean
  onClose: () => void
  player: {
    name: string
    tier: string
    rank: number
    region: string
    wins: number
    losses: number
    tiers?: string[]
    stats?: Record<string, { tier: string; rank: number; points: number }>
  }
}

function PlayerProfileModalComponent({ isOpen, onClose, player }: PlayerProfileModalProps) {
  // Early return if not open - prevents unnecessary calculations
  if (!isOpen) return null

  // Memoize expensive calculations
  const winRate = useMemo(() => {
    return ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
  }, [player.wins, player.losses])

  // Memoize tiers array
  const tiers = useMemo(() => 
    player.tiers || ['HT1', 'HT2', 'HT3', 'HT4', 'LT1', 'LT2', 'LT3', 'LT4', 'UNRANKED']
  , [player.tiers])

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 will-change-opacity" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="fade-in-up relative w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide will-change-transform">
          {/* Close Button - Fixed position on card */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-50 bg-black/20 hover:bg-black/40 rounded-full p-2"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Card */}
          <div className="glass-morphism rounded-2xl p-4 sm:p-6 border border-white/10 relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -z-10" />

            {/* 3D Skin Viewer */}
            <div className="flex justify-center mb-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <SkinViewer3D 
                  username={player.name} 
                  width={160} 
                  height={160}
                />
              </div>
            </div>

            {/* Player Name & Tier */}
            <h1 className="text-xl sm:text-2xl font-black text-center mb-2">
              {player.name}
            </h1>
            <div className="flex justify-center mb-4">
              <span className="bg-orange-500/20 text-orange-300 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold border border-orange-500/30">
                {player.tier}
              </span>
            </div>

            {/* Position */}
            <div className="bg-secondary/40 rounded-xl p-3 mb-4">
              <p className="text-xs text-muted-foreground text-center mb-1">POSITION</p>
              <p className="text-center text-lg sm:text-xl font-black">
                <span className="gradient-text-orange">#{player.rank}</span> OVERALL
              </p>
            </div>

            {/* Tiers Grid - 9 Tiers */}
            <div className="mb-4 pt-8 pb-2">
              <p className="text-xs text-muted-foreground mb-2 uppercase">TIERS</p>
              <div className="flex flex-wrap justify-center gap-2">
                {tiers.map((tier, i) => (
                  <div key={i} className="flex-shrink-0">
                    <TierBadge tier={tier} label={tier} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="bg-secondary/40 rounded-lg p-2 sm:p-3 text-center hover:bg-secondary/60 transition-colors">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">WINS</p>
                <p className="text-base sm:text-lg font-black text-green-400">{player.wins}</p>
              </div>
              <div className="bg-secondary/40 rounded-lg p-2 sm:p-3 text-center hover:bg-secondary/60 transition-colors">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">LOSSES</p>
                <p className="text-base sm:text-lg font-black text-red-400">{player.losses}</p>
              </div>
              <div className="bg-secondary/40 rounded-lg p-2 sm:p-3 text-center hover:bg-secondary/60 transition-colors">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">WINRATE</p>
                <p className="text-base sm:text-lg font-black text-yellow-400">{winRate}%</p>
              </div>
            </div>

            {/* Region */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
              <span className="text-sm text-muted-foreground">Region:</span>
              <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-sm font-bold border border-red-500/30">
                {player.region}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(PlayerProfileModalComponent)
