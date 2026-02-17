import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Target, ChevronRight, Info, Crown, Shield, Medal, Sword, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';

// Helper to get icon based on rank name (if images fail or as placeholder)
const getRankIcon = (name: string) => {
  if (name.includes('Grandmaster')) return <Crown size={32} />;
  if (name.includes('Master')) return <Shield size={32} />;
  if (name.includes('Ace')) return <Medal size={32} />;
  if (name.includes('Specialist')) return <Sword size={32} />;
  if (name.includes('Cadet')) return <Target size={32} />;
  return <Zap size={32} />;
};

const rankData = [
  { name: 'Combat Grandmaster', minPoints: 400, color: '#f59e0b', glow: 'shadow-[#f59e0b]/20', icon: '/ranks/combat_master.webp', description: 'The absolute peak of performance.' },
  { name: 'Combat Master', minPoints: 250, color: '#fbbf24', glow: 'shadow-[#fbbf24]/10', icon: '/ranks/combat_master.webp', description: 'Elite tier combatant.' },
  { name: 'Combat Ace', minPoints: 100, color: '#f472b6', glow: 'shadow-[#f472b6]/10', icon: '/ranks/combat_ace.webp', description: 'Highly skilled and dangerous.' },
  { name: 'Combat Specialist', minPoints: 50, color: '#c084fc', glow: 'shadow-[#c084fc]/10', icon: '/ranks/combat_specialist.webp', description: 'Proven combat capabilities.' },
  { name: 'Combat Cadet', minPoints: 20, color: '#a78bfa', glow: 'shadow-[#a78bfa]/10', icon: '/ranks/combat_cadet.webp', description: 'On the path to mastery.' },
  { name: 'Combat Novice', minPoints: 10, color: '#60a5fa', glow: 'shadow-[#60a5fa]/10', icon: '/ranks/combat_novice.webp', description: 'Beginning the journey.' },
  { name: 'Rookie', minPoints: 0, color: '#9ca3af', glow: 'shadow-white/5', icon: '/ranks/rookie.webp', description: 'New entry to the system.' },
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12 font-sans selection:bg-[#ff9f43]/30">
      <Navigation />

      <div className="pt-28">
        {/* Ambient Background */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[#ff9f43]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">

          {/* Header Title */}
          <div className={`text-center mb-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              Information
            </h1>
            <p className="text-white/40 text-base max-w-2xl mx-auto">
              Understanding the FastTier ranking system and how points are calculated
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className={`flex justify-center items-center gap-8 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <button
              onClick={() => setActiveTab('ranks')}
              className={`relative px-2 py-2 text-sm font-bold tracking-wide transition-colors duration-300 ${activeTab === 'ranks' ? 'text-[#ff9f43]' : 'text-white/40 hover:text-white'
                }`}
            >
              Rank Titles
              {activeTab === 'ranks' && (
                <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#ff9f43] shadow-[0_0_10px_#ff9f43]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`relative px-2 py-2 text-sm font-bold tracking-wide transition-colors duration-300 ${activeTab === 'points' ? 'text-[#ff9f43]' : 'text-white/40 hover:text-white'
                }`}
            >
              Points System
              {activeTab === 'points' && (
                <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#ff9f43] shadow-[0_0_10px_#ff9f43]" />
              )}
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[500px]">

            {/* --- RANKS TAB --- */}
            {activeTab === 'ranks' && (
              <div className="space-y-4">
                <div className={`flex items-center justify-center gap-2 mb-6 text-white/30 text-xs uppercase tracking-widest font-bold transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <Trophy size={14} className="text-[#ff9f43]" />
                  Total Points determine your rank
                </div>

                {rankData.map((rank, index) => (
                  <div
                    key={rank.name}
                    className={`group relative bg-[#141414] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-500 ease-out shadow-lg ${rank.glow} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 75}ms` }}
                  >
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row items-center gap-6">

                      {/* Left: Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          {/* Using Lucide icon as fallback, replace with <img src={rank.icon} ... /> if images are reliable */}
                          <div style={{ color: rank.color }}>
                            {getRankIcon(rank.name)}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Text */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3
                          className="text-xl font-black mb-1 tracking-tight group-hover:brightness-125 transition-all"
                          style={{ color: rank.color }}
                        >
                          {rank.name}
                        </h3>
                        <p className="text-white/40 text-sm font-medium">
                          {rank.description}
                        </p>
                      </div>

                      {/* Right: Points */}
                      <div className="flex-shrink-0 text-center sm:text-right min-w-[100px] border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0 w-full sm:w-auto">
                        <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">
                          Min Points
                        </div>
                        <div className="text-2xl font-black text-white tracking-wide">
                          {rank.minPoints}<span className="text-[#ff9f43]">+</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- POINTS TAB --- */}
            {activeTab === 'points' && (
              <div className="animate-fade-in-up">

                <div className="flex items-center justify-center gap-2 mb-6 text-white/30 text-xs uppercase tracking-widest font-bold">
                  <Target size={14} className="text-[#ff9f43]" />
                  Points awarded per gamemode tier
                </div>

                {/* Table Card */}
                <div className="bg-[#141414] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/[0.08]">
                          <th className="py-5 px-6 text-xs font-bold text-white/40 uppercase tracking-widest">Rank Tier</th>
                          <th className="py-5 px-6 text-center text-xs font-bold text-[#ff9f43] uppercase tracking-widest">High Tier (HT)</th>
                          <th className="py-5 px-6 text-center text-xs font-bold text-white/40 uppercase tracking-widest">Low Tier (LT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {tierPointsData.map((row, idx) => (
                          <tr key={row.tier} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-5 px-6 font-bold text-white">{row.tier}</td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-block py-1 px-3 rounded-lg bg-[#ff9f43]/10 border border-[#ff9f43]/20 text-[#ff9f43] font-bold text-sm">
                                +{row.htPoints}
                              </span>
                            </td>
                            <td className="py-5 px-6 text-center">
                              <span className="inline-block py-1 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/70 font-bold text-sm">
                                +{row.ltPoints}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Calculation Example Card */}
                <div className="mt-6 bg-gradient-to-r from-[#1a1a1a] to-[#141414] border border-white/[0.08] rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9f43]/5 rounded-full blur-3xl group-hover:bg-[#ff9f43]/10 transition-colors duration-500 pointer-events-none" />

                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                    <Info size={18} className="text-[#ff9f43]" />
                    How does it add up?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                    <div>
                      <p className="text-white/50 text-sm leading-relaxed mb-4">
                        Your total score is the <span className="text-white">sum of points</span> from your best tier in every gamemode.
                        You can be Tier 1 in Sword and Tier 3 in UHC, and both will contribute to your Combat Rank.
                      </p>
                      <div className="inline-flex items-center gap-2 text-[#ff9f43] text-sm font-bold border-b border-[#ff9f43]/30 pb-0.5">
                        Learn more about testing <ChevronRight size={14} />
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-white/[0.05]">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Example Profile</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Vanilla (HT1)</span>
                          <span className="text-[#ff9f43] font-mono">+60</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">UHC (LT2)</span>
                          <span className="text-white/40 font-mono">+20</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Sword (HT2)</span>
                          <span className="text-[#ff9f43] font-mono">+30</span>
                        </div>
                        <div className="border-t border-white/[0.1] pt-2 mt-2 flex justify-between items-center">
                          <span className="font-bold text-white">Total Score</span>
                          <span className="font-black text-[#ff9f43] text-lg">110</span>
                        </div>
                        <div className="text-right text-[10px] text-white/30">
                          Result: Combat Ace
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer Link */}
          <div className={`mt-12 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:scale-105 transition-all duration-300 text-sm font-medium"
            >
              Back to Leaderboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}