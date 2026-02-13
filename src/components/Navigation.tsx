import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const discordLink = import.meta.env.VITE_DISCORD_SERVER_LINK || 'https://discord.gg/fasttier';

export default function Navigation({ searchQuery = '', setSearchQuery }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <nav className="bg-gradient-to-r from-[#09090d] to-[#0f0509] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden">
        {/* Orange glow from right corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9f43]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-white tracking-tight">
                Fast<span className="text-[#ff9f43]">Tier</span>
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="relative flex items-center gap-2 sm:gap-3">
            {/* Glow border behind right items (like image) */}
            <div
              className="
      pointer-events-none absolute -inset-2 rounded-2xl
      border border-white/[0.08]
      bg-white/[0.02]
      shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_24px_rgba(255,159,67,0.18)]
      "
            />
            {/* Stronger orange glow on the far-right edge */}
            <div
              className="
      pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2
      w-28 h-16 rounded-full
      bg-[#ff9f43]/25 blur-2xl
    "
            />

            {/* Content sits above the glow */}
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {/* Search Bar */}
              <div className={`relative transition-all duration-300 ease-out ${isSearchFocused ? 'w-48 sm:w-56' : 'w-36 sm:w-44'}`}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-1 focus:ring-[#ff9f43]/20 focus:bg-white/[0.06] transition-all duration-300"
                />
              </div>

              {/* Discord Button */}
              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                {/* svg ... */}
              </a>

              {/* Apply Button */}
              <Link to="/apply" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#ff9f43] hover:bg-[#ff9f43]/90 text-black font-semibold text-sm rounded-lg transition-all duration-200">
                Apply
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] p-4">
            <Link to="/apply" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff9f43] hover:bg-[#ff9f43]/90 text-black font-semibold text-sm rounded-lg transition-all duration-200">
              Apply Now
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
