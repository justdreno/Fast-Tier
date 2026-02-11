import TierBadge from './TierBadge';
import type { Player } from '../lib/supabase';

interface PlayerRowProps {
  player: Player;
  rank: number;
  gamemode: string;
}

export default function PlayerRow({ player, rank, gamemode }: PlayerRowProps) {
  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700] to-[#ffb800] rounded-xl opacity-20 blur-sm" />
          <div className="relative w-11 h-11 bg-gradient-to-br from-[#ffd700]/20 to-[#ffb800]/10 border border-[#ffd700]/30 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-[#ffd700]">1</span>
          </div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c0c0c0] to-[#a8a8a8] rounded-xl opacity-15 blur-sm" />
          <div className="relative w-11 h-11 bg-gradient-to-br from-[#c0c0c0]/15 to-[#a8a8a8]/10 border border-[#c0c0c0]/25 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-[#c0c0c0]">2</span>
          </div>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32] to-[#b8620e] rounded-xl opacity-15 blur-sm" />
          <div className="relative w-11 h-11 bg-gradient-to-br from-[#cd7f32]/15 to-[#b8620e]/10 border border-[#cd7f32]/25 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-[#cd7f32]">3</span>
          </div>
        </div>
      );
    }
    return (
      <div className="w-11 h-11 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center">
        <span className="text-sm font-bold text-white/30">{rank}</span>
      </div>
    );
  };

  // Filter tiers by gamemode
  const playerTiers = player.tiers || [];
  const displayTiers = gamemode === 'overall'
    ? playerTiers
    : playerTiers.filter(t => t.gamemode === gamemode);

  return (
    <>
      <td className="px-5 py-4">
        {getRankDisplay(rank)}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative group/avatar">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-xl opacity-0 group-hover/avatar:opacity-30 blur-md transition-opacity duration-300" />
            <img
              src={`https://render.crafty.gg/3d/bust/${player.username}`}
              alt={player.username}
              className="relative w-14 h-14 object-cover rounded-xl border border-white/[0.06] group-hover:border-[#ff9f43]/30 transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
              }}
            />
          </div>
          <div>
            <div className="text-white font-bold text-sm group-hover:text-[#ff9f43] transition-colors duration-300">
              {player.username}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#ff9f43]/80 font-medium text-xs">{player.rank}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/30 text-xs">{player.points} pts</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className={`inline-flex px-2.5 py-1 rounded-lg font-bold text-[11px] tracking-wider uppercase ${player.region === 'NA'
            ? 'bg-[#ef4444]/10 text-[#ef4444]/80 border border-[#ef4444]/15'
            : 'bg-[#10b981]/10 text-[#10b981]/80 border border-[#10b981]/15'
          }`}>
          {player.region}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {displayTiers.length > 0 ? (
            displayTiers.map((tier, index) => (
              <TierBadge
                key={index}
                gamemode={tier.gamemode}
                tier={tier.tier}
                showGamemode={gamemode === 'overall'}
              />
            ))
          ) : (
            <span className="text-white/20 text-xs italic">No tier</span>
          )}
        </div>
      </td>
    </>
  );
}
