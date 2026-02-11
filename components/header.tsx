'use client'

import { memo, useState, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  selectedMode: string
  onModeChange: (mode: string) => void
  gameModes: string[]
}

// CSS-only fire particles - no React state updates needed
const FireParticles = memo(function FireParticles() {
  // Generate static particles that use CSS animation
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: 10 + (i * 10) + Math.random() * 5,
    delay: i * 0.2,
  }))

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="fire-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            '--tx': `${(Math.random() - 0.5) * 20}px`,
          } as React.CSSProperties}
        />
      ))}
    </>
  )
})

function HeaderComponent({ selectedMode, onModeChange, gameModes }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleModeChange = useCallback((mode: string) => {
    onModeChange(mode)
    setMobileMenuOpen(false)
  }, [onModeChange])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center pt-4">
        <div className="fade-in relative">
          <nav className="dock-nav fire-border">
            {/* Fire Particles - CSS animated, no state */}
            <FireParticles />

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
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-xl border-b border-white/10">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="gradient-text-orange font-black text-xl">Fast Tier</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="bg-card/95 backdrop-blur-xl border-b border-white/10 animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-2">
              {gameModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedMode === mode 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default memo(HeaderComponent)
