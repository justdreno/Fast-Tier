import { Link } from 'react-router-dom';
import { Trophy, Target, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';

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
  { tier: 'Tier 1', htPoints: 60, ltPoints: 45, icon: '/tiers/tier_1.svg' },
  { tier: 'Tier 2', htPoints: 30, ltPoints: 20, icon: '/tiers/tier_2.svg' },
  { tier: 'Tier 3', htPoints: 10, ltPoints: 6, icon: '/tiers/tier_3.svg' },
  { tier: 'Tier 4', htPoints: 4, ltPoints: 3, emoji: '4️⃣' },
  { tier: 'Tier 5', htPoints: 2, ltPoints: 1, emoji: '5️⃣' },
];

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Banner Header - No animation */}
      <div
        className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative opacity-100"
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

      <Navigation />

      <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10" style={{ minHeight: '50vh' }}>
        {/* Title Section */}
        <div className="px-3 sm:px-4 mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
            Information
          </h1>
          <p className="text-xs sm:text-sm text-white/30">
            Understanding the ranking system and point calculations
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* LEFT COLUMN - Rank System */}
          <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
            {/* Header with Icon Tabs style */}
            <div className="border-b border-white/[0.06] bg-[#141414]/50">
              <div className="px-3 sm:px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Trophy size={18} className="text-[#ff9f43]" />
                  <span className="font-bold text-sm text-white">Rank Titles</span>
                </div>
              </div>
            </div>

            {/* Ranks Table Header */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-4 py-3 border-b border-white/[0.04] bg-[#0f0f0f]/60">
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider w-12 sm:w-16 text-center">
                Icon
              </div>
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider">
                Rank
              </div>
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider text-right w-20 sm:w-24">
                Points
              </div>
            </div>

            {/* Ranks List */}
            <div className="no-scrollbar">
              {rankData.map((rank) => (
                <div
                  key={rank.name}
                  className="group grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 px-3 sm:px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-200"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-black/40 border border-white/[0.05] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={rank.icon} 
                        alt={rank.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Rank Info */}
                  <div className="flex flex-col justify-center min-w-0">
                    <h3
                      className="text-sm sm:text-base font-black tracking-tight group-hover:brightness-125 transition-all truncate"
                      style={{ color: rank.color }}
                    >
                      {rank.name}
                    </h3>
                    <p className="text-white/40 text-xs truncate">
                      {rank.description}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-end w-20 sm:w-24">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-white tracking-wide">
                        {rank.minPoints}<span className="text-[#ff9f43]">+</span>
                      </div>
                      <div className="text-[9px] uppercase font-bold text-white/30 tracking-wider">
                        Min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Point System */}
          <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
            {/* Header */}
            <div className="border-b border-white/[0.06] bg-[#141414]/50">
              <div className="px-3 sm:px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Target size={18} className="text-[#ff9f43]" />
                  <span className="font-bold text-sm text-white">Points System</span>
                </div>
              </div>
            </div>

            {/* Points Table Header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 sm:gap-4 px-3 sm:px-4 py-3 border-b border-white/[0.04] bg-[#0f0f0f]/60">
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider w-10 text-center">
                
              </div>
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider">
                Tier Level
              </div>
              <div className="text-[11px] font-bold text-[#ff9f43] uppercase tracking-wider text-center w-16 sm:w-20">
                HT Points
              </div>
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider text-center w-16 sm:w-20">
                LT Points
              </div>
            </div>

            {/* Points List */}
            <div>
              {tierPointsData.map((row) => (
                <div
                  key={row.tier}
                  className="group grid grid-cols-[auto_1fr_auto_auto] gap-2 sm:gap-4 px-3 sm:px-4 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-200"
                >
                  {/* Tier Icon/Emoji */}
                  <div className="flex items-center justify-center w-10">
                    {row.icon ? (
                      <img 
                        src={row.icon} 
                        alt={row.tier}
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      />
                    ) : (
                      <span className="text-xl">{row.emoji}</span>
                    )}
                  </div>

                  {/* Tier Name */}
                  <div className="flex items-center">
                    <span className="text-sm sm:text-base font-bold text-white">{row.tier}</span>
                  </div>

                  {/* HT Points */}
                  <div className="flex items-center justify-center w-16 sm:w-20">
                    <span className="inline-block py-1.5 px-3 rounded-lg bg-[#ff9f43]/10 border border-[#ff9f43]/20 text-[#ff9f43] font-bold text-sm">
                      +{row.htPoints}
                    </span>
                  </div>

                  {/* LT Points */}
                  <div className="flex items-center justify-center w-16 sm:w-20">
                    <span className="inline-block py-1.5 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/70 font-bold text-sm">
                      +{row.ltPoints}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* How It Works Card */}
            <div className="p-4 sm:p-5 border-t border-white/[0.06]">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#141414] border border-white/[0.08] rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9f43]/5 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 relative z-10">
                  <span className="w-5 h-5 rounded bg-[#ff9f43]/20 flex items-center justify-center">
                    <span className="text-[#ff9f43] text-xs">?</span>
                  </span>
                  How does it add up?
                </h3>

                <p className="text-white/50 text-xs leading-relaxed mb-4 relative z-10">
                  Your total score is the sum of points from your best tier in every gamemode. 
                  You can be Tier 1 in Sword and Tier 3 in UHC, and both will contribute to your Combat Rank.
                </p>

                {/* Example */}
                <div className="bg-black/30 rounded-lg p-3 border border-white/[0.05] relative z-10">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Example</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Vanilla (HT1)</span>
                      <span className="text-[#ff9f43] font-mono">+60</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">UHC (LT2)</span>
                      <span className="text-white/40 font-mono">+20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Sword (HT2)</span>
                      <span className="text-[#ff9f43] font-mono">+30</span>
                    </div>
                    <div className="border-t border-white/[0.1] pt-1.5 mt-1.5 flex justify-between items-center">
                      <span className="font-bold text-white text-xs">Total</span>
                      <span className="font-black text-[#ff9f43]">110 pts</span>
                    </div>
                    <div className="text-right text-[9px] text-white/30">
                      Result: Combat Ace
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:scale-105 transition-all duration-300 text-sm font-medium"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Leaderboard
          </Link>
        </div>
      </main>
    </div>
  );
}
