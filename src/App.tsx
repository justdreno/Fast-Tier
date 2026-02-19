import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import PremiumLoader from './components/PremiumLoader';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import PlayerProfile from './components/PlayerProfile';
import { SearchProvider, useSearch } from './contexts/SearchContext';
import type { Player } from './lib/database';

const ApplyPage = lazy(() => import('./pages/ApplyPage'));
import InfoPage from './pages/InfoPage';
import PartnersPage from './pages/PartnersPage';

function HomePage() {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);


  const hasSeenLoader = sessionStorage.getItem('ft-loader-shown') === '1';
  const [isLoading, setIsLoading] = useState(!hasSeenLoader);


  const handleLoadingComplete = () => {
    sessionStorage.setItem('ft-loader-shown', '1');
    setIsLoading(false);
  };

  return (
    <>
      {}
      {isLoading && <PremiumLoader onComplete={handleLoadingComplete} />}

      {}
      <div className="min-h-screen bg-[#0a0a0a]">
        {}
        <div
          className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: 'url(/banner.png)',
          }}
        >
          {}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

          {}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

          {}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-[#ff9f43]/5 blur-3xl" />
        </div>

        <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
          {}
          <div className="px-3 sm:px-4 mb-4 sm:mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
              Rankings
            </h1>
            <p className="text-xs sm:text-sm text-white/30">
              View the latest tier rankings across all gamemodes
            </p>
          </div>

          {}
          <Leaderboard
            gamemode={selectedGamemode}
            searchQuery={searchQuery}
            onSelectPlayer={setSelectedPlayer}
            onGamemodeChange={setSelectedGamemode}
            isInitialLoad={isLoading}
          />
        </main>

      </div>

      {}
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

function AppContent() {
  return (
    <>
      <Navigation />
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
        <Route path="/partners" element={<PartnersPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;
