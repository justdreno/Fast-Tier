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
      <div className="flex items-center justify-center py-4 animate-pulse">
        <div className="px-4 py-2 bg-white/[0.04] rounded-full text-white/40 text-[13px]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      {/* Gamemode Tabs Container */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {/* Overall tab */}
        <button
          onClick={() => setSelectedGamemode('overall')}
          className={`
            flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 sm:px-6 py-3 rounded-xl font-medium 
            transition-all duration-300 ease-bounce relative min-w-[70px] sm:min-w-[85px]
            hover:scale-105 active:scale-95
            ${selectedGamemode === 'overall'
              ? 'bg-[#ff9f43]/15 text-[#ff9f43] shadow-[0_0_20px_rgba(255,159,67,0.2)]'
              : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]'
            }
          `}
        >
          <Trophy 
            size={22} 
            className={`sm:w-6 sm:h-6 transition-transform duration-300 ${selectedGamemode === 'overall' ? 'scale-110' : 'group-hover:scale-105'}`} 
            strokeWidth={2} 
          />
          <span className="text-[11px] sm:text-xs font-semibold">Overall</span>
          {selectedGamemode === 'overall' && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-[#ff9f43] rounded-full animate-fade-in" />
          )}
        </button>

        {/* Gamemode tabs with staggered animation */}
        {gamemodes.map((gamemode, index) => {
          const iconPath = getIconPath(gamemode.code);
          const isSelected = selectedGamemode === gamemode.code;

          return (
            <button
              key={gamemode.id}
              onClick={() => setSelectedGamemode(gamemode.code)}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-3 sm:px-5 py-3 rounded-xl font-medium 
                transition-all duration-300 ease-bounce relative min-w-[60px] sm:min-w-[80px]
                animate-fade-in-up
                hover:scale-105 active:scale-95
                ${isSelected
                  ? 'bg-[#ff9f43]/15 text-[#ff9f43] shadow-[0_0_20px_rgba(255,159,67,0.2)]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                }
              `}
              style={{ animationDelay: `${0.05 * (index + 1)}s` }}
            >
              <img 
                src={iconPath} 
                alt={gamemode.code} 
                className={`w-6 h-6 sm:w-6 sm:h-6 transition-all duration-300 ${isSelected ? 'opacity-100 scale-110' : 'opacity-70 hover:opacity-100'}`} 
              />
              <span className="text-[11px] sm:text-xs font-semibold">{gamemode.display_name}</span>
              {isSelected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-[#ff9f43] rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
