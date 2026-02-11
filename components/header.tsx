'use client'

import React from "react"

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeaderProps {
  selectedMode: string
  onModeChange: (mode: string) => void
  gameModes: string[]
}

export default function Header({ selectedMode, onModeChange, gameModes }: HeaderProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = [...prev, { id: Date.now(), left: Math.random() * 100 }]
        return newParticles.slice(-15)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
      <div className="fade-in relative">
        {/* Dock Navigation */}
        <nav className="dock-nav fire-border">
          {/* Fire Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="fire-particle"
              style={{
                left: `${p.left}%`,
                '--tx': `${(Math.random() - 0.5) * 20}px`,
              } as React.CSSProperties}
            />
          ))}

          {/* Logo */}
          <Link href="/" className="mr-2 pr-4 border-r border-white/10 hover:opacity-80 transition-opacity relative z-10">
            <span className="gradient-text-orange font-black text-xl">Fast Tier</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 relative z-10">
            {gameModes.map((mode) => (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                className={`dock-item ${selectedMode === mode ? 'dock-item-active' : 'text-muted-foreground'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
