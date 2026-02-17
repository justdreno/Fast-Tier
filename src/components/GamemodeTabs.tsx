import { Trophy, Loader2 } from 'lucide-react';
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

  // Stores the styling for the sliding active bar
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // References to the DOM elements
  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Update position of the sliding bar
  useEffect(() => {
    const activeTab = tabsRef.current[selectedGamemode];

    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        opacity: 1
      });
    }
  }, [selectedGamemode, gamemodes, loading]);

  // Handle resize to keep bar aligned
  useEffect(() => {
    const handleResize = () => {
      const activeTab = tabsRef.current[selectedGamemode];
      if (activeTab) {
        setIndicatorStyle(prev => ({
          ...prev,
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedGamemode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full py-6">
        <Loader2 className="animate-spin text-[#ff9f43]" size={24} />
      </div>
    );
  }

  const allTabs = [
    { code: 'overall', display_name: 'Overall' },
    ...gamemodes
  ];

  return (
    <div className="w-full">
      {/* 
        Container 
        - border-b: Creates the thin grey line across the whole width
      */}
      <div
        ref={containerRef}
        className="relative flex items-center border-b border-white/[0.08] overflow-x-auto scrollbar-hide"
      >

        {/* 
          THE SLIDING BAR 
          - absolute bottom-0: sits right on top of the grey border
          - h-[3px]: creates the underline thickness
        */}
        <div
          className="absolute bottom-0 h-[3px] bg-gradient-to-r from-[#ff9f43] to-[#ffb060] shadow-[0_-2px_12px_rgba(255,159,67,0.6)] z-10 transition-all duration-300 ease-out rounded-t-full"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {/* Tab Buttons */}
        {allTabs.map((tab) => {
          const isSelected = selectedGamemode === tab.code;
          const isOverall = tab.code === 'overall';
          const iconPath = !isOverall ? getIconPath(tab.code) : '';

          return (
            <button
              key={tab.code}
              ref={(el) => (tabsRef.current[tab.code] = el)}
              onClick={() => setSelectedGamemode(tab.code)}
              className={`
                relative z-0 flex items-center justify-center gap-2.5 px-6 py-4 font-bold text-sm
                transition-all duration-300 whitespace-nowrap flex-shrink-0 select-none
                hover:bg-white/[0.02]
                ${isSelected ? 'text-white' : 'text-white/40 hover:text-white/70'}
              `}
            >
              {/* Icon Container */}
              <div className={`transition-transform duration-300 ${isSelected ? 'scale-110 -translate-y-0.5' : 'scale-100'}`}>
                {isOverall ? (
                  <Trophy
                    size={18}
                    strokeWidth={isSelected ? 2.5 : 2}
                    className={`transition-colors duration-300 ${isSelected ? 'text-[#ff9f43]' : 'text-current'}`}
                  />
                ) : (
                  <img
                    src={iconPath}
                    alt={tab.code}
                    className={`w-5 h-5 object-contain transition-all duration-300 ${isSelected
                        ? 'brightness-100 contrast-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'
                        : 'opacity-40 grayscale'
                      }`}
                  />
                )}
              </div>

              <span className={`transition-colors duration-300 ${isSelected ? 'text-white drop-shadow-md' : ''}`}>
                {tab.display_name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}