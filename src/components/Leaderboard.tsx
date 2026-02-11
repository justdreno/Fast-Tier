import { useState, useEffect } from 'react';
import PlayerRow from './PlayerRow';
import PlayerProfile from './PlayerProfile';
import { getPlayers, searchPlayers, type Player } from '../lib/supabase';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
}

export default function Leaderboard({ gamemode, searchQuery }: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);

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

  if (loading) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20 p-12 text-center">
          <div className="text-white/30">Loading players...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20 p-12 text-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    Rank
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    Player
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    Region
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    {gamemode === 'overall' ? 'Tiers' : `${gamemode.charAt(0).toUpperCase() + gamemode.slice(1)} Tier`}
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.length > 0 ? (
                  players.map((player, index) => (
                    <tr
                      key={player.id}
                      onClick={() => setSelectedPlayer({ player, rank: index + 1 })}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group animate-fadeInUp"
                      style={{ animationDelay: `${0.25 + index * 0.05}s` }}
                    >
                      <PlayerRow player={player} rank={index + 1} gamemode={gamemode} />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
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

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer.player}
          rank={selectedPlayer.rank}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </>
  );
}
