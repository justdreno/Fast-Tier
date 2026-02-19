import { useState, useEffect, useMemo } from 'react';
import { ChevronUp } from 'lucide-react';
import PlayerRow from './PlayerRow';
import GamemodeTabs from './GamemodeTabs';
import { getPlayers, searchPlayers, type Player } from '../lib/database';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
  onSelectPlayer: (player: { player: Player; rank: number } | null) => void;
  onGamemodeChange: (gamemode: string) => void;
  isInitialLoad?: boolean;
}

const tierColors = [
  { bg: 'from-[#ffd700]/20 to-[#ffcc00]/10', border: 'border-[#ffd700]/30', text: 'text-[#ffd700]', icon: '/tiers/tier_1.svg' },
  { bg: 'from-[#c0c0c0]/20 to-[#a0a0a0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]', icon: '/tiers/tier_2.svg' },
  { bg: 'from-[#cd7f32]/20 to-[#b87333]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]', icon: '/tiers/tier_3.svg' },
  { bg: 'from-[#3b82f6]/20 to-[#2563eb]/10', border: 'border-[#3b82f6]/30', text: 'text-[#3b82f6]', icon: null },
  { bg: 'from-[#64748b]/20 to-[#475569]/10', border: 'border-[#64748b]/30', text: 'text-[#64748b]', icon: null },
];

const getTierNumber = (tierCode: string): number => {
  const match = tierCode.match(/\d/);
  return match ? parseInt(match[0]) : 5;
};

const isHighTier = (tierCode: string): boolean => tierCode.startsWith('HT');

const groupPlayersByTierLevel = (players: Player[], gamemode: string) => {
  const groups: { [key: number]: { ht: Player[], lt: Player[] } } = {
    1: { ht: [], lt: [] },
    2: { ht: [], lt: [] },
    3: { ht: [], lt: [] },
    4: { ht: [], lt: [] },
    5: { ht: [], lt: [] }
  };

  players.forEach(player => {
    const relevantTiers = player.tiers?.filter(t => t.gamemode?.code === gamemode);

    if (relevantTiers && relevantTiers.length > 0) {
      const playerTier = relevantTiers[0];
      const tierCode = playerTier.tier_definition?.code || 'LT5';
      const tierNum = getTierNumber(tierCode);
      const isHT = isHighTier(tierCode);

      if (groups[tierNum]) {
        if (isHT) {
          groups[tierNum].ht.push(player);
        } else {
          groups[tierNum].lt.push(player);
        }
      }
    }
  });

  return groups;
};

export default function Leaderboard({ gamemode, searchQuery, onSelectPlayer, onGamemodeChange, isInitialLoad = false }: LeaderboardProps) {
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

  const tierGroups = groupPlayersByTierLevel(players, gamemode);
  const isOverall = gamemode === 'overall';

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
        <div className="border-b border-white/[0.06] bg-[#141414]/50 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#ff9f43]/20 animate-pulse" />
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-8 sm:p-12 text-center">
          <div className="text-white/30 text-sm sm:text-base">Loading players...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] p-8 sm:p-12 text-center">
        <div className="text-red-400 text-sm sm:text-base mb-2">Error loading players</div>
        <div className="text-white/50 text-xs sm:text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GamemodeTabs selectedGamemode={gamemode} setSelectedGamemode={onGamemodeChange} />
      
      <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
        <div className="border-b border-white/[0.06] bg-[#141414]/50 px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[#ff9f43]/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#ff9f43]" />
            </div>
            <span className="font-bold text-sm text-white">Leaderboard</span>
            <span className="text-white/30 text-xs">({sortedPlayers.length} players)</span>
          </div>
        </div>

        {sortedPlayers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="text-white/30 text-sm sm:text-base">No players found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-white/[0.04]">
                {sortedPlayers.map((player, index) => (
                  <tr
                    key={player.id}
                    onClick={() => onSelectPlayer({ player, rank: index + 1 })}
                    className="group cursor-pointer hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    <PlayerRow player={player} rank={index + 1} gamemode={gamemode} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!searchQuery && !isOverall && (
          <div className="border-t border-white/[0.06] p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((tierNum) => {
                const group = tierGroups[tierNum];
                const colors = tierColors[tierNum - 1];
                const hasPlayers = group.ht.length > 0 || group.lt.length > 0;

                if (!hasPlayers) return null;

                return (
                  <div
                    key={tierNum}
                    className={`bg-gradient-to-b ${colors.bg} border ${colors.border} rounded-xl p-3`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold ${colors.text}`}>Tier {tierNum}</span>
                      <span className="text-white/40 text-xs">{group.ht.length + group.lt.length}</span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-hide">
                      {group.ht.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => onSelectPlayer({ player, rank: sortedPlayers.findIndex(p => p.id === player.id) + 1 })}
                          className="flex items-center gap-2 p-1.5 rounded bg-white/5 hover:bg-white/10 cursor-pointer group"
                        >
                          <span className="text-[10px] font-bold text-[#ff9f43]">HT{tierNum}</span>
                          <span className="flex-1 text-white text-xs truncate group-hover:text-[#ff9f43]">
                            {player.username}
                          </span>
                          <ChevronUp className="w-3 h-3 text-white/40" />
                        </div>
                      ))}
                      {group.lt.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => onSelectPlayer({ player, rank: sortedPlayers.findIndex(p => p.id === player.id) + 1 })}
                          className="flex items-center gap-2 p-1.5 rounded bg-white/5 hover:bg-white/10 cursor-pointer group"
                        >
                          <span className="text-[10px] font-bold text-white/60">LT{tierNum}</span>
                          <span className="flex-1 text-white text-xs truncate group-hover:text-[#ff9f43]">
                            {player.username}
                          </span>
                          <ChevronUp className="w-3 h-3 text-white/40" />
                        </div>
                      ))}
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
