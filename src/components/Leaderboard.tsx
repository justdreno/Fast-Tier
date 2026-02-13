import { useState, useEffect, useMemo } from 'react';
import PlayerRow from './PlayerRow';
import { getPlayers, searchPlayers, type Player } from '../lib/supabase';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'points' | 'region';
type SortDirection = 'asc' | 'desc';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
  onSelectPlayer: (player: { player: Player; rank: number } | null) => void;
}

export default function Leaderboard({ gamemode, searchQuery, onSelectPlayer }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
    const sorted = [...players].sort((a, b) => {
      if (sortField === 'region') {
        const regionOrder = { 'NA': 1, 'EU': 2, 'ASIA': 3, 'LKA': 4, 'OTHER': 5 };
        const aOrder = regionOrder[a.region as keyof typeof regionOrder] || 99;
        const bOrder = regionOrder[b.region as keyof typeof regionOrder] || 99;
        return sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder;
      }
      return sortDirection === 'asc' ? a.points - b.points : b.points - a.points;
    });
    return sorted;
  }, [players, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'region' ? 'asc' : 'desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={12} className="ml-1 inline" /> : <ChevronDown size={12} className="ml-1 inline" />;
  };

  if (loading) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20 p-8 sm:p-12 text-center">
          <div className="text-white/30 text-sm sm:text-base">Loading players...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20 p-8 sm:p-12 text-center">
          <div className="text-red-400 text-sm sm:text-base">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="w-24 px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    Rank
                  </th>
                  <th className="min-w-[300px] px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    Player
                  </th>
                  <th
                    className="w-32 px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] cursor-pointer hover:text-white/50 transition-colors"
                    onClick={() => handleSort('region')}
                  >
                    Region <SortIcon field="region" />
                  </th>
                  <th
                    className="px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] cursor-pointer hover:text-white/50 transition-colors"
                    onClick={() => handleSort('points')}
                  >
                    Tiers <SortIcon field="points" />
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
                    <td colSpan={4} className="px-6 py-16 sm:py-20 text-center">
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

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {sortedPlayers.length > 0 ? (
              <div className="divide-y divide-white/[0.03]">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    onClick={() => onSelectPlayer({ player, rank: index + 1 })}
                    className="p-3 hover:bg-white/[0.02] active:bg-white/[0.04] transition-all duration-200 cursor-pointer animate-fadeInUp"
                    style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-8 flex justify-center">
                        {index + 1 <= 3 ? (
                          <span className={`text-base font-bold ${index + 1 === 1 ? 'text-[#ffd700]' :
                            index + 1 === 2 ? 'text-[#c0c0c0]' :
                              'text-[#cd7f32]'
                            }`}>
                            {index + 1}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-white/30">{index + 1}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={`https://render.crafty.gg/3d/bust/${player.username}`}
                          alt={player.username}
                          className="w-10 h-10 object-cover rounded-lg border border-white/[0.06]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-white text-sm truncate">{player.username}</h3>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${player.region === 'NA'
                            ? 'bg-[#ef4444]/10 text-[#ef4444]/80'
                            : 'bg-[#10b981]/10 text-[#10b981]/80'
                            }`}>
                            {player.region}
                          </span>
                        </div>
                        <div className="text-xs text-[#ff9f43]/80">{player.rank}</div>

                        {/* Tiers */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {gamemode === 'overall' ? (
                            (player.tiers || []).slice(0, 4).map((playerTier, tierIndex) => {
                              const tierCode = playerTier.tier_definition?.code ?? 'N/A';
                              return (
                                <span
                                  key={tierIndex}
                                  className="text-[9px] px-1.5 py-0.5 bg-white/[0.04] rounded text-white/50"
                                >
                                  {tierCode}
                                </span>
                              );
                            })
                          ) : (
                            (player.tiers || [])
                              .filter(t => t.gamemode?.code === gamemode)
                              .map((playerTier, tierIndex) => {
                                const tierCode = playerTier.tier_definition?.code ?? 'N/A';
                                return (
                                  <span
                                    key={tierIndex}
                                    className="text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-[#ff9f43]/20 to-[#ff8c00]/20 rounded-lg text-[#ff9f43]"
                                  >
                                    {tierCode}
                                  </span>
                                );
                              })
                          )}
                          {gamemode === 'overall' && (player.tiers || []).length > 4 && (
                            <span className="text-[9px] text-white/30">+{(player.tiers || []).length - 4}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-sm font-semibold text-white/25">No players found</div>
                <div className="text-xs text-white/15 mt-1">Try a different search</div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
