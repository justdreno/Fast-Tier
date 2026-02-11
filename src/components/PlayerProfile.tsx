import { useState, useEffect } from 'react';
import { LucideIcon, X, Copy, Hash, User, CheckCircle, Trophy, Target, Zap, Medal, Crown } from 'lucide-react';
import { Heart, Flame, Sword, Axe, Hammer, Users, Swords } from 'lucide-react';
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

const gamemodeIcons: Record<string, LucideIcon> = {
  vanilla: Heart,
  uhc: Heart,
  pot: Flame,
  nethop: Flame,
  smp: Users,
  sword: Sword,
  axe: Axe,
  mace: Hammer,
  ltms: Swords,
};

const achievementIcons: Record<string, LucideIcon> = {
  Target,
  Zap,
  Trophy,
  Medal,
  Crown,
};

const getTierColor = (tier: string) => {
  if (tier?.startsWith('HT')) {
    const num = parseInt(tier.replace('HT', ''));
    if (num === 1) return { bg: 'from-[#10b981] to-[#059669]', border: 'border-[#10b981]/25', text: 'text-white' };
    if (num === 2) return { bg: 'from-[#8b5cf6] to-[#7c3aed]', border: 'border-[#8b5cf6]/25', text: 'text-white' };
    if (num === 3) return { bg: 'from-[#ff9f43] to-[#ff8c00]', border: 'border-[#ff9f43]/25', text: 'text-white' };
    return { bg: 'from-[#ff9f43] to-[#ff7700]', border: 'border-[#ff9f43]/25', text: 'text-white' };
  }
  return { bg: 'from-white/[0.06] to-white/[0.03]', border: 'border-white/[0.08]', text: 'text-white/60' };
};

const getAchievementIcon = (iconName: string): LucideIcon => {
  return achievementIcons[iconName] || Trophy;
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-backdropIn" onClick={onClose}>
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin bg-gradient-to-b from-[#111111] to-[#0c0c0c] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.05] sticky top-0 bg-gradient-to-b from-[#111111] to-[#111111]/95 backdrop-blur z-10">
          <h2 className="text-sm sm:text-base font-bold text-white/80">Player Profile</h2>
          <button
            onClick={onClose}
            className="p-2 sm:p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors text-white/30 hover:text-white/60 active:bg-white/[0.1]"
          >
            <X size={20} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-4 sm:p-6">
          {/* Player Info */}
          <div className="flex items-start gap-3 sm:gap-5 mb-4 sm:mb-6">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-2xl opacity-15 blur-lg" />
              <img
                src={`https://render.crafty.gg/3d/bust/${player.username}`}
                alt={player.username}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-white/[0.08] bg-[#1a1a1a]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Player';
                }}
              />
              {/* Rank badge */}
              <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-lg flex items-center justify-center shadow-lg shadow-[#ff9f43]/30">
                <span className="text-[10px] sm:text-xs font-black text-black">#{rank}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-2xl font-black text-white truncate">{player.username}</h1>
                <button
                  onClick={() => handleCopy(player.username, 'Username')}
                  className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-all text-white/25 hover:text-[#ff9f43] shrink-0 active:bg-white/[0.1]"
                >
                  <Copy size={14} />
                </button>
              </div>

              {/* UID */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg">
                  <Hash size={10} className="sm:w-[11px] sm:h-[11px] text-white/30" />
                  <span className="text-[10px] sm:text-xs font-mono text-white/40">{player.uid}</span>
                </div>
                <button
                  onClick={() => handleCopy(player.uid, 'UID')}
                  className="p-1 hover:bg-white/[0.06] rounded transition-all text-white/20 hover:text-[#ff9f43] active:bg-white/[0.1]"
                >
                  <Copy size={11} className="sm:w-[12px] sm:h-[12px]" />
                </button>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <User size={11} className="sm:w-[12px] sm:h-[12px] text-[#ff9f43]/60" />
                  <span className="text-white/40 text-[11px] sm:text-xs">{player.rank}</span>
                </div>
                <span className="text-white/10 hidden sm:inline">|</span>
                <span className="text-[#ff9f43] font-bold text-[11px] sm:text-xs">{player.points} pts</span>
                <span className="text-white/10 hidden sm:inline">|</span>
                <div className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${player.region === 'NA'
                    ? 'bg-[#ef4444]/10 text-[#ef4444]/70'
                    : 'bg-[#10b981]/10 text-[#10b981]/70'
                  }`}>
                  {player.region}
                </div>
              </div>
            </div>
          </div>

          {/* Copy UID button */}
          <button
            onClick={() => handleCopy(player.uid, 'UID')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 sm:mb-6 bg-gradient-to-r from-[#ff9f43]/10 to-[#ff8c00]/10 border border-[#ff9f43]/15 rounded-xl text-[#ff9f43] text-sm font-semibold hover:from-[#ff9f43]/15 hover:to-[#ff8c00]/15 active:from-[#ff9f43]/20 active:to-[#ff8c00]/20 transition-all duration-300"
          >
            <Copy size={14} />
            Copy UID
          </button>

            {/* Gamemodes & Tiers */}
          <div>
            <h3 className="text-[11px] sm:text-xs font-bold text-white/30 uppercase tracking-widest mb-2 sm:mb-3">Gamemodes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(player.tiers || []).map((playerTier, index) => {
                const gamemodeCode = playerTier.gamemode?.code ?? 'unknown';
                const tierCode = playerTier.tier_definition?.code ?? 'N/A';
                const Icon = gamemodeIcons[gamemodeCode] || Swords;
                const colors = getTierColor(tierCode);
                return (
                  <div
                    key={index}
                    className="tier-card group relative flex flex-col items-center gap-1 p-2 sm:p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] active:bg-white/[0.06] transition-all duration-300 cursor-default"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Icon size={14} className="sm:w-4 sm:h-4 text-white/30 group-hover:text-white/60 transition-colors duration-300 mb-0.5" strokeWidth={2} />
                    <span className="gamemode-label text-[10px] sm:text-[11px] font-semibold text-white/50 group-hover:text-white/70 transition-all duration-300">
                      {gamemodeLabels[gamemodeCode] || gamemodeCode}
                    </span>
                    <div className={`tier-label px-2 py-0.5 sm:px-2.5 rounded-md bg-gradient-to-r ${colors.bg} ${colors.border} border ${colors.text} text-[9px] sm:text-[10px] font-black tracking-wide`}>
                      {tierCode}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          {(player.achievements || []).length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-[11px] sm:text-xs font-bold text-white/30 uppercase tracking-widest mb-2 sm:mb-3">Achievements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(player.achievements || []).map((playerAchievement: PlayerAchievement, index: number) => {
                  const achievement = playerAchievement.achievement;
                  if (!achievement) return null;
                  const Icon = getAchievementIcon(achievement.icon_name || 'Trophy');
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg active:bg-white/[0.04]"
                      style={{ borderColor: `${achievement.color_hex}20` }}
                    >
                      <Icon size={13} className="sm:w-[14px] sm:h-[14px]" style={{ color: achievement.color_hex }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-semibold text-white/70 truncate">{achievement.name}</div>
                        <div className="text-[8px] text-white/40">+{achievement.points_bonus} pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-white/20">Last updated 2 hours ago</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-xs ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}>
          <div className="flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/60">
            <CheckCircle size={16} className="text-[#10b981] flex-shrink-0" />
            <span className="text-sm font-medium text-white/80">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
