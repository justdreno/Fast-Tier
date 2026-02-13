import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, User, Mail, Globe, Gamepad2 } from 'lucide-react';

interface ApplicationForm {
  username: string;
  email: string;
  region: string;
  discord_username: string;
  gamemode: string;
}

interface ToastState {
  message: string;
  visible: boolean;
  type: 'success' | 'error';
}

const gamemodes = [
  { code: 'vanilla', name: 'Vanilla' },
  { code: 'uhc', name: 'UHC' },
  { code: 'pot', name: 'Pot' },
  { code: 'nethop', name: 'NethOP' },
  { code: 'smp', name: 'SMP' },
  { code: 'sword', name: 'Sword' },
  { code: 'axe', name: 'Axe' },
  { code: 'mace', name: 'Mace' },
];

export default function ApplyPage() {
  const [form, setForm] = useState<ApplicationForm>({
    username: '',
    email: '',
    region: '',
    discord_username: '',
    gamemode: ''
  });

  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: '', visible: false, type }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Applications are currently disabled. Please contact us on Discord.', 'error');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-12">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#141414] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 px-4 sm:px-6 py-3 flex items-center justify-between">
            <Link to="/" className="text-xl font-black text-white tracking-tight">
              Fast<span className="text-[#ff9f43]">Tier</span>
            </Link>
            <Link 
              to="/" 
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              ← Back to Rankings
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24">
      {/* Orange glow from corner */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#ff9f43]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Apply to <span className="text-[#ff9f43]">FastTier</span>
          </h1>
          <p className="text-white/40 text-sm sm:text-base">
            Join our competitive Minecraft PvP ranking system
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-[#141414] to-[#0f0f0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
          {/* Subtle corner glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9f43]/10 blur-3xl rounded-full pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            {/* Minecraft Username */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                <User size={14} className="text-[#ff9f43]" />
                Minecraft Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Enter your Minecraft username"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all"
              />
            </div>

            {/* Discord Username */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                <User size={14} className="text-[#ff9f43]" />
                Discord Username
              </label>
              <input
                type="text"
                name="discord_username"
                value={form.discord_username}
                onChange={handleChange}
                required
                placeholder="username#0000 or @username"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all"
              />
            </div>

            {/* Gamemode */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                <Gamepad2 size={14} className="text-[#ff9f43]" />
                Gamemode to Test
              </label>
              <select
                name="gamemode"
                value={form.gamemode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                <option value="" className="bg-[#1a1a1a]">Select Gamemode</option>
                {gamemodes.map((g) => (
                  <option key={g.code} value={g.code} className="bg-[#1a1a1a]">{g.name}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                <Mail size={14} className="text-[#ff9f43]" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all"
              />
            </div>

            {/* Region */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                <Globe size={14} className="text-[#ff9f43]" />
                Region
              </label>
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                <option value="" className="bg-[#1a1a1a]">Select Region</option>
                <option value="NA" className="bg-[#1a1a1a]">North America</option>
                <option value="EU" className="bg-[#1a1a1a]">Europe</option>
                <option value="ASIA" className="bg-[#1a1a1a]">Asia</option>
                <option value="LKA" className="bg-[#1a1a1a]">Sri Lanka</option>
                <option value="OTHER" className="bg-[#1a1a1a]">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] text-black font-bold rounded-xl hover:from-[#ff9f43]/90 hover:to-[#ff8c00]/90 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-[#ff9f43]/20"
            >
              <Send size={18} />
              Submit Application
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-[#ff9f43]/10 rounded-xl flex items-center justify-center">
              <Globe size={20} className="text-[#ff9f43]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Global</h3>
            <p className="text-xs text-white/40">Multi-region support</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-[#ff9f43]/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-[#ff9f43]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Verified</h3>
            <p className="text-xs text-white/40">Skill-based tiers</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-[#ff9f43]/10 rounded-xl flex items-center justify-center">
              <User size={20} className="text-[#ff9f43]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Community</h3>
            <p className="text-xs text-white/40">Discord integration</p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toastSlideIn">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl shadow-black/60 ${
            toast.type === 'success'
              ? 'bg-[#1a1a1a] border border-[#10b981]/30'
              : 'bg-[#1a1a1a] border border-[#ef4444]/30'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle size={18} className="text-[#10b981]" />
            ) : (
              <AlertCircle size={18} className="text-[#ef4444]" />
            )}
            <span className="text-sm font-medium text-white/80">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
