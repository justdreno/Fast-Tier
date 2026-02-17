import { Trophy, Target, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useState } from 'react';

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

  const scrollToSection = (section: 'ranks' | 'points') => {
    setActiveTab(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12">
      <Navigation />

      <div className="pt-28">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Info size={32} className="text-[#ff9f43]" />
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Information
              </h1>
            </div>
            <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto">
              Understanding the FastTier ranking system and how points are calculated
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-gradient-to-b from-[#141414] to-[#0f0f0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
            
            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/[0.08] pb-4 sticky top-20 bg-[#141414] z-10 -mx-6 px-6 sm:-mx-8 sm:px-8">
              <button 
                onClick={() => scrollToSection('ranks')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === 'ranks' 
                    ? 'bg-[#ff9f43]/10 text-[#ff9f43]' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                Rank Titles
              </button>
              <button 
                onClick={() => scrollToSection('points')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === 'points' 
                    ? 'bg-[#ff9f43]/10 text-[#ff9f43]' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                Points System
              </button>
            </div>

            {/* Rank Titles Section */}
            <div id="ranks" className="mb-10">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Trophy size={20} className="text-[#ff9f43]" />
                How to obtain Achievement Titles
              </h2>
              <p className="text-white/40 text-sm mb-6">
                Your rank title is determined by your total accumulated points across all gamemodes
              </p>

              <div className="space-y-3">
                {rankData.map((rank) => (
                  <div 
                    key={rank.name}
                    className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <img 
                        src={rank.icon} 
                        alt={rank.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div 
                        className="font-bold text-base mb-0.5"
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
                      <div className="font-bold text-white">{rank.minPoints}+</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.08] my-8"></div>

            {/* Points System Section */}
            <div id="points">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Target size={20} className="text-[#ff9f43]" />
                How ranking points are calculated
              </h2>
              <p className="text-white/40 text-sm mb-6">
                Each tier in each gamemode gives you a specific number of points. These points add up across all gamemodes to determine your total score and rank.
              </p>

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
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '•'}
                            </span>
                            <span className="font-bold text-white">{tier.tier}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff9f43]/10 border border-[#ff9f43]/20 rounded-lg">
                            <span className="text-[#ff9f43] font-bold">{tier.htPoints} Points</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-lg">
                            <span className="text-white/70 font-bold">{tier.ltPoints} Points</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Example Section */}
              <div className="mt-8 p-5 bg-gradient-to-r from-[#ff9f43]/10 to-transparent border border-[#ff9f43]/20 rounded-xl">
                <h3 className="text-sm font-bold text-[#ff9f43] mb-3 uppercase tracking-wider">
                  Example Calculation
                </h3>
                <p className="text-white/70 text-sm mb-3">
                  If you have these tiers across different gamemodes:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Vanilla: HT1</span>
                    <span className="text-[#ff9f43]">+60 points</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>UHC: HT1</span>
                    <span className="text-[#ff9f43]">+60 points</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Pot: LT1</span>
                    <span className="text-white/70">+45 points</span>
                  </div>
                  <div className="flex justify-between text-white/60">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <h3 className="font-bold text-white mb-2">How to Rank Up</h3>
                <p className="text-white/50 text-sm">
                  Improve your tier in any gamemode by getting tested. Higher tiers give more points, which increases your overall rank.
                </p>
              </div>
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <h3 className="font-bold text-white mb-2">Multiple Gamemodes</h3>
                <p className="text-white/50 text-sm">
                  Points are additive across all gamemodes. Being good in multiple gamemodes helps you achieve higher ranks faster.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Rankings */}
          <div className="mt-8 text-center">
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
