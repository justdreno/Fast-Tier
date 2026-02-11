import { Heart, Flame, Sword, Axe, Hammer, Users, Swords } from 'lucide-react';

interface TierBadgeProps {
  gamemode: string;
  tier: string;
}

export default function TierBadge({ gamemode, tier }: TierBadgeProps) {
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
      if (tierNum === 1) return 'bg-gradient-to-br from-[#10b981] to-[#059669] border-[#10b981]/30 text-white';
      if (tierNum === 2) return 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-[#8b5cf6]/30 text-white';
      if (tierNum === 3) return 'bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] border-[#ff9f43]/30 text-white';
      return 'bg-gradient-to-br from-[#ff9f43] to-[#ff7700] border-[#ff9f43]/30 text-white';
    }
    if (tier.startsWith('LT')) {
      return 'bg-[#1a1a1a] border-white/10 text-white/80';
    }
    return 'bg-[#0f0f0f] border-white/5 text-white/60';
  };

  const Icon = getIcon();

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs tracking-wide
      ${getTierColor()}
      hover:scale-110 transition-all cursor-default
      shadow-lg
    `}>
      <Icon size={13} strokeWidth={2.5} />
      <span>{tier}</span>
    </div>
  );
}
