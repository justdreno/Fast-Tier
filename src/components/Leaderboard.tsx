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

// Tier colors for header backgrounds
const tierColors = [
  { bg: 'from-[#ff9f43]/20 to-[#ff8c00]/10', border: 'border-[#ff9f43]/30', text: 'text-[#ff9f43]', icon: '/tiers/tier_1.svg' },
  { bg: 'from-[#c0c0c0]/20 to-[#a0a0a0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]', icon: '/tiers/tier_2.svg' },
  { bg: 'from-[#cd7f32]/20 to-[#b87333]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]', icon: '/tiers/tier_3.svg' },
  { bg: 'from-[#3b82f6]/20 to-[#2563eb]/10', border: 'border-[#3b82f6]/30', text: 'text-[#3b82f6]', icon: null },
  { bg: 'from-[#64748b]/20 to-[#475569]/10', border: 'border-[#64748b]/30', text: 'text-[#64748b]', icon: null },
];

// Get tier level from tier code (HT1/LT1 = Tier 1, HT2/LT2 = Tier 2, etc.)
const getTierLevel = (tierCode: string): number => {
  const match = tierCode.match(/\d/);
  return match ? parseInt(match[0]) : 5;
};

// Group players by their tier level
const groupPlayersByTier = (players: Player[], gamemode: string) => {
  const groups: { [key: number]: Player[] } = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  
  players.forEach(player => {
    const relevantTiers = player.tiers?.filter(t => t.gamemode?.code === gamemode);
    
    if (relevantTiers && relevantTiers.length > 0) {
      // Get best tier
      const bestTier = relevantTiers.reduce((best, current) => {
        const bestLevel = getTierLevel(best.tier_definition?.code || 'LT4');
        const currentLevel = getTierLevel(current.tier_definition?.code || 'LT4');
        return currentLevel < bestLevel ? current : best;
      });
      
      const tierLevel = getTierLevel(bestTier.tier_definition?.code || 'LT4');
      if (groups[tierLevel]) {
        groups[tierLevel].push(player);
      }
    } else {
      // No tier = Tier 5
      groups[5].push(player);
    }
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
          // Gamemode Mode - Tier Columns
          <div className="p-3 sm:p-4 overflow-x-auto scrollbar-thin">
            <div className="flex gap-3 min-w-[1000px]">
              {[1, 2, 3, 4, 5].map((tierLevel) => {
                const tierPlayers = tierGroups[tierLevel];
                const colors = tierColors[tierLevel - 1];
                
                return (
                  <div key={tierLevel} className="flex-1 min-w-[180px]">
                    {/* Tier Header */}
                    <div className={`bg-gradient-to-b ${colors.bg} border ${colors.border} rounded-t-xl p-3 mb-1`}>
                      <div className="flex items-center justify-center gap-2">
                        {colors.icon && (
                          <img 
                            src={colors.icon} 
                            alt={`Tier ${tierLevel}`} 
                            className="w-6 h-6 sm:w-7 sm:h-7"
                          />
                        )}
                        <span className={`font-bold text-sm sm:text-base ${colors.text}`}>
                          Tier {tierLevel}
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
