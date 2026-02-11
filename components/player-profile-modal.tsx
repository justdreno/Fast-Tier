'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import TierBadge from './tier-badge'

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

export default function PlayerProfileModal({ isOpen, onClose, player }: PlayerProfileModalProps) {
  if (!isOpen) return null

  const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
  const tiers = player.tiers || ['HT1', 'HT2', 'HT3', 'HT4', 'LT1', 'LT2', 'LT3', 'LT4', 'UNRANKED']

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pt-20 pb-8 px-4 sm:px-6 overflow-y-auto">
        <div className="fade-in-up relative w-full max-w-sm">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors z-50"
            aria-label="Close modal"
          >
            <X size={32} />
          </button>

          {/* Card */}
          <div className="glass-morphism rounded-2xl p-8 border border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl animate-in fade-in">
                <span className="text-6xl font-black text-white">{player.name.charAt(0)}</span>
              </div>
            </div>

            {/* Player Name & Tier */}
            <h1 className="text-3xl font-black text-center mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '100ms' }}>
              {player.name}
            </h1>
            <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '200ms' }}>
              <span className="bg-orange-500/20 text-orange-300 px-4 py-1 rounded-full text-sm font-bold border border-orange-500/30">
                {player.tier}
              </span>
            </div>

            {/* Position */}
            <div className="bg-secondary/40 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '300ms' }}>
              <p className="text-xs text-muted-foreground text-center mb-1">POSITION</p>
              <p className="text-center text-2xl font-black">
                <span className="gradient-text-orange">#{player.rank}.</span> OVERALL (30 points)
              </p>
            </div>

            {/* Tiers Grid - 9 Tiers */}
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '400ms' }}>
              <p className="text-xs text-muted-foreground mb-3 uppercase">TIERS</p>
              <div className="grid grid-cols-9 gap-1">
                {tiers.map((tier, i) => (
                  <div key={i} style={{ animationDelay: `${450 + i * 30}ms` }} className="animate-in fade-in">
                    <TierBadge tier={tier} label={tier} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '500ms' }}>
              <div className="bg-secondary/40 rounded-lg p-3 text-center hover:bg-secondary/60 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">WINS</p>
                <p className="text-xl font-black text-green-400">{player.wins}</p>
              </div>
              <div className="bg-secondary/40 rounded-lg p-3 text-center hover:bg-secondary/60 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">LOSSES</p>
                <p className="text-xl font-black text-red-400">{player.losses}</p>
              </div>
              <div className="bg-secondary/40 rounded-lg p-3 text-center hover:bg-secondary/60 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">WINRATE</p>
                <p className="text-xl font-black text-yellow-400">{winRate}%</p>
              </div>
            </div>

            {/* Region */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '600ms' }}>
              <span className="text-sm text-muted-foreground">Region:</span>
              <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded text-sm font-bold border border-red-500/30">
                {player.region}
              </span>
            </div>

            {/* Game Modes */}
            {player.stats && Object.entries(player.stats).length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: '700ms' }}>
                <p className="text-xs text-muted-foreground mb-4 uppercase">Game Modes</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(player.stats).map(([mode, stat]) => (
                    <div key={mode} className="flex items-center justify-between text-sm p-2 hover:bg-secondary/20 rounded transition-colors">
                      <span className="text-muted-foreground capitalize">{mode}</span>
                      <span className="font-bold">
                        #{stat.rank} {stat.points}pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
