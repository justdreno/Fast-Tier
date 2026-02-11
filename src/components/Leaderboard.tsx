import { useState } from 'react';
import PlayerRow from './PlayerRow';
import ServerInfo from './ServerInfo';
import PlayerProfile from './PlayerProfile';
import { mockPlayers } from '../data/mockData';

interface LeaderboardProps {
  gamemode: string;
  searchQuery: string;
}

interface Player {
  id: string;
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
      <div className="relative">
        <div className="absolute top-0 right-0 z-10">
          <ServerInfo />
        </div>

        <div className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-[#0a0a0a]/50">
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">
                    Rank
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">
                    Player
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">
                    Region
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-white/40 uppercase tracking-widest">
                    Tiers
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      onClick={() => setSelectedPlayer({ player, rank: index + 1 })}
                      className="border-b border-white/5 hover:bg-[#1a1a1a]/60 transition-all cursor-pointer group"
                    >
                      <PlayerRow player={player} rank={index + 1} />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-white/40">
                      <div className="space-y-2">
                        <div className="text-lg font-semibold">No players found</div>
                        <div className="text-sm">Try searching for a different player</div>
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
