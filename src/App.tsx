import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import PremiumLoader from './components/PremiumLoader';
import Navigation from './components/Navigation';
import Leaderboard from './components/Leaderboard';
import PlayerProfile from './components/PlayerProfile';
import type { Player } from './lib/supabase';

// Lazy load other pages for code splitting
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

function HomePage() {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setContentVisible(true), 100);
  };

  return (
    <>
      {/* Premium Loading Screen */}
      {isLoading && <PremiumLoader onComplete={handleLoadingComplete} />}
      
      {/* Main Content - Hidden until loaded */}
      <div 
        className={`min-h-screen bg-[#0a0a0a] overflow-hidden transition-all duration-1000 ease-out ${
          contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Banner Header with parallax effect */}
        <div
          className={`hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative transition-all duration-1000 delay-200 ${
            contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: 'url(/banner.png)',
          }}
        >
          {/* Animated gradient overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] transition-all duration-1000 delay-500 ${
              contentVisible ? 'opacity-100' : 'opacity-0'
            }`} 
          />
          
          {/* Bottom gradient fade to background */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          
          {/* Subtle animated glow */}
          <div 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-[#ff9f43]/5 blur-3xl transition-all duration-1000 delay-700 ${
              contentVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        <Navigation searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
          {/* Title Section with staggered animation */}
          <div 
            className={`px-3 sm:px-4 mb-4 sm:mb-5 transition-all duration-700 delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
              Rankings
            </h1>
            <p className="text-xs sm:text-sm text-white/30">
              View the latest tier rankings across all gamemodes
            </p>
          </div>
          
          {/* Leaderboard with animation */}
          <div 
            className={`transition-all duration-700 delay-500 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Leaderboard 
              gamemode={selectedGamemode} 
              searchQuery={searchQuery} 
              onSelectPlayer={setSelectedPlayer}
              onGamemodeChange={setSelectedGamemode}
              isInitialLoad={isLoading}
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
    </>
  );
}

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
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
            <Suspense fallback={<PremiumLoader onComplete={() => {}} />}>
              <PageTransition>
                <ApplyPage />
              </PageTransition>
            </Suspense>
          } 
        />
        <Route 
          path="/info" 
          element={
            <Suspense fallback={<PremiumLoader onComplete={() => {}} />}>
              <PageTransition>
                <InfoPage />
              </PageTransition>
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
