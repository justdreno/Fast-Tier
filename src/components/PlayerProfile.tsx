import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Copy, Hash, User, CheckCircle, Trophy, Globe, Activity,
  Heart, Flame, Sword, Axe, Hammer, Users, Swords
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import type { Player, PlayerTier } from '../lib/supabase';

// --- Interfaces ---
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

// --- Configuration & Helpers ---
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
  uhc: Activity,
  pot: Flame,
  nethop: Flame,
  smp: Users,
  sword: Sword,
  axe: Axe,
  mace: Hammer,
  ltms: Swords,
};

// Enhanced tier styling logic
const getTierStyle = (tierCode: string) => {
  const t = tierCode?.toUpperCase() || '';

  if (t === 'HT1' || t === 'LT1') return {
    gradient: 'from-amber-400/20 to-orange-600/20',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]',
    badge: 'bg-gradient-to-r from-amber-500 to-orange-600 text-black'
  };

  if (t === 'HT2' || t === 'LT2') return {
    gradient: 'from-purple-400/20 to-indigo-600/20',
    border: 'border-purple-500/50',
    text: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
  };

  if (t === 'HT3' || t === 'LT3') return {
    gradient: 'from-emerald-400/20 to-teal-600/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black'
  };

  if (t === 'HT4' || t === 'LT4') return {
    gradient: 'from-blue-400/20 to-cyan-600/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]',
    badge: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
  };

  if (t === 'HT5' || t === 'LT5') return {
    gradient: 'from-rose-400/20 to-pink-600/20',
    border: 'border-rose-500/50',
    text: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
    glow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]',
    badge: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
  };

  // Default / Low Tier
  return {
    gradient: 'from-zinc-800/50 to-zinc-900/50',
    border: 'border-white/[0.08]',
    text: 'text-zinc-400',
    iconBg: 'bg-zinc-800',
    glow: 'hover:shadow-lg',
    badge: 'bg-zinc-700 text-zinc-300'
  };
};

export default function PlayerProfile({ player, rank, onClose }: PlayerProfileProps) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, exiting: false });
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // Handle close with animation
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  }, [isClosing, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  const showToast = (message: string) => {
    setToast({ message, visible: true, exiting: false });
  };

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, exiting: true }));
      setTimeout(() => setToast({ message: '', visible: false, exiting: false }), 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [toast.visible, toast.message]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`);
  };

  // Get tier display name from tier_definition
  const getTierCode = (tier: PlayerTier): string => {
    return tier.tier_definition?.code || 'N/A';
  };

  // Get gamemode code
  const getGamemodeCode = (tier: PlayerTier): string => {
    return tier.gamemode?.code || 'unknown';
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999]"
      onMouseDown={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-black/80 transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
        }`}
      />

      {/* Modal Container */}
      <div className="absolute inset-0 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div
          className={`w-full max-w-2xl bg-[#0f0f0f] border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden relative transition-all duration-300 ease-out my-auto ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#ff9f43]/10 via-[#ff9f43]/5 to-transparent pointer-events-none" />

          {/* Header Actions */}
          <div className="relative flex items-center justify-end px-4 sm:px-6 py-3 sm:py-4 z-10">
            <button
              onClick={handleClose}
              className="group p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-200 hover:scale-110"
            >
              <X size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            {/* Player Header Section */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
              {/* Avatar Column */}
              <div className="flex-shrink-0 relative group mx-auto sm:mx-0">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#ff9f43] to-[#ff6b00] rounded-[20px] opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#121214] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <img
                    src={`https://render.crafty.gg/3d/bust/${player.username}`}
                    alt={player.username}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?'; }}
                  />
                </div>
                {/* Global Rank Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-[#18181b] border border-[#ff9f43]/30 rounded-full shadow-lg">
                  <Trophy size={10} className="text-[#ff9f43]" fill="currentColor" />
                  <span className="text-xs font-bold text-white">#{rank}</span>
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-1 text-center sm:text-left pt-0 sm:pt-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                      {player.username}
                      <button
                        onClick={() => handleCopy(player.username, 'Username')}
                        className="text-zinc-600 hover:text-[#ff9f43] transition-colors p-1 hover:bg-white/[0.05] rounded-lg"
                      >
                        <Copy size={16} />
                      </button>
                    </h1>

                    {/* Stats Pill */}
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg flex-wrap justify-center sm:justify-start">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <User size={13} />
                        <span className="text-xs font-medium uppercase tracking-wider">{player.rank}</span>
                      </div>
                      <div className="w-px h-3 bg-white/10 hidden sm:block" />
                      <div className="flex items-center gap-1.5 text-[#ff9f43]">
                        <Trophy size={13} className="opacity-60" />
                        <span className="text-xs font-bold">{player.points?.toLocaleString() || 0} pts</span>
                      </div>
                      <div className="w-px h-3 bg-white/10 hidden sm:block" />
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Globe size={13} />
                        <span className="text-xs font-medium">{player.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* UID Box */}
                  <div
                    onClick={() => handleCopy(player.uid, 'UID')}
                    className="group cursor-pointer flex flex-col items-center sm:items-end gap-1 mt-2 sm:mt-0"
                  >
                    <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest group-hover:text-[#ff9f43] transition-colors">
                      Unique ID
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-[#ff9f43]/30 rounded-md transition-all">
                      <Hash size={12} className="text-zinc-500" />
                      <span className="font-mono text-sm text-zinc-300 group-hover:text-white transition-colors">{player.uid}</span>
                      <Copy size={12} className="text-zinc-600 ml-1 group-hover:text-[#ff9f43]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4 sm:my-6" />

            {/* Gamemode Tiers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                  <Swords size={14} className="text-[#ff9f43]" />
                  Performance Tiers
                </h3>
                <span className="text-[10px] bg-white/[0.05] text-white/40 px-2 py-1 rounded border border-white/[0.05]">
                  {(player.tiers || []).length} Modes
                </span>
              </div>

              {(player.tiers || []).length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Swords size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No tier data available</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {(player.tiers || []).map((tierData, index) => {
                    const gamemodeCode = getGamemodeCode(tierData);
                    const tierCode = getTierCode(tierData);
                    const Icon = gamemodeIcons[gamemodeCode] || Swords;
                    const style = getTierStyle(tierCode);

                    return (
                      <div
                        key={index}
                        className={`relative group p-3 rounded-xl border ${style.border} bg-gradient-to-br ${style.gradient} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 ${style.glow} cursor-default`}
                        style={{ 
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                          transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 50}ms`
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
                            <Icon size={16} className={style.text} />
                          </div>
                          <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${style.badge}`}>
                            {tierCode}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-medium text-white/60 uppercase tracking-wide group-hover:text-white/90 transition-colors">
                            {gamemodeLabels[gamemodeCode] || gamemodeCode}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 flex items-center justify-between text-[10px] text-zinc-600">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Data
              </span>
              <span>Updated just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-300 ${toast.visible
            ? toast.exiting
              ? 'opacity-0 translate-y-2'
              : 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl shadow-black/50">
          <div className="p-1 rounded-full bg-emerald-500/10">
            <CheckCircle size={14} className="text-emerald-500" />
          </div>
          <span className="text-sm font-medium text-zinc-200 pr-1">{toast.message}</span>
        </div>
      </div>
    </div>
  );

  // Render modal at document body level using portal
  return createPortal(modalContent, document.body);
}
