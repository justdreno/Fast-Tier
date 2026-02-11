import { Trophy, Swords, Heart, Flame, Users, Sword, Axe, Hammer } from 'lucide-react';

interface GamemodeTabsProps {
  selectedGamemode: string;
  setSelectedGamemode: (gamemode: string) => void;
}

const gamemodes = [
  { id: 'overall', label: 'Overall', icon: Trophy },
  { id: 'ltms', label: 'LTMs', icon: Swords },
  { id: 'vanilla', label: 'Vanilla', icon: Heart },
  { id: 'uhc', label: 'UHC', icon: Heart },
  { id: 'pot', label: 'Pot', icon: Flame },
  { id: 'nethop', label: 'NethOP', icon: Flame },
  { id: 'smp', label: 'SMP', icon: Users },
  { id: 'sword', label: 'Sword', icon: Sword },
  { id: 'axe', label: 'Axe', icon: Axe },
  { id: 'mace', label: 'Mace', icon: Hammer },
];

export default function GamemodeTabs({ selectedGamemode, setSelectedGamemode }: GamemodeTabsProps) {
  return (
    <div className="mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
      <div className="flex flex-wrap items-center gap-2.5">
        {gamemodes.map((gamemode, index) => {
          const Icon = gamemode.icon;
          const isSelected = selectedGamemode === gamemode.id;

          return (
            <button
              key={gamemode.id}
              onClick={() => setSelectedGamemode(gamemode.id)}
              style={{ animationDelay: `${index * 0.04}s` }}
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
              <span>{gamemode.label}</span>
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
