import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Users, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import { getPartners, type Partner } from '../lib/supabase';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Banner Header - No animation */}
      <div
        className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative opacity-100"
        style={{
          backgroundImage: 'url(/banner.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-[#ff9f43]/5 blur-3xl" />
      </div>

      <Navigation />

      <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
        {/* Title Section */}
        <div className="px-3 sm:px-4 mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
            Partners
          </h1>
          <p className="text-xs sm:text-sm text-white/30">
            Minecraft servers partnered with FastTiers
          </p>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] p-12 text-center">
            <div className="text-white/30 text-sm">Loading partners...</div>
          </div>
        ) : partners.length === 0 ? (
          <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] p-12 text-center">
            <Users size={48} className="mx-auto mb-4 text-white/20" />
            <div className="text-white/40 text-sm">No partners yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20 hover:border-[#ff9f43]/30 hover:shadow-[#ff9f43]/10 transition-all duration-300"
              >
                {/* Partner Banner */}
                <div className="relative h-32 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${partner.banner_url || '/banner.png'})` 
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                  
                  {/* Server Icon */}
                  <div className="absolute -bottom-6 left-4">
                    <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border-2 border-white/[0.1] overflow-hidden shadow-lg group-hover:border-[#ff9f43]/50 transition-colors duration-300">
                      <img
                        src={partner.icon_url || 'https://via.placeholder.com/64?text=?'}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8 pb-5 px-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-[#ff9f43] transition-colors duration-300">
                        {partner.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/40">{partner.server_ip}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-xs text-white/40">{partner.player_count || '0'} players</span>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-white/20 group-hover:text-[#ff9f43] transition-colors duration-300" />
                  </div>

                  <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                    {partner.description}
                  </p>

                  {/* Tags */}
                  {partner.tags && partner.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {partner.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-white/[0.05] border border-white/[0.08] rounded text-[10px] text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:scale-105 transition-all duration-300 text-sm font-medium"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Leaderboard
          </Link>
        </div>
      </main>
    </div>
  );
}
