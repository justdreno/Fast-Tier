'use client'

import { memo, useMemo } from 'react'

interface TierBadgeProps {
  tier: string
  label: string
}

const tierInfo: Record<
  string,
  {
    bg: string
    color: string
    icon: string
    status: 'Peak' | 'Retired' | 'Normal'
  }
> = {
  'HT1': { bg: 'bg-red-500', color: 'text-white', icon: '🔴', status: 'Peak' },
  'HT2': { bg: 'bg-orange-500', color: 'text-white', icon: '🟠', status: 'Peak' },
  'HT3': { bg: 'bg-yellow-500', color: 'text-gray-900', icon: '🟡', status: 'Peak' },
  'HT4': { bg: 'bg-green-500', color: 'text-white', icon: '🟢', status: 'Peak' },
  'LT1': { bg: 'bg-cyan-500', color: 'text-gray-900', icon: '🔵', status: 'Normal' },
  'LT2': { bg: 'bg-blue-500', color: 'text-white', icon: '🔷', status: 'Normal' },
  'LT3': { bg: 'bg-indigo-500', color: 'text-white', icon: '🟣', status: 'Normal' },
  'LT4': { bg: 'bg-pink-500', color: 'text-white', icon: '💜', status: 'Retired' },
  'UNRANKED': { bg: 'bg-gray-600', color: 'text-white', icon: '⚫', status: 'Normal' },
}

function TierBadgeComponent({ tier, label }: TierBadgeProps) {
  // Memoize tier data lookup
  const tierData = useMemo(() => tierInfo[tier] || tierInfo['UNRANKED'], [tier])

  return (
    <div className="relative flex flex-col items-center gap-1 group">
      <div
        className={`w-10 h-10 rounded-full ${tierData.bg} flex items-center justify-center text-xs font-bold ${tierData.color} transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg will-change-transform`}
      >
        {tierData.icon}
      </div>
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{tier}</span>

      {/* Tooltip - CSS hover, no React state */}
      <div className="absolute bottom-full mb-2 bg-secondary border border-white/20 rounded-lg px-3 py-2 text-xs font-semibold text-foreground whitespace-nowrap shadow-lg z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
        {tierData.status}
      </div>
    </div>
  )
}

export default memo(TierBadgeComponent)
