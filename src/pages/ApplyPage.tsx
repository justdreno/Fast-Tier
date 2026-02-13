import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, User, Mail, Globe, Gamepad2, Loader2 } from 'lucide-react';
import { createApplication, getApplicationByDiscordId, getGamemodeByCode, supabase } from '../lib/supabase';

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

// Validation helpers
const validateMinecraftUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{3,16}$/;
  return regex.test(username);
};

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function ApplyPage() {
  const [form, setForm] = useState<ApplicationForm>(({
    username: '',
    email: '',
    region: '',
    discord_username: '',
    gamemode: ''
  }));

  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: '', visible: false, type }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Supabase is configured
    if (!supabase) {
      showToast('Applications are currently unavailable. Please try again later or use Discord.', 'error');
      return;
    }

    // Validate username
    if (!validateMinecraftUsername(form.username)) {
      showToast('Minecraft username must be 3-16 characters, alphanumeric and underscores only.', 'error');
      return;
    }

    // Validate email
    if (!validateEmail(form.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user already has an active application
      // Note: In a real app, you'd get the discord_user_id from auth or a previous step
      // For now, we'll use a temporary ID based on email hash or session
      const tempDiscordId = `web_${form.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      
      const existingApp = await getApplicationByDiscordId(tempDiscordId);
      if (existingApp) {
        showToast(`You already have an active application (Status: ${existingApp.status}). Please wait for it to be processed.`, 'error');
        setIsLoading(false);
        return;
      }

      // Get gamemode ID
      const gamemode = await getGamemodeByCode(form.gamemode);
      if (!gamemode) {
        showToast('Invalid gamemode selected. Please try again.', 'error');
        setIsLoading(false);
        return;
      }

      // Create application
      await createApplication({
        username: form.username,
        discord_username: form.discord_username,
        discord_user_id: tempDiscordId,
        email: form.email,
        region: form.region.toUpperCase(),
        gamemode_id: gamemode.id,
      });

      setIsSubmitted(true);
      showToast('Application submitted successfully! You will be contacted soon.', 'success');

    } catch (error) {
      console.error('Error submitting application:', error);
      showToast('An error occurred while submitting your application. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
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

        <div className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-gradient-to-b from-[#141414] to-[#0f0f0f] border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/50 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#10b981]/10 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-[#10b981]" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4">
                Application Submitted!
              </h1>
              <p className="text-white/60 mb-6">
                Thank you for applying to FastTier. Your application has been received and is now in the queue.
              </p>
              <div className="space-y-2 text-sm text-white/40 mb-8">
                <p>Minecraft Username: <span className="text-white">{form.username}</span></p>
                <p>Gamemode: <span className="text-white">{gamemodes.find(g => g.code === form.gamemode)?.name}</span></p>
                <p>Region: <span className="text-white">{form.region}</span></p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="px-6 py-3 bg-[#ff9f43] text-black font-bold rounded-xl hover:bg-[#ff9f43]/90 transition-all"
                >
                  Back to Rankings
                </Link>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setForm({ username: '', email: '', region: '', discord_username: '', gamemode: '' });
                  }}
                  className="px-6 py-3 bg-white/[0.05] text-white font-bold rounded-xl hover:bg-white/[0.1] transition-all"
                >
                  Submit Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                disabled={isLoading}
                placeholder="Enter your Minecraft username"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all disabled:opacity-50"
              />
              <p className="text-xs text-white/30 mt-1">3-16 characters, alphanumeric and underscores only</p>
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
                disabled={isLoading}
                placeholder="username#0000 or @username"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all appearance-none cursor-pointer disabled:opacity-50"
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
                disabled={isLoading}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#ff9f43]/40 focus:ring-2 focus:ring-[#ff9f43]/10 transition-all appearance-none cursor-pointer disabled:opacity-50"
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
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#ff9f43] to-[#ff8c00] text-black font-bold rounded-xl hover:from-[#ff9f43]/90 hover:to-[#ff8c00]/90 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-[#ff9f43]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Application
                </>
              )}
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
            <div className="w-10 h10 mx-auto mb-3 bg-[#ff9f43]/10 rounded-xl flex items-center justify-center">
              <User size={20} className="text-[#ff9f43]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Community</h3>
            <p className="text-xs text-white/40">Discord integration</p>
          </div>
        </div>

        {/* Discord Link */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm mb-2">Prefer to apply through Discord?</p>
          <a 
            href="https://discord.gg/fasttier" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white font-semibold rounded-lg hover:bg-[#4752C4] transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join our Discord
          </a>
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
