import { Trophy, Search } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navigation({ searchQuery, setSearchQuery }: NavigationProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/5 animate-fadeInDown">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <img 
                src="/src/assets/images/logo.png" 
                alt="FastTier" 
                className="h-10 object-contain"
              />
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              <button className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-[#ff9f43] font-medium text-sm transition-all bg-[#ff9f43]/10">
                <Trophy size={16} />
                <span>Rankings</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-gradient-to-r from-transparent via-[#ff9f43] to-transparent rounded-full" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className={`relative transition-all duration-300 ease-out ${isSearchFocused ? 'w-80' : 'w-60'}`}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" size={16} />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-12 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-1 focus:ring-[#ff9f43]/20 focus:bg-white/[0.06] transition-all duration-300"
              />
              {!isSearchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded text-[10px] text-white/25 font-medium">Cmd</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded text-[10px] text-white/25 font-medium">K</kbd>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
