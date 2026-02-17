import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import PlayerProfile from './components/PlayerProfile';
import ApplyPage from './pages/ApplyPage';
import InfoPage from './pages/InfoPage';
import type { Player } from './lib/supabase';

function HomePage() {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Banner Header with parallax effect */}
      <div
        className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative animate-fade-in"
        style={{
          backgroundImage: 'url(/banner.png)',
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] animate-fade-in-up" style={{ animationDelay: '0.3s' }} />
        
        {/* Bottom gradient fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        
        {/* Subtle animated glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-[#ff9f43]/5 blur-3xl animate-pulse-slow" />
      </div>

      <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
        {/* Title Section with staggered animation */}
        <div className="px-3 sm:px-4 mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Rankings
          </h1>
          <p className="text-xs sm:text-sm text-white/30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            View the latest tier rankings across all gamemodes
          </p>
        </div>
        
        {/* Leaderboard with animation */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Leaderboard 
            gamemode={selectedGamemode} 
            searchQuery={searchQuery} 
            onSelectPlayer={setSelectedPlayer}
            onGamemodeChange={setSelectedGamemode}
          />
        </div>
      </main>

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer.player}
          rank={selectedPlayer.rank}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/info" element={<InfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
