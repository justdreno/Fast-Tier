import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Globe,
  Gamepad2,
  Loader2,
  Swords,
  Sparkles,
  Trophy
} from 'lucide-react';
import { createApplication, getApplicationByDiscordId, getGamemodeByCode, supabase } from '../lib/supabase';

interface ApplicationForm {
  username: string;
  email: string;
  region: string;
  discord_username: string;
  discord_id: string;
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
  const [form, setForm] = useState<ApplicationForm>({
    username: '',
    email: '',
    region: '',
    discord_username: '',
    discord_id: '',
    gamemode: ''
  });

  const [toast, setToast] = useState<ToastState>({ message: '', visible: false, type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('application');

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: '', visible: false, type }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      showToast('Applications are currently unavailable. Please try again later.', 'error');
      return;
    }

    if (!validateMinecraftUsername(form.username)) {
      showToast('Invalid Minecraft username.', 'error');
      return;
    }

    if (!validateEmail(form.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!/^\d{17,20}$/.test(form.discord_id)) {
      showToast('Please enter a valid Discord User ID (17-20 digits).', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const existingApp = await getApplicationByDiscordId(form.discord_id);
      if (existingApp) {
        showToast(`You have an active application (Status: ${existingApp.status}).`, 'error');
        setIsLoading(false);
        return;
      }

      const gamemode = await getGamemodeByCode(form.gamemode);
      if (!gamemode) {
        showToast('Invalid gamemode selected.', 'error');
        setIsLoading(false);
        return;
      }

      await createApplication({
        username: form.username,
        discord_username: form.discord_username,
        discord_user_id: form.discord_id,
        email: form.email,
        region: form.region.toUpperCase(),
        gamemode_id: gamemode.id,
      });

      setIsSubmitted(true);
      showToast('Application submitted successfully!', 'success');

    } catch (error) {
      console.error('Error submitting application:', error);
      showToast('An error occurred. Please try again.', 'error');
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

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pb-12 font-sans selection:bg-[#ff9f43]/30">
        <div className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-[#141414] border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/50 text-center animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#10b981]/10 rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle size={40} className="text-[#10b981]" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4">Application Sent!</h1>
              <p className="text-white/60 mb-6">Your application is now in the FastTiers queue.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="px-6 py-3 bg-[#ff9f43] text-black font-bold rounded-xl hover:bg-[#ff9f43]/90 transition-all">
                  Back to Rankings
                </Link>
                <button onClick={() => { setIsSubmitted(false); setForm({ username: '', email: '', region: '', discord_username: '', discord_id: '', gamemode: '' }); }} className="px-6 py-3 bg-white/[0.05] text-white font-bold rounded-xl hover:bg-white/[0.1] transition-all">
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
    <div className="min-h-screen bg-[#0a0a0a] pb-12 font-sans selection:bg-[#ff9f43]/30">
      <div className="pt-24">
        {/* Background Glows */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#ff9f43]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl">

          {/* Header Section - Styled like the screenshot */}
          <div className={`mb-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

            {/* Tabs */}
            <div className="flex items-center gap-8 mb-4 px-2 border-b border-white/[0.08]">
              <button
                onClick={() => setActiveTab('application')}
                className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'application' ? 'text-[#ff9f43]' : 'text-white/40 hover:text-white/60'}`}
              >
                Application Form
                {activeTab === 'application' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff9f43] shadow-[0_0_10px_#ff9f43]" />}
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'requirements' ? 'text-[#ff9f43]' : 'text-white/40 hover:text-white/60'}`}
              >
                Requirements
                {activeTab === 'requirements' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ff9f43] shadow-[0_0_10px_#ff9f43]" />}
              </button>
            </div>

            {/* The "Combat Grandmaster" Style Card */}
            <div className="relative group">
              {/* Card Glow Effect on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff9f43]/20 to-[#ff8c00]/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

              <div className="relative bg-[#141414] border border-white/[0.08] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between shadow-xl overflow-hidden">

                {/* Decorative Shine */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] -skew-x-12 translate-x-32 group-hover:translate-x-10 transition-transform duration-700 ease-out pointer-events-none" />

                <div className="flex items-center gap-5 w-full sm:w-auto z-10">
                  {/* Icon Box */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <div className="absolute inset-0 bg-[#ff9f43]/10 rotate-45 rounded-xl border border-[#ff9f43]/20 group-hover:rotate-90 group-hover:scale-110 transition-all duration-500 ease-out"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Swords className="text-[#ff9f43] drop-shadow-[0_0_8px_rgba(255,159,67,0.5)]" size={28} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-black text-[#ff9f43] tracking-tight group-hover:text-[#ffb773] transition-colors">
                      FastTiers Application
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-white/50 text-sm font-medium">
                      <Sparkles size={12} />
                      <span>Join the competitive ranking system</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Stats (Mimicking "Min Points") */}
                <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/[0.08] pt-3 sm:pt-0 sm:pl-6">
                  <span className="text-xs text-white/40 font-bold uppercase tracking-wider mb-0 sm:mb-1">
                    Current Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-lg font-black text-white tracking-wide">OPEN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className={`bg-[#141414] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-700 ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.99]'}`}>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Minecraft Username */}
                <div className={`transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-2 ml-1">
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
                    placeholder="Steve"
                    className="w-full px-4 py-3.5 bg-black/20 border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff9f43]/50 focus:bg-white/[0.02] transition-all hover:border-white/[0.15]"
                  />
                </div>

                {/* Discord Username */}
                <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                  <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-2 ml-1">
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
                    placeholder="@username"
                    className="w-full px-4 py-3.5 bg-black/20 border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff9f43]/50 focus:bg-white/[0.02] transition-all hover:border-white/[0.15]"
                  />
                </div>
              </div>

              {/* Discord ID */}
              <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-2 ml-1">
                  <span className="text-[#ff9f43] font-black">#</span>
                  Discord User ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="discord_id"
                    value={form.discord_id}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="123456789012345678"
                    className="w-full pl-4 pr-10 py-3.5 bg-black/20 border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff9f43]/50 focus:bg-white/[0.02] transition-all hover:border-white/[0.15] font-mono text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#ff9f43] transition-colors">
                    <AlertCircle size={16} />
                  </div>
                </div>
                <p className="text-[11px] text-white/30 mt-1.5 ml-1">
                  Developer Mode required. Right-click your profile → Copy User ID.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Gamemode */}
                <div className={`transition-all duration-500 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-2 ml-1">
                    <Gamepad2 size={14} className="text-[#ff9f43]" />
                    Gamemode
                  </label>
                  <div className="relative">
                    <select
                      name="gamemode"
                      value={form.gamemode}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3.5 bg-black/20 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#ff9f43]/50 transition-all appearance-none cursor-pointer hover:border-white/[0.15]"
                    >
                      <option value="" className="bg-[#1a1a1a] text-gray-500">Select Mode</option>
                      {gamemodes.map((g) => (
                        <option key={g.code} value={g.code} className="bg-[#1a1a1a]">{g.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <Trophy size={14} />
                    </div>
                  </div>
                </div>

                {/* Region */}
                <div className={`transition-all duration-500 delay-450 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                  <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-2 ml-1">
                    <Globe size={14} className="text-[#ff9f43]" />
                    Region
                  </label>
                  <div className="relative">
                    <select
                      name="region"
                      value={form.region}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3.5 bg-black/20 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#ff9f43]/50 transition-all appearance-none cursor-pointer hover:border-white/[0.15]"
                    >
                      <option value="" className="bg-[#1a1a1a]">Select Region</option>
                      <option value="NA" className="bg-[#1a1a1a]">North America</option>
                      <option value="EU" className="bg-[#1a1a1a]">Europe</option>
                      <option value="ASIA" className="bg-[#1a1a1a]">Asia</option>
                      <option value="LKA" className="bg-[#1a1a1a]">Sri Lanka</option>
                      <option value="OTHER" className="bg-[#1a1a1a]">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white/40"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className={`transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider mb-2 ml-1">
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
                  className="w-full px-4 py-3.5 bg-black/20 border border-white/[0.08] rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff9f43]/50 focus:bg-white/[0.02] transition-all hover:border-white/[0.15]"
                />
              </div>

              {/* Submit Button */}
              <div className={`pt-4 transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#ff9f43] text-black font-extrabold rounded-xl hover:bg-[#ffb060] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(255,159,67,0.2)] hover:shadow-[0_0_30px_rgba(255,159,67,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={20} strokeWidth={2.5} />
                      SUBMIT APPLICATION
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer / Discord Link */}
          <div className={`mt-10 text-center transition-all duration-700 ease-out delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a
              href="https://discord.gg/FastTiers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Apply via Discord instead
            </a>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.visible && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md ${toast.type === 'success'
              ? 'bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]'
              : 'bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444]'
              }`}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}