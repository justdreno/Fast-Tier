import { X, Copy, Share2, TrendingUp } from 'lucide-react';
import TierBadge from './TierBadge';

interface Tier {
  gamemode: string;
  tier: string;
}

interface Player {
  id: string;
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

export default function PlayerProfile({ player, rank, onClose }: PlayerProfileProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(player.username);
  };

  const getTierCount = (prefix: string) => {
    return player.tiers.filter(t => t.tier.startsWith(prefix)).length;
  };

  const htCount = getTierCount('HT');
  const ltCount = getTierCount('LT');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur">
          <h2 className="text-2xl font-bold text-white">Player Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <img
                  src={`https://render.crafty.gg/3d/bust/${player.username}`}
                  alt={player.username}
                  className="w-32 h-32 rounded-lg border border-white/10 bg-[#1a1a1a] shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Player';
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-black text-white">{player.username}</h1>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-[#ff9f43]"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/50">Rank:</span>
                      <span className="text-sm font-semibold text-white">{player.rank}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/50">Points:</span>
                      <span className="text-sm font-semibold text-[#ff9f43]">{player.points}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/50">Region:</span>
                      <div className={`px-3 py-1 rounded text-xs font-bold ${
                        player.region === 'NA'
                          ? 'bg-[#ef4444]/20 text-[#ef4444]'
                          : 'bg-[#10b981]/20 text-[#10b981]'
                      }`}>
                        {player.region}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-4xl font-black bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] bg-clip-text text-transparent mb-2">
                  #{rank}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] rounded-lg text-black font-bold text-sm hover:shadow-lg hover:shadow-[#ff9f43]/30 transition-all">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-[#1a1a1a] rounded-lg border border-white/5">
            <div>
              <div className="text-xs text-white/50 font-semibold uppercase tracking-wide mb-1">High Tier</div>
              <div className="text-3xl font-black text-[#10b981]">{htCount}</div>
            </div>
            <div>
              <div className="text-xs text-white/50 font-semibold uppercase tracking-wide mb-1">Low Tier</div>
              <div className="text-3xl font-black text-white/60">{ltCount}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#ff9f43]" />
              Tier Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {player.tiers.map((tier, index) => (
                <TierBadge key={index} gamemode={tier.gamemode} tier={tier.tier} />
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-[#ff9f43]/10 to-[#ff8c00]/10 border border-[#ff9f43]/20 rounded-lg">
            <div className="text-xs text-white/60 mb-2">Last Updated</div>
            <div className="text-sm text-white">2 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
