import { Home, Trophy, Users, BookOpen, Search, Zap } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navigation({ searchQuery, setSearchQuery }: NavigationProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-lg border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded-lg blur opacity-75 animate-pulse" />
                <div className="relative bg-[#0a0a0a] px-3 py-2 rounded-lg">
                  <Zap className="text-[#ff9f43]" size={20} />
                </div>
              </div>
              <div>
                <div className="text-xl font-black bg-gradient-to-r from-white via-white to-[#ff9f43] bg-clip-text text-transparent">
                  FAST TIER
                </div>
                <div className="text-[10px] text-[#ff9f43] font-semibold tracking-wider">
                  MINECRAFT RANKINGS
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <button className="group flex items-center gap-2 text-white/50 hover:text-white transition-all">
                <Home size={18} className="group-hover:text-[#ff9f43] transition-colors" />
                <span className="text-sm font-medium">Home</span>
              </button>
              <button className="group flex items-center gap-2 text-[#ff9f43] font-medium">
                <Trophy size={18} />
                <span className="text-sm">Rankings</span>
                <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-gradient-to-r from-[#ff9f43] to-transparent" />
              </button>
              <button className="group flex items-center gap-2 text-white/50 hover:text-white transition-all">
                <Users size={18} className="group-hover:text-[#ff9f43] transition-colors" />
                <span className="text-sm font-medium">Discords</span>
              </button>
              <button className="group flex items-center gap-2 text-white/50 hover:text-white transition-all">
                <BookOpen size={18} className="group-hover:text-[#ff9f43] transition-colors" />
                <span className="text-sm font-medium">API Docs</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-60'}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-12 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#ff9f43]/50 focus:ring-2 focus:ring-[#ff9f43]/20 transition-all"
              />
              {!isSearchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] text-xs font-medium">
                  Cmd K
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
