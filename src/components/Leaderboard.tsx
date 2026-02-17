import { useState, useEffect, useMemo } from 'react';
import { ChevronUp } from 'lucide-react';
import PlayerRow from './PlayerRow';
import GamemodeTabs from './GamemodeTabs';
import { getPlayers, searchPlayers, type Player } from '../lib/supabase';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
  onSelectPlayer: (player: { player: Player; rank: number } | null) => void;
  onGamemodeChange: (gamemode: string) => void;
}

// Tier colors for header backgrounds - Correct progression: LT5 → LT4 → LT3 → LT2 → LT1 → HT5 → HT4 → HT3 → HT2 → HT1
const tierColors = [
  { bg: 'from-[#ff9f43]/20 to-[#ff8c00]/10', border: 'border-[#ff9f43]/30', text: 'text-[#ff9f43]', icon: '/tiers/tier_1.svg' },   // HT1 - Best
  { bg: 'from-[#c0c0c0]/20 to-[#a0a0a0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]', icon: '/tiers/tier_2.svg' }, // HT2
  { bg: 'from-[#cd7f32]/20 to-[#b87333]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]', icon: '/tiers/tier_3.svg' },  // HT3
  { bg: 'from-[#ffd700]/20 to-[#ffcc00]/10', border: 'border-[#ffd700]/30', text: 'text-[#ffd700]', icon: null },                   // HT4
  { bg: 'from-[#f59e0b]/20 to-[#d97706]/10', border: 'border-[#f59e0b]/30', text: 'text-[#f59e0b]', icon: null },                   // HT5
  { bg: 'from-[#3b82f6]/20 to-[#2563eb]/10', border: 'border-[#3b82f6]/30', text: 'text-[#3b82f6]', icon: null },                   // LT1
  { bg: 'from-[#06b6d4]/20 to-[#0891b2]/10', border: 'border-[#06b6d4]/30', text: 'text-[#06b6d4]', icon: null },                   // LT2
  { bg: 'from-[#94a3b8]/20 to-[#64748b]/10', border: 'border-[#94a3b8]/30', text: 'text-[#94a3b8]', icon: null },                   // LT3
  { bg: 'from-[#64748b]/20 to-[#475569]/10', border: 'border-[#64748b]/30', text: 'text-[#64748b]', icon: null },                   // LT4
  { bg: 'from-[#475569]/20 to-[#334155]/10', border: 'border-[#475569]/30', text: 'text-[#475569]', icon: null },                   // LT5 - Worst
];

// Get tier level from tier code for sorting (1 = best/HT1, 10 = worst/LT5)
// Progression: LT5 (worst) → LT4 → LT3 → LT2 → LT1 → HT5 → HT4 → HT3 → HT2 → HT1 (best)
const getTierLevel = (tierCode: string): number => {
  const tierOrder: { [key: string]: number } = {
    'HT1': 1, 'HT2': 2, 'HT3': 3, 'HT4': 4, 'HT5': 5,
    'LT1': 6, 'LT2': 7, 'LT3': 8, 'LT4': 9, 'LT5': 10
  };
  return tierOrder[tierCode] || 10;
};

// Group players by their tier level (1-10, where 1 = HT1 best, 10 = LT5 worst)
// Players with no tier in this gamemode are NOT shown
const groupPlayersByTier = (players: Player[], gamemode: string) => {
  const groups: { [key: number]: Player[] } = { 
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [] 
  };
  
  players.forEach(player => {
    const relevantTiers = player.tiers?.filter(t => t.gamemode?.code === gamemode);
    
    // Only add player if they have a tier in this gamemode
    if (relevantTiers && relevantTiers.length > 0) {
      // Get best tier (lowest level number = best)
      const bestTier = relevantTiers.reduce((best, current) => {
        const bestLevel = getTierLevel(best.tier_definition?.code || 'LT5');
        const currentLevel = getTierLevel(current.tier_definition?.code || 'LT5');
        return currentLevel < bestLevel ? current : best;
      });
      
      const tierLevel = getTierLevel(bestTier.tier_definition?.code || 'LT5');
      if (groups[tierLevel]) {
        groups[tierLevel].push(player);
      }
    }
    // If no tier, player is NOT added to any group (won't show in list)
  });
  
  return groups;
};

