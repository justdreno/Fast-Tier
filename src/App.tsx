import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import PlayerProfile from './components/PlayerProfile';
import ApplyPage from './pages/ApplyPage';
import type { Player } from './lib/supabase';

function HomePage() {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Banner Header */}
      <div
        className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url(/banner.png)',
        }}
      >
        {/* Bottom gradient fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="container mx-auto px-3 sm:px-4 mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
        <div className="mb-4 sm:mb-5 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">Rankings</h1>
          <p className="text-xs sm:text-sm text-white/30">View the latest tier rankings across all gamemodes</p>
        </div>
        <Leaderboard 
          gamemode={selectedGamemode} 
          searchQuery={searchQuery} 
          onSelectPlayer={setSelectedPlayer}
          onGamemodeChange={setSelectedGamemode}
        />
      </main>

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
