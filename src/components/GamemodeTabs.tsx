import { Trophy, Swords, Heart, Flame, Users, Sword, Axe, Hammer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGamemodes, type Gamemode } from '../lib/supabase';

interface GamemodeTabsProps {
  selectedGamemode: string;
  setSelectedGamemode: (gamemode: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Swords,
  Heart,
  Flame,
  Users,
  Sword,
  Axe,
  Hammer,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Swords;
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
            flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-[13px]
            ${selectedGamemode === 'overall'
              ? 'bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] text-black shadow-lg shadow-[#ff9f43]/25'
              : 'bg-white/[0.04] text-white/40 hover:text-white/80 hover:bg-white/[0.08] border border-white/[0.06]'
            }
          `}
        >
          <Trophy size={12} className="sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
          <span>Overall</span>
        </button>

        {/* Gamemode tabs */}
        {gamemodes.map((gamemode) => {
          const Icon = getIcon(gamemode.icon_name || 'Swords');
          const isSelected = selectedGamemode === gamemode.code;

          return (
            <button
              key={gamemode.id}
              onClick={() => setSelectedGamemode(gamemode.code)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap text-xs sm:text-[13px]
                ${isSelected
                  ? 'bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] text-black shadow-lg shadow-[#ff9f43]/25'
                  : 'bg-white/[0.04] text-white/40 hover:text-white/80 hover:bg-white/[0.08] border border-white/[0.06]'
                }
              `}
            >
              <Icon size={12} className="sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">{gamemode.display_name}</span>
              <span className="sm:hidden">{gamemode.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
