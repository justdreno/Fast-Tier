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

// Helper for Rank Title Icons
const getRankIcon = (rankTitle: string): string => {
  const rankLower = rankTitle.toLowerCase();
  if (rankLower.includes('grandmaster')) return '/ranks/combat_master.webp'; // Fallback or specific icon
  if (rankLower.includes('master')) return '/ranks/combat_master.webp';
  if (rankLower.includes('ace')) return '/ranks/combat_ace.webp';
  if (rankLower.includes('specialist')) return '/ranks/combat_specialist.webp';
  if (rankLower.includes('cadet')) return '/ranks/combat_cadet.webp';
  if (rankLower.includes('novice')) return '/ranks/combat_novice.webp';
  return '/ranks/rookie.webp';
};

// Helper for Podium Styling
const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1: return { 
      color: 'text-[#fbbf24]', 
      shadow: 'drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]',
      bg: '/podeum/gold.svg'
    };
    case 2: return { 
      color: 'text-[#e2e8f0]', 
      shadow: 'drop-shadow-[0_0_10px_rgba(226,232,240,0.5)]',
      bg: '/podeum/silver.svg'
    };
    case 3: return { 
      color: 'text-[#b45309]', 
      shadow: 'drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]',
      bg: '/podeum/bronze.svg'
    };
    default: return { 
      color: 'text-white/40', 
      shadow: '',
      bg: null
    };
  }
};

export default function PlayerRow({ player, rank, gamemode }: PlayerRowProps) {
  const playerTiers = player.tiers || [];
  
  // If specific gamemode selected, filter tiers
  const displayTiers = gamemode === 'overall'
    ? playerTiers
    : playerTiers.filter(t => t.gamemode?.code === gamemode);

  const rankStyle = getRankStyle(rank);
  const rankIcon = getRankIcon(player.rank);
  const animationDelay = Math.min((rank - 1) * 0.05, 0.5);

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-anim { animation: slideInUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      {/* 
         1. RANK COLUMN 
      */}
      <td className="relative px-2 py-3 sm:px-4 sm:py-5 row-anim align-middle" style={{ animationDelay: `${animationDelay}s` }}>
        <div className="flex items-center justify-center w-12 sm:w-16">
          {rank <= 3 ? (
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 hover:scale-110">
              {/* Podium Image Background */}
              {rankStyle.bg && (
                <img 
                  src={rankStyle.bg} 
                  alt={`Rank ${rank}`}
                  className="absolute inset-0 w-full h-full object-contain opacity-90" 
                />
              )}
              {/* Rank Number */}
              <span className={`relative z-10 text-2xl sm:text-3xl font-black italic ${rankStyle.color} ${rankStyle.shadow}`} 
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {rank}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-white/30 font-mono">
              #{rank}
            </span>
          )}
        </div>
      </td>

      {/* 
         2. PLAYER PROFILE COLUMN 
      */}
      <td className="px-2 py-3 sm:px-4 sm:py-5 w-full row-anim align-middle" style={{ animationDelay: `${animationDelay + 0.05}s` }}>
        <div className="flex items-center gap-4 group cursor-pointer">
          
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/[0.1] group-hover:border-[#ff9f43]/50 transition-colors duration-300 shadow-lg">
              <img
                src={`https://render.crafty.gg/3d/bust/${player.username}`}
                alt={player.username}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { e.currentTarget.src = 'https://render.crafty.gg/3d/bust/MHF_Alex'; }}
              />
            </div>
            {/* Online/Region Dot (Optional decorative element) */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-[#0a0a0a] flex items-center justify-center bg-[#1a1a1a]`}>
               <span className={`w-2 h-2 rounded-full ${player.region === 'NA' ? 'bg-blue-500' : player.region === 'EU' ? 'bg-green-500' : 'bg-[#ff9f43]'}`}></span>
            </div>
          </div>

          {/* Text Info */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm sm:text-base truncate group-hover:text-[#ff9f43] transition-colors duration-300">
                {player.username}
              </span>
              {/* Region Badge */}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-white/[0.05] border border-white/[0.1] text-white/50 uppercase tracking-wider">
                {player.region}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-0.5">
              {/* Rank Icon Mini */}
              <img src={rankIcon} alt="Rank" className="w-3.5 h-3.5 object-contain opacity-80" />
              <span className="text-xs sm:text-sm font-medium text-white/60">
                {player.rank}
                <span className="mx-1.5 text-white/20">|</span>
                <span className="text-[#ff9f43] font-bold">{player.points} Pts</span>
              </span>
            </div>
          </div>

        </div>
      </td>

      {/* 
         3. TIERS / GAMEMODES COLUMN 
      */}
      <td className="px-2 py-3 sm:px-4 sm:py-5 row-anim align-middle" style={{ animationDelay: `${animationDelay + 0.1}s` }}>
        {gamemode === 'overall' ? (
          // OVERALL VIEW: Horizontal list of glass chips
          <div className="flex items-center justify-end gap-2 overflow-x-auto scrollbar-hide py-1 pl-4">
            {allGamemodes.map((gmCode) => {
              const playerTier = displayTiers.find(t => t.gamemode?.code === gmCode);
              const iconPath = gamemodeIconPaths[gmCode] || '/kits/global.svg';
              const hasTier = !!playerTier;

              return (
                <div 
                  key={gmCode} 
                  className={`
                    flex flex-col items-center justify-center gap-1 w-9 flex-shrink-0 transition-all duration-300
                    ${hasTier ? 'opacity-100 hover:-translate-y-1 scale-100' : 'opacity-20 grayscale scale-90'}
                  `}
                  title={hasTier ? `${gmCode.toUpperCase()}: ${playerTier?.tier_definition?.code}` : `${gmCode.toUpperCase()}: Unranked`}
                >
                  {/* Icon Chip */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300
                    ${hasTier 
                      ? 'bg-gradient-to-br from-white/[0.08] to-transparent border-white/[0.15] shadow-[0_4px_10px_rgba(0,0,0,0.3)]' 
                      : 'bg-transparent border-white/[0.05]'
                    }
                  `}>
                    <img src={iconPath} alt={gmCode} className="w-4 h-4" />
                  </div>
                  
                  {/* Tier Text */}
                  <span className={`text-[9px] font-black uppercase tracking-tight ${hasTier ? 'text-[#ff9f43]' : 'text-white/30'}`}>
                    {hasTier ? playerTier?.tier_definition?.code : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // SINGLE GAMEMODE VIEW: Large badge
          <div className="flex justify-end pr-2 sm:pr-4">
             {displayTiers.length > 0 ? (
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#ff9f43]/10 border border-[#ff9f43]/30 shadow-[0_0_15px_rgba(255,159,67,0.15)]">
                  <img 
                    src={gamemodeIconPaths[gamemode] || '/kits/global.svg'} 
                    alt={gamemode}
                    className="w-5 h-5"
                  />
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-[10px] text-[#ff9f43]/70 font-bold uppercase tracking-wider">Tier</span>
                    <span className="text-lg font-black text-[#ff9f43]">{displayTiers[0].tier_definition?.code}</span>
                  </div>
                </div>
             ) : (
               <div className="px-4 py-2 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                 <span className="text-white/20 text-xs font-medium">Unranked</span>
               </div>
             )}
          </div>
        )}
      </td>
    </>
  );
}