export default function Leaderboard({ gamemode, searchQuery, onSelectPlayer, onGamemodeChange }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);
        setError(null);

        if (searchQuery) {
          const data = await searchPlayers(searchQuery);
          setPlayers(data);
        } else {
          const data = await getPlayers();
          setPlayers(data);
        }
      } catch (err) {
        setError('Failed to load players. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [searchQuery]);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points);
  }, [players]);

  const tierGroups = groupPlayersByTier(players, gamemode);
  const isOverall = gamemode === 'overall';

  if (loading) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.06] bg-[#141414]/50">
            <div className="px-3 sm:px-4 py-2">
              <GamemodeTabs selectedGamemode={gamemode} setSelectedGamemode={onGamemodeChange} />
            </div>
          </div>
          <div className="p-8 sm:p-12 text-center">
            <div className="text-white/30 text-sm sm:text-base">Loading players...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.06] bg-[#141414]/50">
            <div className="px-3 sm:px-4 py-2">
              <GamemodeTabs selectedGamemode={gamemode} setSelectedGamemode={onGamemodeChange} />
            </div>
          </div>
          <div className="p-8 sm:p-12 text-center">
            <div className="text-red-400 text-sm sm:text-base">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
      <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
        {/* Header with Gamemode Tabs */}
        <div className="border-b border-white/[0.06] bg-[#141414]/50">
          <div className="px-3 sm:px-4 py-2">
            <GamemodeTabs selectedGamemode={gamemode} setSelectedGamemode={onGamemodeChange} />
          </div>
        </div>

        {isOverall ? (
          // Overall Mode - Regular Table
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04] bg-[#0f0f0f]/60">
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-[11px] font-bold text-white/30 uppercase tracking-wider w-16 sm:w-20">
                    Rank
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-[11px] font-bold text-white/30 uppercase tracking-wider w-auto">
                    Player
                  </th>
                  <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-[11px] font-bold text-white/30 uppercase tracking-wider w-32 sm:w-40">
                    Tiers
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.length > 0 ? (
                  sortedPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      onClick={() => onSelectPlayer({ player, rank: index + 1 })}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group animate-fadeInUp"
                      style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                    >
                      <PlayerRow player={player} rank={index + 1} gamemode={gamemode} />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 py-16 sm:py-20 text-center">
                      <div className="space-y-2">
                        <div className="text-base font-semibold text-white/25">No players found</div>
                        <div className="text-sm text-white/15">Try a different search</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Gamemode Mode - Tier Columns (All 10 tiers)
          <div className="p-3 sm:p-4 overflow-x-auto scrollbar-thin">
            <div className="flex gap-2 min-w-[1400px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tierLevel) => {
                const tierPlayers = tierGroups[tierLevel];
                const colors = tierColors[tierLevel - 1];
                const tierNames = ['HT1', 'HT2', 'HT3', 'HT4', 'HT5', 'LT1', 'LT2', 'LT3', 'LT4', 'LT5'];
                
                return (
                  <div key={tierLevel} className="flex-1 min-w-[130px]">
                    {/* Tier Header */}
                    <div className={`bg-gradient-to-b ${colors.bg} border ${colors.border} rounded-t-xl p-2 sm:p-3 mb-1`}>
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        {colors.icon && (
                          <img 
                            src={colors.icon} 
                            alt={`Tier ${tierLevel}`} 
                            className="w-5 h-5 sm:w-6 sm:h-6"
                          />
                        )}
                        <span className={`font-bold text-xs sm:text-sm ${colors.text}`}>
                          {tierNames[tierLevel - 1]}
                        </span>
                      </div>
                    </div>
                    
                    {/* Players List */}
                    <div className="space-y-1">
                      {tierPlayers.length > 0 ? (
                        tierPlayers.map((player, index) => (
                          <div
                            key={player.id}
                            onClick={() => onSelectPlayer({ player, rank: index + 1 })}
                            className="group flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.1] rounded-lg p-2 cursor-pointer transition-all duration-200"
                          >
                            {/* Avatar */}
                            <img
                              src={`https://render.crafty.gg/3d/bust/${player.username}`}
                              alt={player.username}
                              className="w-8 h-8 sm:w-9 sm:h-9 object-cover rounded-lg border border-white/[0.08]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
                              }}
                            />
                            
                            {/* Username */}
                            <span className="flex-1 text-white text-xs sm:text-sm font-medium truncate group-hover:text-[#ff9f43] transition-colors">
                              {player.username}
                            </span>
                            
                            {/* Arrow Indicator */}
                            <ChevronUp className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-white/20 text-xs">
                          No players
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
