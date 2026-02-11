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
    <div className="mb-10">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {gamemodes.map((gamemode) => {
          const Icon = gamemode.icon;
          const isSelected = selectedGamemode === gamemode.id;

          return (
            <button
              key={gamemode.id}
              onClick={() => setSelectedGamemode(gamemode.id)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-all whitespace-nowrap text-sm
                ${isSelected
                  ? 'bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] text-black shadow-xl shadow-[#ff9f43]/40 scale-105'
                  : 'bg-[#0f0f0f] text-white/50 hover:text-white hover:bg-[#1a1a1a] border border-white/10 hover:border-white/20'
                }
              `}
            >
              <Icon size={16} />
              <span>{gamemode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
