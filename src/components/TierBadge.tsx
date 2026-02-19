interface TierBadgeProps {
  gamemode: string;
  tier: string;
}

const gamemodeIcons: Record<string, string> = {
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

const gamemodeColors: Record<string, { bg: string; border: string }> = {
  vanilla: { bg: 'bg-[#7a50e0]', border: 'border-[#7a50e0]' },
  uhc: { bg: 'bg-[#10b981]', border: 'border-[#10b981]' },
  pot: { bg: 'bg-[#f97316]', border: 'border-[#f97316]' },
  nethop: { bg: 'bg-[#ef4444]', border: 'border-[#ef4444]' },
  smp: { bg: 'bg-[#22c55e]', border: 'border-[#22c55e]' },
  sword: { bg: 'bg-[#4055a4]', border: 'border-[#4055a4]' },
  axe: { bg: 'bg-[#a855f7]', border: 'border-[#a855f7]' },
  mace: { bg: 'bg-[#ec4899]', border: 'border-[#ec4899]' },
  ltms: { bg: 'bg-[#f59e0b]', border: 'border-[#f59e0b]' },
};

export default function TierBadge({ gamemode, tier }: TierBadgeProps) {
  const colors = gamemodeColors[gamemode] || { bg: 'bg-[#6b7280]', border: 'border-[#6b7280]' };

  const getTierBadgeStyle = () => {
    if (tier.startsWith('HT')) {

      return {
        iconBg: colors.bg,
        labelBg: 'bg-[#3d3d1f]',
        labelText: 'text-[#eab308]',
        border: colors.border,
      };
    } else if (tier.startsWith('LT')) {

      return {
        iconBg: colors.bg,
        labelBg: 'bg-[#2a2a2a]',
        labelText: 'text-[#9ca3af]',
        border: colors.border,
      };
    }
    return {
      iconBg: 'bg-[#4b5563]',
      labelBg: 'bg-[#1f2937]',
      labelText: 'text-[#6b7280]',
      border: 'border-[#4b5563]',
    };
  };

  const style = getTierBadgeStyle();

  return (
    <div className="flex items-center">
      {}
      <div className={`
        w-9 h-9 rounded-full flex items-center justify-center
        ${style.iconBg} bg-opacity-80
        border-2 ${style.border}
        shadow-lg
        relative z-10
        p-1.5
      `}>
        <img
          src={gamemodeIcons[gamemode] || '/kits/global.svg'}
          alt={gamemode}
          className="w-full h-full object-contain"
        />
      </div>

      {}
      <div className={`
        -ml-1 px-3 py-1 rounded-r-lg rounded-l-none
        ${style.labelBg}
        border ${style.border} border-l-0
        ${style.labelText}
        text-xs font-bold tracking-wider
        min-w-[36px] text-center
      `}>
        {tier}
      </div>
    </div>
  );
}
