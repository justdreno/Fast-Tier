import { useState, useEffect } from 'react';
import { X, Copy, User, CheckCircle, Trophy, Target, Zap, Medal, Crown } from 'lucide-react';
import type { Player, PlayerAchievement } from '../lib/supabase';

interface PlayerProfileProps {
  player: Player;
  rank: number;
  onClose: () => void;
}

interface ToastState {
  message: string;
  visible: boolean;
  exiting: boolean;
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

const gamemodeColors: Record<string, string> = {
  vanilla: '#ef4444',
  uhc: '#dc2626',
  pot: '#f97316',
  nethop: '#ea580c',
  smp: '#22c55e',
  sword: '#3b82f6',
  axe: '#8b5cf6',
  mace: '#a855f7',
  ltms: '#ec4899',
};

const achievementIcons: Record<string, React.ElementType> = {
  Target,
  Zap,
  Trophy,
  Medal,
  Crown,
};

const getTierStyle = (tier: string) => {
  if (tier?.startsWith('HT')) {
    const num = parseInt(tier.replace('HT', ''));
    if (num === 1) return { bg: 'bg-gradient-to-br from-[#10b981] to-[#059669]', text: 'text-white', shadow: 'shadow-[#10b981]/30', glow: 'from-[#10b981]/20' };
    if (num === 2) return { bg: 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]', text: 'text-white', shadow: 'shadow-[#8b5cf6]/30', glow: 'from-[#8b5cf6]/20' };
    if (num === 3) return { bg: 'bg-gradient-to-br from-[#ff9f43] to-[#ff8c00]', text: 'text-black', shadow: 'shadow-[#ff9f43]/30', glow: 'from-[#ff9f43]/20' };
    return { bg: 'bg-gradient-to-br from-[#ff9f43] to-[#ff7700]', text: 'text-black', shadow: 'shadow-[#ff9f43]/30', glow: 'from-[#ff9f43]/20' };
  }
  return { bg: 'bg-gradient-to-br from-white/[0.1] to-white/[0.05]', text: 'text-white/80', shadow: 'shadow-white/10', glow: 'from-white/10' };
};

const getAchievementIcon = (iconName: string): React.ElementType => {
  // Normalize icon name (handle null/undefined and make case-insensitive)
  if (!iconName) return Trophy;
  const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  return achievementIcons[normalizedName] || Trophy;
};

export default function PlayerProfile({ player, rank, onClose }: PlayerProfileProps) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, exiting: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true, exiting: false });
  };

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, exiting: true }));
      setTimeout(() => setToast({ message: '', visible: false, exiting: false }), 300);
    }, 1800);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.message]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm !z-[99999] flex items-center justify-center p-3 sm:p-4 animate-backdropIn" onClick={onClose}>
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 animate-scaleIn relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width-none]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Orange glow from corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff9f43]/10 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.05] sticky top-0 bg-[#141414]/95 backdrop-blur-xl z-20 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff9f43] animate-pulse" />
            <h2 className="text-sm font-bold text-white/70 tracking-wide">PLAYER PROFILE</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/[0.08] rounded-xl transition-all text-white/30 hover:text-white/80 active:bg-white/[0.12]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-5 sm:p-6 relative z-10">
          {/* Player Info */}
          <div className="flex items-start gap-4 sm:gap-5 mb-6">
            <div className="relative flex-shrink-0">
              {/* Avatar glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-3xl opacity-20 blur-xl scale-110" />
              <div className="relative">
                <img
                  src={`https://render.crafty.gg/3d/bust/${player.username}`}
                  alt={player.username}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 border-white/[0.1] bg-[#1a1a1a] shadow-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/${player.username}/128`;
                  }}
                />
                {/* Rank badge */}
                <div className="absolute -top-2 -right-2 w-9 h-9 bg-gradient-to-br from-[#ff9f43] to-[#ff7700] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff9f43]/40 border border-[#ff9f43]/50">
                  <span className="text-xs font-black text-black">#{rank}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-3">
                <h1 className="text-xl sm:text-2xl font-black text-white truncate">{player.username}</h1>
                <button
                  onClick={() => handleCopy(player.username, 'Username')}
                  className="p-1.5 hover:bg-white/[0.08] rounded-lg transition-all text-white/25 hover:text-[#ff9f43] shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                  <User size={11} className="text-[#ff9f43]/70" />
                  <span className="text-white/60 text-[11px] font-medium">{player.rank}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ff9f43]/10 rounded-lg border border-[#ff9f43]/20">
                  <Trophy size={11} className="text-[#ff9f43]" />
                  <span className="text-[#ff9f43] font-bold text-[11px]">{player.points} pts</span>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${player.region === 'NA'
                    ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20'
                    : player.region === 'EU'
                    ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20'
                    : 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20'
                  }`}>
                  {player.region}
                </div>
              </div>
            </div>
          </div>

          {/* Copy Username button */}
          <button
            onClick={() => handleCopy(player.username, 'Username')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 bg-gradient-to-r from-[#ff9f43]/10 via-[#ff9f43]/5 to-[#ff8c00]/10 border border-[#ff9f43]/20 rounded-xl text-[#ff9f43] text-sm font-semibold hover:from-[#ff9f43]/15 hover:via-[#ff9f43]/10 hover:to-[#ff8c00]/15 hover:border-[#ff9f43]/30 active:scale-[0.98] transition-all duration-300"
          >
            <Copy size={14} />
            Copy Username
          </button>

          {/* Gamemodes & Tiers - Modern Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-[#ff9f43] to-[#ff8c00] rounded-full" />
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Gamemodes</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(player.tiers || []).map((playerTier, index) => {
                const gamemodeCode = playerTier.gamemode?.code ?? 'unknown';
                const tierCode = playerTier.tier_definition?.code ?? 'N/A';
                const iconPath = gamemodeIconPaths[gamemodeCode] || '/kits/global.svg';
                const styles = getTierStyle(tierCode);
                const gamemodeColor = gamemodeColors[gamemodeCode] || '#ffffff';
                
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-2xl p-3 hover:from-white/[0.08] hover:to-white/[0.04] hover:border-white/[0.15] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Gamemode color glow */}
                    <div 
                      className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-full"
                      style={{ backgroundColor: gamemodeColor }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      {/* Icon with colored background */}
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${gamemodeColor}15`, border: `1px solid ${gamemodeColor}25` }}
                      >
                        <img src={iconPath} alt={gamemodeCode} className="w-5 h-5" style={{ filter: 'brightness(1.2)' }} />
                      </div>
                      
                      {/* Gamemode name */}
                      <span className="text-[11px] font-semibold text-white/60 group-hover:text-white/90 transition-colors">
                        {gamemodeLabels[gamemodeCode] || gamemodeCode}
                      </span>
                      
                      {/* Tier badge */}
                      <div className={`px-2.5 py-0.5 rounded-lg ${styles.bg} ${styles.text} text-[9px] font-black tracking-wider shadow-lg ${styles.shadow}`}>
                        {tierCode}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          {(player.achievements || []).length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] rounded-full" />
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Achievements</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(player.achievements || []).map((playerAchievement: PlayerAchievement, index: number) => {
                  const achievement = playerAchievement.achievement;
                  if (!achievement) return null;
                  const Icon = getAchievementIcon(achievement.icon_name || 'Trophy');
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:from-white/[0.08] transition-all duration-300"
                      style={{ borderColor: `${achievement.color_hex}15` }}
                    >
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${achievement.color_hex}15` }}
                      >
                        <Icon size={16} style={{ color: achievement.color_hex }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-white/70 truncate">{achievement.name}</div>
                        <div className="text-[9px] text-white/40 font-medium">+{achievement.points_bonus} pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] text-white/30 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Last updated 2 hours ago
            </span>
            <span className="text-[9px] text-white/20 font-mono">FastTier System</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[999999] w-[calc(100%-2rem)] max-w-xs ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}>
          <div className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/60">
            <CheckCircle size={16} className="text-[#10b981] flex-shrink-0" />
            <span className="text-sm font-medium text-white/80">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
