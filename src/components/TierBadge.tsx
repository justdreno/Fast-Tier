import { Heart, Flame, Sword, Axe, Hammer, Users, Swords } from 'lucide-react';

interface TierBadgeProps {
  gamemode: string;
  tier: string;
  showGamemode?: boolean;
}

const gamemodeLabels: Record<string, string> = {
  vanilla: 'Vanilla',
  uhc: 'UHC',
  pot: 'Pot',
  nethop: 'NethOP',
  smp: 'SMP',
  sword: 'Sword',
  axe: 'Axe',
  mace: 'Mace',
  ltms: 'LTMs',
};

export default function TierBadge({ gamemode, tier, showGamemode = false }: TierBadgeProps) {
  const getIcon = () => {
    switch (gamemode) {
      case 'vanilla':
      case 'uhc':
        return Heart;
      case 'pot':
      case 'nethop':
        return Flame;
      case 'sword':
        return Sword;
      case 'axe':
        return Axe;
      case 'mace':
        return Hammer;
      case 'smp':
        return Users;
      default:
        return Swords;
    }
  };

  const getTierColor = () => {
    if (tier.startsWith('HT')) {
      const tierNum = parseInt(tier.replace('HT', ''));
      if (tierNum === 1) return 'bg-gradient-to-br from-[#10b981] to-[#059669] border-[#10b981]/30 text-white shadow-[#10b981]/20';
      if (tierNum === 2) return 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-[#8b5cf6]/30 text-white shadow-[#8b5cf6]/20';
      if (tierNum === 3) return 'bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] border-[#ff9f43]/30 text-white shadow-[#ff9f43]/20';
      return 'bg-gradient-to-br from-[#ff9f43] to-[#ff7700] border-[#ff9f43]/30 text-white shadow-[#ff9f43]/20';
    }
    if (tier.startsWith('LT')) {
      return 'bg-white/[0.04] border-white/[0.08] text-white/70 shadow-transparent';
    }
    return 'bg-white/[0.02] border-white/[0.05] text-white/50 shadow-transparent';
  };

  const Icon = getIcon();

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs tracking-wide
      ${getTierColor()}
      hover:scale-110 transition-all duration-200 cursor-default
      shadow-lg
    `}>
      <Icon size={12} strokeWidth={2.5} />
      {showGamemode && <span className="opacity-60 font-medium">{gamemodeLabels[gamemode] || gamemode}</span>}
      <span>{tier}</span>
    </div>
  );
}
