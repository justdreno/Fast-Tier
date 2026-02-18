import { useState, useEffect } from 'react';
import { Trophy, Swords, Target, Crown } from 'lucide-react';

interface PremiumLoaderProps {
  onComplete: () => void;
}

export default function PremiumLoader({ onComplete }: PremiumLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Fast loading - total ~1.2s instead of ~5s
    const intervals = [
      { target: 40, duration: 150 },
      { target: 75, duration: 200 },
      { target: 95, duration: 200 },
      { target: 100, duration: 100 },
    ];

    let currentIndex = 0;
    let currentProgress = 0;
    const timers: number[] = [];
    
    const loadNext = () => {
      if (currentIndex >= intervals.length) {
        setFadeOut(true);
        const t = window.setTimeout(onComplete, 350);
        timers.push(t);
        return;
      }

      const interval = intervals[currentIndex];
      const step = (interval.target - currentProgress) / (interval.duration / 16);
      
      const timer = window.setInterval(() => {
        currentProgress += step;
        if (currentProgress >= interval.target) {
          currentProgress = interval.target;
          window.clearInterval(timer);
          currentIndex++;
          setProgress(currentProgress);
          loadNext();
        } else {
          setProgress(currentProgress);
        }
      }, 16);
      timers.push(timer);
    };

    // Start immediately - no initial delay
    loadNext();
    
    return () => {
      timers.forEach(t => window.clearTimeout(t));
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center transition-all duration-300 ease-out ${
        fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff9f43]/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ff6b00]/5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,159,67,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,159,67,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animation */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div 
            className={`absolute inset-0 bg-[#ff9f43]/30 blur-3xl rounded-full transition-all duration-1000 ${
              progress > 50 ? 'opacity-100 scale-150' : 'opacity-50 scale-100'
            }`}
          />
          
          {/* Logo */}
          <div className="relative">
            <img 
              src="/fast-tier.png" 
              alt="FastTier"
              className="h-20 w-auto object-contain animate-fade-in"
            />
            
            {/* Shine effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"
              style={{ 
                animationDuration: '2s',
                animationIterationCount: 'infinite'
              }}
            />
          </div>
        </div>

        {/* Loading text with icons */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { Icon: Trophy, delay: 0 },
            { Icon: Swords, delay: 150 },
            { Icon: Target, delay: 300 },
            { Icon: Crown, delay: 450 },
          ].map(({ Icon, delay }, index) => (
            <div
              key={index}
              className="relative"
              style={{ animationDelay: `${delay}ms` }}
            >
              <Icon 
                size={24} 
                className={`text-[#ff9f43] transition-all duration-500 ${
                  progress > (index + 1) * 20 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-30 scale-75'
                }`}
              />
              {progress > (index + 1) * 20 && (
                <div className="absolute inset-0 bg-[#ff9f43]/50 blur-lg animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#ff9f43] to-[#ff6b00] rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              boxShadow: '0 0 20px rgba(255,159,67,0.5)'
            }}
          />
        </div>

        {/* Progress text */}
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-sm font-medium">
            {progress < 30 && 'Connecting...'}
            {progress >= 30 && progress < 60 && 'Fetching data...'}
            {progress >= 60 && progress < 90 && 'Loading rankings...'}
            {progress >= 90 && 'Almost ready...'}
          </span>
          <span className="text-[#ff9f43] text-sm font-bold tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Decorative particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#ff9f43]/30 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
