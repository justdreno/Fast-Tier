import { Copy, Info, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function ServerInfo() {
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const serverIp = 'bananasmp.net';

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-lg hover:border-[#ff9f43]/30 transition-all group"
      >
        <Info size={18} className="text-white/60 group-hover:text-[#ff9f43] transition-colors" />
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Information</span>
      </button>

      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-white/10 rounded-lg group hover:border-[#ff9f43]/30 transition-all cursor-pointer" onClick={handleCopy}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded opacity-50 blur-sm group-hover:opacity-75 transition-opacity" />
              <div className="relative w-8 h-8 bg-gradient-to-br from-[#ff9f43] to-[#ff8c00] rounded flex items-center justify-center text-xs font-bold text-black">
                SMP
              </div>
            </div>
            <div>
              <div className="text-xs text-white/50 font-semibold tracking-wide uppercase">Server</div>
              <div className="text-sm font-bold text-white group-hover:text-[#ff9f43] transition-colors">
                {serverIp}
              </div>
            </div>
          </div>
          {copied ? (
            <div className="text-xs text-[#10b981] font-semibold ml-2">Copied!</div>
          ) : (
            <Copy size={16} className="text-white/40 group-hover:text-[#ff9f43] transition-colors ml-2" />
          )}
        </div>

        {showInfo && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f0f0f] border border-white/10 rounded-lg p-4 shadow-2xl z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Server Information</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-white/50 font-semibold mb-1">IP Address</div>
                <div className="flex items-center justify-between gap-2 p-2 bg-[#1a1a1a] rounded border border-white/5">
                  <code className="text-sm text-[#ff9f43] font-mono">{serverIp}</code>
                  <button
                    onClick={handleCopy}
                    className="text-white/40 hover:text-[#ff9f43] transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xs text-white/50 font-semibold mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                  <span className="text-sm text-white/80">Online</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-white/50 font-semibold mb-1">Players</div>
                <div className="text-sm text-white/80">145 / 200 Online</div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] rounded-lg text-sm font-bold text-black hover:shadow-lg hover:shadow-[#ff9f43]/30 transition-all">
                <ExternalLink size={14} />
                Visit Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
