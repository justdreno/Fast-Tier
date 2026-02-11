'use client'

import { memo, useMemo, useState, useCallback } from 'react'
import Image from 'next/image'
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

// Memoized card styles to prevent recalculation
const CARD_STYLES = {
  1: {
    container: 'bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706]',
    stripe: 'from-yellow-400/30 to-transparent',
    number: 'text-yellow-900/40',
    accent: 'text-yellow-900',
    subtext: 'text-yellow-800/80',
    border: 'border-yellow-500/50',
    shadow: 'shadow-yellow-500/20',
  },
  2: {
    container: 'bg-gradient-to-br from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af]',
    stripe: 'from-gray-300/40 to-transparent',
    number: 'text-gray-900/30',
    accent: 'text-gray-900',
    subtext: 'text-gray-700/80',
    border: 'border-gray-400/50',
    shadow: 'shadow-gray-400/20',
  },
  3: {
    container: 'bg-gradient-to-br from-[#fdba74] via-[#fb923c] to-[#ea580c]',
    stripe: 'from-orange-300/30 to-transparent',
    number: 'text-orange-900/30',
    accent: 'text-orange-900',
    subtext: 'text-orange-800/80',
    border: 'border-orange-500/50',
    shadow: 'shadow-orange-500/20',
  },
  default: {
    container: 'bg-card/80 backdrop-blur-sm',
    stripe: 'from-orange-500/10 to-transparent',
    number: 'text-orange-500/20',
    accent: 'text-foreground',
    subtext: 'text-muted-foreground',
    border: 'border-white/10',
    shadow: 'shadow-black/10',
  }
}

// Minecraft face component with fallback
function MinecraftFace({ username, size = 48 }: { username: string; size?: number }) {
  const [hasError, setHasError] = useState(false)
  
  // Use minotar API for 2D face render with Steve fallback
  const faceUrl = `https://minotar.net/helm/${username}/${size}`
  const steveUrl = `https://minotar.net/helm/Steve/${size}`

  if (hasError) {
    return (
      <div 
        className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-xl font-bold text-white">{username.charAt(0)}</span>
      </div>
    )
  }

  return (
    <Image
      src={faceUrl}
      alt={`${username}'s skin`}
      width={size}
      height={size}
      className="rounded-lg"
      onError={() => setHasError(true)}
      unoptimized // Disable Next.js image optimization for external URLs
    />
  )
}

function PlayerCardComponent({
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

  // Memoize expensive calculations
  const winRate = useMemo(() => {
    return ((wins / (wins + losses)) * 100).toFixed(1)
  }, [wins, losses])

  // Memoize card styles
  const styles = useMemo(() => {
    return CARD_STYLES[rank as keyof typeof CARD_STYLES] || CARD_STYLES.default
  }, [rank])

  // Memoize callback to prevent unnecessary re-renders
  const handleClick = useCallback(() => setShowModal(true), [])
  const handleClose = useCallback(() => setShowModal(false), [])

  // Memoize tier badges slice
  const displayedTiers = useMemo(() => tiers.slice(0, 4), [tiers])

  const isTop3 = rank <= 3

  return (
    <>
      <PlayerProfileModal
        isOpen={showModal}
        onClose={handleClose}
        player={{ name, tier, rank, region, wins, losses, tiers, stats }}
      />
      <button 
        onClick={handleClick} 
        className="w-full slide-in-right group relative text-left will-change-transform"
      >
        <div className={`
          relative overflow-hidden rounded-xl 
          ${isTop3 ? styles.container : 'glass-morphism'}
          border ${styles.border}
          shadow-lg ${styles.shadow}
          hover:scale-[1.02] hover:shadow-xl
          transition-transform duration-300 ease-out
          cursor-pointer
        `}>
          {/* Diagonal stripe overlay */}
          <div 
            className={`
              absolute inset-0 bg-gradient-to-br ${styles.stripe}
              transform -skew-x-12 origin-top-left
            `}
            style={{ width: '40%' }}
          />
          
          {/* Content */}
          <div className="relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
            {/* Large rank number */}
            <div className="flex-shrink-0 relative">
              <span className={`
                text-4xl sm:text-5xl font-black ${styles.number}
                leading-none
              `}>
                {rank}.
              </span>
            </div>

            {/* Minecraft Face Avatar */}
            <div className="flex-shrink-0">
              <MinecraftFace username={name} size={48} />
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <h3 className={`text-base sm:text-lg font-bold truncate ${styles.accent}`}>
                  {name}
                </h3>
              </div>
              <div className={`text-xs sm:text-sm ${styles.subtext}`}>
                <span className="font-medium hidden sm:inline">{tier}</span>
                <span className="font-medium sm:hidden">{tier.split(' ')[1] || tier}</span>
                <span className="mx-1 sm:mx-2">•</span>
                <span>{winRate}% WR</span>
              </div>
            </div>

            {/* Region Badge */}
            <div className="flex-shrink-0 hidden sm:block">
              <span className={`
                px-2.5 py-1 rounded-lg text-xs font-bold
                ${isTop3 
                  ? 'bg-black/10 text-black/70' 
                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'}
              `}>
                {region}
              </span>
            </div>

            {/* Tier Badges - Only on larger screens */}
            <div className="flex-shrink-0 hidden xl:flex items-center gap-0.5">
              {displayedTiers.map((t, i) => (
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

export default memo(PlayerCardComponent)
