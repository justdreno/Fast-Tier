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
      <nav className="bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden">
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
          <div className="flex items-center gap-2 sm:gap-3">
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
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
