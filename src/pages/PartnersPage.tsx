import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Users, ChevronRight, Server, Signal, Globe, Trophy, Info } from 'lucide-react';
import Navigation from '../components/Navigation';
import { getPartners, type Partner } from '../lib/supabase';

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  motd?: string;
  icon?: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [serverStatuses, setServerStatuses] = useState<Record<string, ServerStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const data = await getPartners();
        setPartners(data);
        
        // Fetch server status for each partner
        data.forEach(partner => {
          fetchServerStatus(partner.server_ip);
        });
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  async function fetchServerStatus(serverIp: string) {
    try {
      const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}`);
      const data = await response.json();
      
      setServerStatuses(prev => ({
        ...prev,
        [serverIp]: {
          online: data.online,
          players: data.players,
          version: data.version,
          motd: data.motd?.clean?.[0],
          icon: data.icon
        }
      }));
    } catch (error) {
      console.error(`Error fetching status for ${serverIp}:`, error);
      setServerStatuses(prev => ({
        ...prev,
        [serverIp]: { online: false }
      }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Banner Header */}
        <div
          className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: 'url(/banner.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-[#ff9f43]/5 blur-3xl" />
        </div>

        <Navigation />

        <main className="w-[95%] max-w-[1200px] mx-auto mt-12 sm:-mt-28 pb-6 sm:pb-10 relative z-10">
          <div className="px-3 sm:px-4 mb-4 sm:mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
              Partners
            </h1>
            <p className="text-xs sm:text-sm text-white/30">
              Minecraft servers partnered with FastTiers
            </p>
          </div>

          {/* Loading State */}
          <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20">
            <div className="border-b border-white/[0.06] bg-[#141414]/50 px-3 sm:px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Trophy size={18} className="text-[#ff9f43]" />
                <span className="font-bold text-sm text-white">Partner Servers</span>
              </div>
            </div>
            <div className="p-8 sm:p-12 text-center">
              <div className="text-white/30 text-sm sm:text-base">Loading partners...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Banner Header */}
      <div
        className="hidden sm:block w-full h-64 sm:h-80 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/banner.png)' }}
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
        {partners.length === 0 ? (
          <div className="bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] p-12 text-center">
            <Users size={48} className="mx-auto mb-4 text-white/20" />
            <div className="text-white/40 text-sm">No partners yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {partners.map((partner) => {
              const status = serverStatuses[partner.server_ip];
              const isOnline = status?.online;
              const playerCount = status?.players?.online || 0;
              const maxPlayers = status?.players?.max || 0;
              
              const serverIcon = partner.icon_url || status?.icon || null;
              const bannerImage = partner.banner_url || '/banner.png';

              return (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-b from-[#0f0f0f]/80 to-[#0f0f0f]/40 rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl shadow-black/20 hover:border-[#ff9f43]/30 hover:shadow-[#ff9f43]/10 transition-all duration-300"
                >
                  {/* Partner Banner */}
                  <div className="relative h-36 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ 
                        backgroundImage: `url(${bannerImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
                    
                    {/* Server Status Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                        isOnline 
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                          : 'bg-red-500/20 border-red-500/30 text-red-400'
                      }`}>
                        <Signal size={10} className={isOnline ? 'animate-pulse' : ''} />
                        <span className="text-[10px] font-bold uppercase">
                          {isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Server Icon - Outside banner to prevent cutoff */}
                  <div className="relative px-4 -mt-8 mb-2">
                    <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border-2 border-white/[0.1] overflow-hidden shadow-lg group-hover:border-[#ff9f43]/50 transition-colors duration-300 flex items-center justify-center">
                      {serverIcon ? (
                        <img
                          src={serverIcon}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Server size={24} className="text-white/30" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-4 pb-5 px-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-[#ff9f43] transition-colors duration-300">
                          {partner.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Server size={12} className="text-white/30" />
                          <span className="text-xs text-white/40 font-mono">{partner.server_ip}</span>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-white/20 group-hover:text-[#ff9f43] transition-colors duration-300 mt-1" />
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-3">
                      {partner.description}
                    </p>

                    {/* Server Stats */}
                    <div className="flex items-center gap-4 mb-3 p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className={isOnline ? 'text-[#ff9f43]' : 'text-white/30'} />
                        <span className={`text-sm font-bold ${isOnline ? 'text-white' : 'text-white/40'}`}>
                          {isOnline ? `${playerCount.toLocaleString()}/${maxPlayers.toLocaleString()}` : 'N/A'}
                        </span>
                      </div>
                      {isOnline && status?.version && (
                        <>
                          <div className="w-px h-3 bg-white/10" />
                          <div className="flex items-center gap-1.5">
                            <Globe size={12} className="text-white/30" />
                            <span className="text-xs text-white/50">{status.version}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {partner.tags && partner.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
              );
            })}
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
