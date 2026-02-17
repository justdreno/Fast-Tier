import type { Player } from '../lib/supabase';

interface PlayerRowProps {
  player: Player;
  rank: number;
  gamemode: string;
}

const allGamemodes = ['vanilla', 'uhc', 'pot', 'nethop', 'smp', 'sword', 'axe', 'mace'];

const gamemodeIconPaths: Record<string, string> = {
  vanilla: '/kits/vanilla.svg',
  uhc: '/kits/uhc.svg',
  pot: '/kits/pot.svg',
  nethop: '/kits/nethop.svg',
  smp: '/kits/smp.svg',
  sword: '/kits/sword.svg',
  axe: '/kits/axe.svg',
  mace: '/kits/mace.svg',
  ltms: '/kits/global.svg',
};

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
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="relative w-full h-12 sm:h-14 flex items-center justify-center">
          {podiumBg ? (
            <>
              {/* Podium background - full width of cell */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${podiumBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              {/* Rank number */}
              <span className="relative z-10 text-2xl sm:text-3xl font-black text-white drop-shadow-lg italic"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {rank}.
              </span>
            </>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-white/40">{rank}.</span>
          )}
        </div>
      </td>
      <td className="pl-5 pr-3 sm:pl-6 sm:pr-4 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Avatar with rank badge overlay */}
          <div className="relative">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-lg opacity-0 group-hover/avatar:opacity-30 blur-md transition-opacity duration-300" />
              <img
                src={`https://render.crafty.gg/3d/bust/${player.username}`}
                alt={player.username}
                className="relative w-11 h-11 sm:w-14 sm:h-14 object-cover rounded-lg border border-white/[0.06] group-hover:border-[#ff9f43]/30 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://render.crafty.gg/3d/bust/MHF_Alex';
                }}
              />
            </div>
          </div>

          {/* Player info */}
          <div className="min-w-0 flex-1">
            {/* Username with Region */}
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-white font-bold text-sm sm:text-base group-hover:text-[#ff9f43] transition-colors duration-300 truncate">
                {player.username}
              </div>
              <span className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 rounded font-bold text-[9px] sm:text-[10px] tracking-wider uppercase ${player.region === 'NA'
                ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/25'
                : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25'
                }`}>
                {player.region}
              </span>
            </div>
            {/* Rank title with icon */}
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <img
                src={rankIcon}
                alt={player.rank}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain"
              />
              <span className="text-[#ff9f43] font-semibold text-xs sm:text-sm">{player.rank}</span>
              <span className="text-white/40 text-xs sm:text-sm">({player.points} pts)</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 sm:px-4 py-3 sm:py-4">
        {gamemode === 'overall' ? (
          <div className="flex gap-3 sm:gap-4 justify-end overflow-x-auto scrollbar-thin">
            {allGamemodes.map((gmCode) => {
              const playerTier = displayTiers.find(t => t.gamemode?.code === gmCode);
              const iconPath = gamemodeIconPaths[gmCode] || '/kits/global.svg';
              
              if (playerTier) {
                const tierCode = playerTier.tier_definition?.code ?? 'N/A';
                return (
                  <div key={gmCode} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center">
                      <img src={iconPath} alt={gmCode} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#ff9f43]">{tierCode}</span>
                  </div>
                );
              }
              
              // Empty slot
              return (
                <div key={gmCode} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                    <span className="text-white/30 text-xs">-</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white/20">-</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            {displayTiers.length > 0 ? (
              displayTiers.map((playerTier, index) => {
                const gamemodeCode = playerTier.gamemode?.code ?? 'unknown';
                const tierCode = playerTier.tier_definition?.code ?? 'N/A';
                const iconPath = gamemodeIconPaths[gamemodeCode] || '/kits/global.svg';
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center">
                      <img src={iconPath} alt={gamemodeCode} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#ff9f43]">{tierCode}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-white/30 text-xs">-</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-white/20">-</span>
              </div>
            )}
          </div>
        )}
      </td>
    </>
  );
}
