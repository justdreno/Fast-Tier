import { Trophy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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

  // State for the sliding indicator
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Refs for the buttons to calculate positions
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

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

  // Combine "Overall" with fetched gamemodes for unified rendering logic
  const allTabs = [
    { code: 'overall', display_name: 'Overall', isStatic: true },
    ...gamemodes
  ];

  // Calculate position of the sliding pill whenever selection or data changes
  useEffect(() => {
    const activeIndex = allTabs.findIndex(tab => tab.code === selectedGamemode);
    const activeTabElement = tabsRef.current[activeIndex];

    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
        opacity: 1
      });
    }
  }, [selectedGamemode, allTabs.length, loading]);

  // Handle window resize to adjust the pill position
  useEffect(() => {
    const handleResize = () => {
      const activeIndex = allTabs.findIndex(tab => tab.code === selectedGamemode);
      const activeTabElement = tabsRef.current[activeIndex];
      if (activeTabElement) {
        setIndicatorStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth,
          opacity: 1
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedGamemode, allTabs]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 overflow-hidden py-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-24 bg-white/[0.04] rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Container for the tabs */}
      <div className="relative flex items-center bg-[#0a0a0a]/50 border border-white/[0.08] backdrop-blur-md rounded-2xl p-1.5 overflow-x-auto scrollbar-hide no-scrollbar">

        {/* THE SLIDING ANIMATED PILL */}
        <div
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#ff9f43] shadow-[0_0_15px_rgba(255,159,67,0.4)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {/* Tab Buttons */}
        {allTabs.map((tab, index) => {
          const isSelected = selectedGamemode === tab.code;
          const isOverall = tab.code === 'overall';
          const iconPath = !isOverall ? getIconPath(tab.code) : '';

          return (
            <button
              key={tab.code}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => setSelectedGamemode(tab.code)}
              className={`
                relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm
                transition-colors duration-300 whitespace-nowrap flex-shrink-0 select-none
                ${isSelected ? 'text-black' : 'text-white/40 hover:text-white'}
              `}
            >
              {/* Icon Logic */}
              <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                {isOverall ? (
                  <Trophy
                    size={16}
                    strokeWidth={2.5}
                    className={isSelected ? 'text-black' : 'text-white/40'}
                  />
                ) : (
                  <img
                    src={iconPath}
                    alt={tab.code}
                    className={`w-4 h-4 object-contain ${isSelected ? 'brightness-0 contrast-200' : 'opacity-50 grayscale'}`}
                  />
                )}
              </div>

              <span>{tab.display_name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}