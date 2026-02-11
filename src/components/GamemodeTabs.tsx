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
      <div className="mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-4 py-2 bg-white/[0.04] rounded-full text-white/40 text-[13px]">Loading gamemodes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Overall tab - always first */}
        <button
          onClick={() => setSelectedGamemode('overall')}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap text-[13px]
            ${selectedGamemode === 'overall'
              ? 'bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] text-black shadow-lg shadow-[#ff9f43]/25 scale-105'
              : 'bg-white/[0.04] text-white/40 hover:text-white/80 hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12]'
            }
          `}
        >
          {selectedGamemode === 'overall' && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] opacity-20 blur-md -z-10" />
          )}
          <Trophy size={14} strokeWidth={2.5} />
          <span>Overall</span>
          {selectedGamemode === 'overall' && (
            <div className="w-1.5 h-1.5 rounded-full bg-black/40 ml-0.5" />
          )}
        </button>

        {/* Dynamic gamemodes from database */}
        {gamemodes.map((gamemode, index) => {
          const Icon = getIcon(gamemode.icon_name || 'Swords');
          const isSelected = selectedGamemode === gamemode.code;

          return (
            <button
              key={gamemode.id}
              onClick={() => setSelectedGamemode(gamemode.code)}
              style={{ animationDelay: `${(index + 1) * 0.04}s` }}
              className={`
                animate-fadeInUp
                relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap text-[13px]
                ${isSelected
                  ? 'bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] text-black shadow-lg shadow-[#ff9f43]/25 scale-105'
                  : 'bg-white/[0.04] text-white/40 hover:text-white/80 hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12]'
                }
              `}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] opacity-20 blur-md -z-10" />
              )}
              <Icon size={14} strokeWidth={2.5} />
              <span>{gamemode.display_name}</span>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-black/40 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
