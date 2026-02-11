'use client'

import { memo, useMemo } from 'react'

function AnimatedBackgroundComponent() {
  // Generate particles once on mount, not on every render
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
    }))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Animated gradient orbs with floating motion */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-orb will-change-transform" 
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-500/15 rounded-full blur-3xl animate-orb will-change-transform" 
        style={{ animationDelay: '5s' }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-orb will-change-transform" 
        style={{ animationDelay: '10s' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl animate-orb will-change-transform" 
        style={{ animationDelay: '7s' }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float will-change-transform"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Subtle gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 animate-gradient-shift" />
    </div>
  )
}

export default memo(AnimatedBackgroundComponent)
