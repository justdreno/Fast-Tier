import TierBadge from './TierBadge';
import type { Player } from '../lib/supabase';

interface PlayerRowProps {
  player: Player;
  rank: number;
  gamemode: string;
}

// Function to get rank icon based on player rank title
const getRankIcon = (rankTitle: string): string => {
  const rankLower = rankTitle.toLowerCase();
  if (rankLower.includes('grandmaster')) return '/ranks/combat_ace.webp';
  if (rankLower.includes('master')) return '/ranks/combat_master.webp';
  if (rankLower.includes('specialist')) return '/ranks/combat_specialist.webp';
  if (rankLower.includes('cadet')) return '/ranks/combat_cadet.webp';
  if (rankLower.includes('novice')) return '/ranks/combat_novice.webp';
  return '/ranks/rookie.webp';
};

// Function to get podium background for top 3 ranks
const getPodiumBackground = (rank: number): string | null => {
  switch (rank) {
    case 1:
      return '/podeum/gold.svg';
    case 2:
      return '/podeum/silver.svg';
    case 3:
      return '/podeum/bronze.svg';
    default:
      return null;
  }
};

export default function PlayerRow({ player, rank, gamemode }: PlayerRowProps) {
  // Filter tiers by gamemode
  const playerTiers = player.tiers || [];
  const displayTiers = gamemode === 'overall'
    ? playerTiers
    : playerTiers.filter(t => t.gamemode?.code === gamemode);

  const podiumBg = getPodiumBackground(rank);
  const rankIcon = getRankIcon(player.rank);

  return (
    <>
      <td className="w-24 px-5 py-4">
        <div className="relative w-20 h-14 flex items-center justify-center overflow-visible">
          {podiumBg ? (
            <>
              {/* Podium background */}
              <div
                className="absolute inset-y-0 left-0 w-[120px] -ml-6"
                style={{
                  backgroundImage: `url(${podiumBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)',
                }}
              />
              {/* Rank number */}
              <span className="relative z-10 text-3xl font-black text-white drop-shadow-lg italic"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {rank}.
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-white/40">{rank}.</span>
          )}
        </div>
      </td>
      <td className="min-w-[300px] px-5 py-4">
        <div className="flex items-center gap-4">
          {/* Avatar with rank badge overlay */}
          <div className="relative">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-lg opacity-0 group-hover/avatar:opacity-30 blur-md transition-opacity duration-300" />
              <img
                src={`https://render.crafty.gg/3d/bust/${player.username}`}
                alt={player.username}
                className="relative w-14 h-14 object-cover rounded-lg border border-white/[0.06] group-hover:border-[#ff9f43]/30 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
                }}
              />
            </div>
          </div>

          {/* Player info */}
          <div>
            {/* Username */}
            <div className="text-white font-bold text-base group-hover:text-[#ff9f43] transition-colors duration-300">
              {player.username}
            </div>
            {/* Rank title with icon */}
            <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
              <img
                src={rankIcon}
                alt={player.rank}
                className="w-4 h-4 object-contain"
              />
              <span className="text-[#ff9f43] font-semibold text-sm">{player.rank}</span>
              <span className="text-white/40 text-sm">({player.points} points)</span>
            </div>
          </div>
        </div>
      </td>
      <td className="w-32 px-5 py-4">
        <div className={`inline-flex px-3 py-1.5 rounded-lg font-bold text-[11px] tracking-wider uppercase ${player.region === 'NA'
          ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/25'
          : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25'
          }`}>
          {player.region}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {displayTiers.length > 0 ? (
            displayTiers.map((playerTier, index) => {
              const gamemodeCode = playerTier.gamemode?.code ?? 'unknown';
              const tierCode = playerTier.tier_definition?.code ?? 'N/A';
              return (
                <TierBadge
                  key={index}
                  gamemode={gamemodeCode}
                  tier={tierCode}
                />
              );
            })
          ) : (
            <span className="text-white/20 text-xs italic">No tier</span>
          )}
        </div>
      </td>
    </>
  );
}
