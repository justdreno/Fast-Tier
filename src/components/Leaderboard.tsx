import { useState, useEffect, useMemo } from 'react';
import PlayerRow from './PlayerRow';
import GamemodeTabs from './GamemodeTabs';
import { getPlayers, searchPlayers, type Player } from '../lib/supabase';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
  onSelectPlayer: (player: { player: Player; rank: number } | null) => void;
  onGamemodeChange: (gamemode: string) => void;
}

export default function Leaderboard({ gamemode, searchQuery, onSelectPlayer, onGamemodeChange }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sorting state (kept for future use)
  const [sortField] = useState<'points' | 'region'>('points');
  const [sortDirection] = useState<'asc' | 'desc'>('desc');

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

  if (loading) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
          {/* Header with Gamemode Tabs */}
          <div className="border-b border-white/[0.06] bg-[#141414]/50">
            <div className="px-3 sm:px-4 py-2">
              <GamemodeTabs 
                selectedGamemode={gamemode} 
                setSelectedGamemode={onGamemodeChange}
              />
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
          {/* Header with Gamemode Tabs */}
          <div className="border-b border-white/[0.06] bg-[#141414]/50">
            <div className="px-3 sm:px-4 py-2">
              <GamemodeTabs 
                selectedGamemode={gamemode} 
                setSelectedGamemode={onGamemodeChange}
              />
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
            <GamemodeTabs 
              selectedGamemode={gamemode} 
              setSelectedGamemode={onGamemodeChange}
            />
          </div>
        </div>

        {/* Table - Scrollable on all devices */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] bg-[#0f0f0f]/60">
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-[11px] font-bold text-white/30 uppercase tracking-wider w-28 sm:w-36">
                  Rank
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-[11px] font-bold text-white/30 uppercase tracking-wider w-auto">
                  Player
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-[11px] font-bold text-white/30 uppercase tracking-wider w-28 sm:w-36">
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
      </div>
    </div>
  );
}
