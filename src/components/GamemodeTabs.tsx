import { Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGamemodes, type Gamemode } from '../lib/supabase';

interface GamemodeTabsProps {
  selectedGamemode: string;
  setSelectedGamemode: (gamemode: string) => void;
}

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

const getIconPath = (gamemodeCode: string) => {
  return gamemodeIconPaths[gamemodeCode] || '/kits/global.svg';
};

export default function GamemodeTabs({ selectedGamemode, setSelectedGamemode }: GamemodeTabsProps) {
  const [gamemodes, setGamemodes] = useState<Gamemode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGamemodes() {
      try {
        const data = await getGamemodes();
        setGamemodes(data);
      } catch (error) {
        console.error('Error fetching gamemodes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGamemodes();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 sm:mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 bg-white/[0.04] rounded-full text-white/40 text-[13px]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      {/* Mobile: Horizontal scroll container */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin -mx-3 px-3 sm:mx-0 sm:px-0">
        {/* Overall tab */}
        <button
          onClick={() => setSelectedGamemode('overall')}
          className={`
            flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-[13px]
            ${selectedGamemode === 'overall'
              ? 'bg-[#ff9f43] text-black shadow-lg shadow-[#ff9f43]/25'
              : 'bg-[#141414] text-white/60 hover:text-white hover:bg-[#1a1a1a] border border-white/[0.08]'
            }
          `}
        >
          <Trophy size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
          <span>Overall</span>
        </button>

        {/* Gamemode tabs */}
        {gamemodes.map((gamemode) => {
          const iconPath = getIconPath(gamemode.code);
          const isSelected = selectedGamemode === gamemode.code;

          return (
            <button
              key={gamemode.id}
              onClick={() => setSelectedGamemode(gamemode.code)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-[13px]
                ${isSelected
                  ? 'bg-[#ff9f43] text-black shadow-lg shadow-[#ff9f43]/25'
                  : 'bg-[#141414] text-white/60 hover:text-white hover:bg-[#1a1a1a] border border-white/[0.08]'
                }
              `}
            >
              <img src={iconPath} alt={gamemode.code} className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{gamemode.display_name}</span>
              <span className="sm:hidden">{gamemode.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
