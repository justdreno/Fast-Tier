import { Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useState, useEffect } from 'react';

const rankData = [
  { name: 'Combat Grandmaster', minPoints: 400, color: '#f59e0b', icon: '/ranks/combat_master.webp', description: 'Obtained 400+ total points' },
  { name: 'Combat Master', minPoints: 250, color: '#fbbf24', icon: '/ranks/combat_master.webp', description: 'Obtained 250+ total points' },
  { name: 'Combat Ace', minPoints: 100, color: '#f472b6', icon: '/ranks/combat_ace.webp', description: 'Obtained 100+ total points' },
  { name: 'Combat Specialist', minPoints: 50, color: '#c084fc', icon: '/ranks/combat_specialist.webp', description: 'Obtained 50+ total points' },
  { name: 'Combat Cadet', minPoints: 20, color: '#a78bfa', icon: '/ranks/combat_cadet.webp', description: 'Obtained 20+ total points' },
  { name: 'Combat Novice', minPoints: 10, color: '#60a5fa', icon: '/ranks/combat_novice.webp', description: 'Obtained 10+ total points' },
  { name: 'Rookie', minPoints: 0, color: '#9ca3af', icon: '/ranks/rookie.webp', description: 'Starting rank for players with less than 10 points' },
];

const tierPointsData = [
  { tier: 'Tier 1', htPoints: 60, ltPoints: 45 },
  { tier: 'Tier 2', htPoints: 30, ltPoints: 20 },
  { tier: 'Tier 3', htPoints: 10, ltPoints: 6 },
  { tier: 'Tier 4', htPoints: 4, ltPoints: 3 },
  { tier: 'Tier 5', htPoints: 2, ltPoints: 1 },
];

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<'ranks' | 'points'>('ranks');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (section: 'ranks' | 'points') => {
    setActiveTab(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12 overflow-hidden">
      <Navigation />

      <div className="pt-28">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className={`text-center mb-10 transition-all duration-600 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="text-3xl sm:text-4xl font-black text-[#ff9f43] mb-3">
              Information
            </h1>
            <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto">
              Understanding the FastTier ranking system and how points are calculated
            </p>
          </div>

          {/* Main Content Card */}
          <div className={`bg-gradient-to-b from-[#141414] to-[#0f0f0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative overflow-hidden transition-all duration-700 ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'}`}>
            {/* Subtle corner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9f43]/10 blur-3xl rounded-full pointer-events-none" />
            
            {/* Tabs */}
            <div className={`flex justify-center gap-2 mb-8 border-b border-white/[0.08] pb-4 sticky top-20 bg-[#141414] z-10 -mx-6 px-6 sm:-mx-8 sm:px-8 transition-all duration-500 ease-out delay-150 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="relative flex gap-2">
                <button 
                  onClick={() => scrollToSection('ranks')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all relative z-10 ${activeTab === 'ranks' 
                      ? 'text-[#ff9f43]' 
                      : 'text-white/40 hover:text-white/70'
                    }`}
                >
                  Rank Titles
                </button>
                <button 
                  onClick={() => scrollToSection('points')}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all relative z-10 ${activeTab === 'points' 
                      ? 'text-[#ff9f43]' 
                      : 'text-white/40 hover:text-white/70'
                    }`}
                >
                  Points System
                </button>
                {/* Sliding indicator */}
                <div 
                  className="absolute bottom-0 h-0.5 bg-[#ff9f43] rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: activeTab === 'ranks' ? '85px' : '100px',
                    left: activeTab === 'ranks' ? '8px' : '101px',
                    bottom: '-16px'
                  }}
                />
              </div>
            </div>

            {/* Rank Titles Section */}
            <div id="ranks" className="mb-10">
              <div className={`text-center transition-all duration-500 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Trophy size={20} className="text-[#ff9f43]" />
                  How to obtain Achievement Titles
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Your rank title is determined by your total accumulated points across all gamemodes
                </p>
              </div>

              <div className="space-y-3">
                {rankData.map((rank, index) => (
                  <div 
                    key={rank.name}
                    className={`flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.1] hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 ease-out group ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${isVisible ? 250 + index * 50 : 0}ms` }}
                  >
                    <div className="w-12 h-12 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={rank.icon} 
                        alt={rank.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div 
                        className="font-bold text-base mb-0.5 group-hover:scale-105 transition-transform duration-300 origin-left"
                        style={{ color: rank.color }}
                      >
                        {rank.name}
                      </div>
                      <div className="text-white/40 text-xs">
                        {rank.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-xs mb-1">Min Points</div>
                      <div className="font-bold text-white group-hover:text-[#ff9f43] transition-colors duration-300">{rank.minPoints}+</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.08] my-8"></div>

            {/* Points System Section */}
            <div id="points">
              <div className={`text-center transition-all duration-500 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Target size={20} className="text-[#ff9f43]" />
                  How ranking points are calculated
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Each tier in each gamemode gives you a specific number of points. These points add up across all gamemodes to determine your total score and rank.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-4 text-white/60 font-semibold text-sm">Tier</th>
                      <th className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[#ff9f43]">High Tier (HT)</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-white/60">Low Tier (LT)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierPointsData.map((tier, index) => (
                      <tr 
                        key={tier.tier} 
                        className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${isVisible ? 350 + index * 50 : 0}ms` }}
                      >
                        <td className="py-4 px-4">
                          <span className="font-bold text-white">{tier.tier}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff9f43]/10 border border-[#ff9f43]/20 rounded-lg hover:bg-[#ff9f43]/20 hover:border-[#ff9f43]/30 transition-all duration-300">
                            <span className="text-[#ff9f43] font-bold">{tier.htPoints} Points</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-lg hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300">
                            <span className="text-white/70 font-bold">{tier.ltPoints} Points</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Example Section */}
              <div className={`mt-8 p-5 bg-gradient-to-r from-[#ff9f43]/10 to-transparent border border-[#ff9f43]/20 rounded-xl hover:border-[#ff9f43]/30 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${isVisible ? 600 : 0}ms` }}>
                <h3 className="text-sm font-bold text-[#ff9f43] mb-3 uppercase tracking-wider text-center">
                  Example Calculation
                </h3>
                <p className="text-white/70 text-sm mb-3 text-center">
                  If you have these tiers across different gamemodes:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60 hover:text-white/80 transition-colors">
                    <span>Vanilla: HT1</span>
                    <span className="text-[#ff9f43]">+60 points</span>
                  </div>
                  <div className="flex justify-between text-white/60 hover:text-white/80 transition-colors">
                    <span>UHC: HT1</span>
                    <span className="text-[#ff9f43]">+60 points</span>
                  </div>
                  <div className="flex justify-between text-white/60 hover:text-white/80 transition-colors">
                    <span>Pot: LT1</span>
                    <span className="text-white/70">+45 points</span>
                  </div>
                  <div className="flex justify-between text-white/60 hover:text-white/80 transition-colors">
                    <span>Sword: HT2</span>
                    <span className="text-[#ff9f43]">+30 points</span>
                  </div>
                  <div className="border-t border-white/[0.1] pt-2 mt-2 flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span className="text-[#ff9f43]">195 points = Combat Ace</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.08] my-8"></div>

            {/* Additional Info */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.1] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out group text-center">
                <h3 className="font-bold text-white mb-2">How to Rank Up</h3>
                <p className="text-white/50 text-sm">
                  Improve your tier in any gamemode by getting tested. Higher tiers give more points, which increases your overall rank.
                </p>
              </div>
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.1] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out group text-center">
                <h3 className="font-bold text-white mb-2">Multiple Gamemodes</h3>
                <p className="text-white/50 text-sm">
                  Points are additive across all gamemodes. Being good in multiple gamemodes helps you achieve higher ranks faster.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Rankings */}
          <div className={`mt-8 text-center transition-all duration-700 ease-out delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              ← Back to Rankings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
