import { Menu, X, Search, Info, Users, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const discordLink = import.meta.env.VITE_DISCORD_SERVER_LINK || 'https://discord.gg/FastTiers';

export default function Navigation({ searchQuery = '', setSearchQuery }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1200px]" style={{ transform: 'translateX(-50%)' }}>
        <nav className="bg-gradient-to-r from-[#09090d] to-[#0f0509] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 relative overflow-visible backdrop-blur-md" style={{ willChange: 'transform' }}>
          {/* Animated orange glow from right corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9f43]/20 blur-3xl rounded-full pointer-events-none animate-pulse-slow" />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer pointer-events-none" />

          <div className="flex items-center justify-between h-14 px-3 sm:px-4">
            {/* Logo with hover animation */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center group"
              >
                <img
                  src="/fast-tier.png"
                  alt="FastTiers"
                  className="h-10 sm:h-11 w-auto object-contain transition-all duration-300 ease-bounce group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(255,159,67,0.5)]"
                />
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="relative flex items-center gap-2 sm:gap-3">
              {/* Orange glow on far-right edge */}
              <div
                className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 w-28 h-16 rounded-full bg-[#ff9f43]/25 blur-2xl -z-10 animate-glow-pulse"
              />

              {/* Search Bar - Fixed width, no transition */}
              <div className="relative w-40 sm:w-48">
                <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-[#ff9f43]' : 'text-white/30'}`} size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/50 focus:ring-2 focus:ring-[#ff9f43]/20 focus:bg-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]"
                />
              </div>

              {/* Discord Button with hover animation */}
              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.12] hover:scale-110 hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] transition-all duration-300 ease-bounce"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 hover:rotate-12">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>

              {/* Info Button */}
              <Link
                to="/info"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.04] text-white/60 hover:text-[#ff9f43] hover:bg-white/[0.12] hover:scale-110 transition-all duration-300 ease-bounce"
                title="Information"
              >
                <Info size={18} className="transition-transform duration-300" />
              </Link>

              {/* Partners Button */}
              <Link
                to="/partners"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.04] text-white/60 hover:text-[#ff9f43] hover:bg-white/[0.12] hover:scale-110 transition-all duration-300 ease-bounce"
                title="Partners"
              >
                <Users size={18} className="transition-transform duration-300" />
              </Link>

              {/* Get Tested Button with hover animation */}
              <button
                onClick={() => setShowDiscordModal(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#ff9f43] hover:bg-[#ff9f43]/90 text-black font-semibold text-sm rounded-lg transition-all duration-300 ease-bounce hover:scale-105 hover:shadow-[0_0_20px_rgba(255,159,67,0.5)] hover:-translate-y-0.5 active:scale-95"
              >
                Get Tested
              </button>

              {/* Mobile Menu Button with animation */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-300 ease-bounce hover:scale-110 active:scale-95"
              >
                <div className="transition-transform duration-300">
                  {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu with slide animation */}
          <div
            className={`md:hidden border-t border-white/[0.06] overflow-hidden transition-all duration-400 ease-smooth ${isMobileMenuOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 animate-fade-in-up">
              <button
                onClick={() => setShowDiscordModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff9f43] hover:bg-[#ff9f43]/90 text-black font-semibold text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,159,67,0.5)] active:scale-95"
              >
                Get Tested
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Discord Modal - Completely separate from nav */}
      {showDiscordModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowDiscordModal(false)}
        >
          <div 
            className="bg-gradient-to-b from-[#141414] to-[#0f0f0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/60 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDiscordModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#5865F2]/20 rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-black text-white text-center mb-4">
              Join Our Discord
            </h2>
            <p className="text-white/60 text-center mb-6">
              To get tested and receive your tier ranking, please join our Discord server. Our testers will help you get started!
            </p>

            {/* Discord Button */}
            <a
              href={discordLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowDiscordModal(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#5865F2]/30"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord Server
            </a>

            {/* Cancel Button */}
            <button
              onClick={() => setShowDiscordModal(false)}
              className="w-full mt-3 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white font-semibold rounded-xl transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
