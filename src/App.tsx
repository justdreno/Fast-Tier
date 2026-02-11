import { useState } from 'react';
import Navigation from './components/Navigation';
import GamemodeTabs from './components/GamemodeTabs';
import Leaderboard from './components/Leaderboard';

function App() {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Rankings</h1>
          <p className="text-sm text-white/30">View the latest tier rankings across all gamemodes</p>
        </div>
        <GamemodeTabs
          selectedGamemode={selectedGamemode}
          setSelectedGamemode={setSelectedGamemode}
        />
        <Leaderboard gamemode={selectedGamemode} searchQuery={searchQuery} />
      </main>
    </div>
  );
}

export default App;
