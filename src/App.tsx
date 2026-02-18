import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import PremiumLoader from './components/PremiumLoader';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import PlayerProfile from './components/PlayerProfile';
import type { Player } from './lib/supabase';

// Lazy load other pages for code splitting
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
import InfoPage from './pages/InfoPage';
const PartnersPage = lazy(() => import('./pages/PartnersPage'));

function HomePage() {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);
  
  // Skip loader if already shown this session
  const hasSeenLoader = sessionStorage.getItem('ft-loader-shown') === '1';
  const [isLoading, setIsLoading] = useState(!hasSeenLoader);
  const [contentVisible, setContentVisible] = useState(hasSeenLoader);

  // Handle loading complete
  const handleLoadingComplete = () => {
    sessionStorage.setItem('ft-loader-shown', '1');
    setIsLoading(false);
    setContentVisible(true);
  };

  return (
    <>
      {/* Premium Loading Screen */}
      {isLoading && <PremiumLoader onComplete={handleLoadingComplete} />}
      
      {/* Main Content - Hidden until loaded */}
      <div 
        className={`min-h-screen bg-[#0a0a0a] overflow-hidden transition-opacity duration-300 ease-out ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Banner Header with parallax effect */}
        <div
          className={`hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative transition-opacity duration-500 ${
            contentVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: 'url(/banner.png)',
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
          
          {/* Bottom gradient fade to background */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          
          {/* Subtle glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-[#ff9f43]/5 blur-3xl" />
        </div>

        <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
          {/* Title Section */}
          <div className="px-3 sm:px-4 mb-4 sm:mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
              Rankings
            </h1>
            <p className="text-xs sm:text-sm text-white/30">
              View the latest tier rankings across all gamemodes
            </p>
          </div>
          
          {/* Leaderboard */}
          <Leaderboard 
            gamemode={selectedGamemode} 
            searchQuery={searchQuery} 
            onSelectPlayer={setSelectedPlayer}
            onGamemodeChange={setSelectedGamemode}
            isInitialLoad={isLoading}
          />
        </main>

      </div>
      
      {/* Player Profile Modal - Outside of overflow-hidden container */}
      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer.player}
          rank={selectedPlayer.rank}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/apply" 
          element={
            <Suspense fallback={null}>
              <ApplyPage />
            </Suspense>
          } 
        />
        <Route path="/info" element={<InfoPage />} />
        <Route 
          path="/partners" 
          element={
            <Suspense fallback={null}>
              <PartnersPage />
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
