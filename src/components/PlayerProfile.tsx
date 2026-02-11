import { useState, useEffect } from 'react';
import { LucideIcon, X, Copy, Share2, Hash, User, CheckCircle } from 'lucide-react';
import { Heart, Flame, Sword, Axe, Hammer, Users, Swords } from 'lucide-react';

interface Tier {
  gamemode: string;
  tier: string;
}

interface Player {
  id: string;
  uid: string;
  username: string;
  rank: string;
  points: number;
  region: string;
  tiers: Tier[];
}

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

const getTierColor = (tier: string) => {
  if (tier.startsWith('HT')) {
    const num = parseInt(tier.replace('HT', ''));
    if (num === 1) return { bg: 'from-[#10b981] to-[#059669]', border: 'border-[#10b981]/25', text: 'text-white' };
    if (num === 2) return { bg: 'from-[#8b5cf6] to-[#7c3aed]', border: 'border-[#8b5cf6]/25', text: 'text-white' };
    if (num === 3) return { bg: 'from-[#ff9f43] to-[#ff8c00]', border: 'border-[#ff9f43]/25', text: 'text-white' };
    return { bg: 'from-[#ff9f43] to-[#ff7700]', border: 'border-[#ff9f43]/25', text: 'text-white' };
  }
  return { bg: 'from-white/[0.06] to-white/[0.03]', border: 'border-white/[0.08]', text: 'text-white/60' };
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdropIn" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-gradient-to-b from-[#111111] to-[#0c0c0c] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-base font-bold text-white/80">Player Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors text-white/30 hover:text-white/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Player Info */}
          <div className="flex items-start gap-5 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-2xl opacity-15 blur-lg" />
              <img
                src={`https://render.crafty.gg/3d/bust/${player.username}`}
                alt={player.username}
                className="relative w-24 h-24 rounded-2xl border border-white/[0.08] bg-[#1a1a1a]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Player';
                }}
              />
              {/* Rank badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-lg flex items-center justify-center shadow-lg shadow-[#ff9f43]/30">
                <span className="text-xs font-black text-black">#{rank}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white truncate">{player.username}</h1>
                <button
                  onClick={() => handleCopy(player.username, 'Username')}
                  className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-all text-white/25 hover:text-[#ff9f43] shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>

              {/* UID */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg">
                  <Hash size={11} className="text-white/30" />
                  <span className="text-xs font-mono text-white/40">{player.uid}</span>
                </div>
                <button
                  onClick={() => handleCopy(player.uid, 'UID')}
                  className="p-1 hover:bg-white/[0.06] rounded transition-all text-white/20 hover:text-[#ff9f43]"
                >
                  <Copy size={12} />
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-[#ff9f43]/60" />
                  <span className="text-white/40">{player.rank}</span>
                </div>
                <span className="text-white/10">|</span>
                <span className="text-[#ff9f43] font-bold">{player.points} pts</span>
                <span className="text-white/10">|</span>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${player.region === 'NA'
                    ? 'bg-[#ef4444]/10 text-[#ef4444]/70'
                    : 'bg-[#10b981]/10 text-[#10b981]/70'
                  }`}>
                  {player.region}
                </div>
              </div>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={() => handleCopy(`${player.username} | ${player.rank} | #${rank}`, 'Profile info')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-6 bg-gradient-to-r from-[#ff9f43]/10 to-[#ff8c00]/10 border border-[#ff9f43]/15 rounded-xl text-[#ff9f43] text-sm font-semibold hover:from-[#ff9f43]/15 hover:to-[#ff8c00]/15 transition-all duration-300"
          >
            <Share2 size={14} />
            Share Profile
          </button>

          {/* Tier Achievements - Hover to reveal */}
          <div>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Gamemodes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {player.tiers.map((tierData, index) => {
                const Icon = gamemodeIcons[tierData.gamemode] || Swords;
                const colors = getTierColor(tierData.tier);
                return (
                  <div
                    key={index}
                    className="tier-card group relative flex flex-col items-center gap-1 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-default"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Icon size={16} className="text-white/30 group-hover:text-white/60 transition-colors duration-300 mb-0.5" strokeWidth={2} />
                    <span className="gamemode-label text-[11px] font-semibold text-white/50 group-hover:text-white/70 transition-all duration-300">
                      {gamemodeLabels[tierData.gamemode] || tierData.gamemode}
                    </span>
                    <div className={`tier-label px-2.5 py-0.5 rounded-md bg-gradient-to-r ${colors.bg} ${colors.border} border ${colors.text} text-[10px] font-black tracking-wide`}>
                      {tierData.tier}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[11px] text-white/20">Last updated 2 hours ago</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}>
          <div className="flex items-center gap-2.5 px-5 py-3 bg-[#1a1a1a] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/60">
            <CheckCircle size={16} className="text-[#10b981]" />
            <span className="text-sm font-medium text-white/80">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
