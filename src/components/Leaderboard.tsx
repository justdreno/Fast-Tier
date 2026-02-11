import { useState } from 'react';
import PlayerRow from './PlayerRow';
import PlayerProfile from './PlayerProfile';
import { mockPlayers } from '../data/mockData';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
}

interface Player {
  id: string;
  uid: string;
  username: string;
  rank: string;
  points: number;
  region: string;
  tiers: Array<{ gamemode: string; tier: string }>;
}

export default function Leaderboard({ gamemode, searchQuery }: LeaderboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; rank: number } | null>(null);

  const filteredPlayers = mockPlayers.filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player, index) => (
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
