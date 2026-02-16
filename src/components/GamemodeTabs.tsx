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
      {/* Tab Container with rounded corners */}
      <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-thin -mx-3 px-3 sm:mx-0 sm:px-0 bg-[#1a1d29] rounded-2xl p-1.5 border border-white/[0.06]">
        {/* Overall tab */}
        <button
          onClick={() => setSelectedGamemode('overall')}
          className={`
            flex-shrink-0 flex flex-col items-center justify-center gap-1 px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all duration-200 min-w-[70px] sm:min-w-[90px]
            ${selectedGamemode === 'overall'
              ? 'text-white'
              : 'text-white/40 hover:text-white/70'
            }
          `}
        >
          <Trophy size={20} className="sm:w-5 sm:h-5" strokeWidth={2} />
          <span className="text-[10px] sm:text-xs">Overall</span>
          {selectedGamemode === 'overall' && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />
          )}
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
                flex-shrink-0 flex flex-col items-center justify-center gap-1 px-3 sm:px-5 py-2.5 rounded-xl font-medium transition-all duration-200 relative min-w-[60px] sm:min-w-[80px]
                ${isSelected
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
                }
              `}
            >
              <img src={iconPath} alt={gamemode.code} className="w-5 h-5 sm:w-5 sm:h-5 opacity-80" />
              <span className="text-[10px] sm:text-xs">{gamemode.display_name}</span>
              {isSelected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
