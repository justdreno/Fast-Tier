'use client'

import { useState } from 'react'
import Header from '@/components/header'
import RankingsView from '@/components/rankings-view'
import AnimatedBackground from '@/components/animated-background'

const GAME_MODES = ['Overall', 'LTMs', 'Vanilla', 'UHC', 'Pot', 'NethOP', 'SMP', 'Sword', 'Axe', 'Mace']

export default function Page() {
  const [selectedMode, setSelectedMode] = useState('Overall')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <AnimatedBackground />
      <Header selectedMode={selectedMode} onModeChange={setSelectedMode} gameModes={GAME_MODES} />
      <RankingsView gameMode={selectedMode} />
    </div>
  )
}
