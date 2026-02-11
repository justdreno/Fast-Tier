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
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Rankings</h1>
          <p className="text-white/50">View the latest tier rankings across all gamemodes</p>
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
