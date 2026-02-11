import TierBadge from './TierBadge';

interface Player {
  id: string;
  username: string;
  rank: string;
  points: number;
  region: string;
  tiers: Array<{ gamemode: string; tier: string }>;
}

interface PlayerRowProps {
  player: Player;
  rank: number;
}

export default function PlayerRow({ player, rank }: PlayerRowProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-[#ffd700] to-[#ffed4e]';
    if (rank === 2) return 'bg-gradient-to-br from-[#c0c0c0] to-[#e8e8e8]';
    if (rank === 3) return 'bg-gradient-to-br from-[#cd7f32] to-[#ff9f43]';
    return 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]';
  };

  const getRankTextColor = (rank: number) => {
    if (rank <= 3) return 'text-[#0a0a0a]';
    return 'text-white';
  };

  return (
    <>
      <td className="px-6 py-4">
        <div className={`w-12 h-12 rounded-lg ${getRankColor(rank)} flex items-center justify-center text-lg font-bold ${getRankTextColor(rank)} shadow-lg`}>
          {rank}.
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={`https://render.crafty.gg/3d/bust/${player.username}`}
              alt={player.username}
              className="w-16 h-16 object-cover rounded-lg border border-white/10 shadow-lg group-hover:border-[#ff9f43]/30 transition-colors"
              onError={(e) => {
                e.currentTarget.src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
              }}
            />
          </div>
          <div>
            <div className="text-white font-bold text-base group-hover:text-[#ff9f43] transition-colors">
              {player.username}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#ff9f43] font-semibold">{player.rank}</span>
              <span className="text-white/40">({player.points} pts)</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide ${
          player.region === 'NA'
            ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
            : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
        }`}>
          {player.region}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {player.tiers.map((tier, index) => (
            <TierBadge key={index} gamemode={tier.gamemode} tier={tier.tier} />
          ))}
        </div>
      </td>
    </>
  );
}
