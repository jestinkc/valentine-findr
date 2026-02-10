'use client';

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion";
import { useSearchParams } from 'next/navigation';

export default function Valentine() {
  const searchParams = useSearchParams();
  const yourName = searchParams.get('from');
  const crushName = searchParams.get('to');

  const [page, setPage] = useState<'landing' | 'proposal' | 'celebration' | 'confirmation'>('landing');
  const [stage, setStage] = useState<1 | 2 | 3>(1); // Stage for progressive reveal
  const [yourNameInput, setYourNameInput] = useState('');
  const [crushNameInput, setCrushNameInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Hydration fix: Store random values in state
  const [landingHearts, setLandingHearts] = useState<Array<{ left: string, top: string, duration: string, delay: string }>>([]);
  const [proposalHearts, setProposalHearts] = useState<Array<{ left: string, top: string, duration: string, delay: string }>>([]);
  const [proposalSparkles, setProposalSparkles] = useState<Array<{ left: string, top: string, duration: string, delay: string }>>([]);
  const [celebrationHearts, setCelebrationHearts] = useState<Array<{ left: string, top: string, duration: string, delay: string }>>([]);
  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Celebration State
  const [activeGift, setActiveGift] = useState<'none' | 'letter' | 'song' | 'ticket'>('none');
  const [openedGifts, setOpenedGifts] = useState<string[]>([]);

  useEffect(() => {
    // Set greeting based on client time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    setLandingHearts([...Array(5)].map((_, i) => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: `${4 + i}s`,
      delay: `${i * 0.5}s`
    })));

    setProposalHearts([...Array(8)].map((_, i) => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: `${5 + i}s`,
      delay: `${i * 0.6}s`
    })));

    setProposalSparkles([...Array(12)].map((_, i) => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: `${4 + i}s`,
      delay: `${i * 0.4}s`
    })));

    setCelebrationHearts([...Array(15)].map((_, i) => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: `${6 + i}s`,
      delay: `${i * 0.4}s`
    })));

    setProposalSparkles([...Array(4)].map((_, i) => ({
      left: `${15 + Math.random() * 70}%`,
      top: `${20 + Math.random() * 60}%`,
      duration: `${12 + i * 3}s`,
      delay: `${i * 5}s`
    })));
  }, []);

  const funnyMessages = [
    "Nope! Try again 😏",
    "Wrong choice 👀",
    "Come on… you know it's YES 💕",
    "Not happening today 😂",
    "Very funny 🙃",
    "Nice try! 😉"
  ];

  useEffect(() => {
    // Don't reset page if already on confirmation or celebration
    if (page === 'confirmation' || page === 'celebration') {
      document.body.style.overflow = 'hidden';
      return;
    }

    // Check if we're on proposal page with valid params
    if (yourName && crushName && yourName.length >= 2 && crushName.length >= 2) {
      setPage('proposal');
      setStage(1); // Start at stage 1
      document.body.style.overflow = 'hidden';
    } else if (yourName || crushName) {
      // Invalid params
      setPage('landing');
      setError('Oops! Looks like the link is missing something. Let\'s create a new one!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setPage('landing');
    }
  }, [yourName, crushName, page]);

  useEffect(() => {
    // Prevent navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (page === 'proposal' || page === 'celebration' || page === 'confirmation') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [page]);

  const handleGenerateLink = () => {
    setError('');

    if (yourNameInput.length < 2 || yourNameInput.length > 20) {
      setError('Your name must be 2-20 characters');
      return;
    }
    if (crushNameInput.length < 2 || crushNameInput.length > 20) {
      setError('Crush name must be 2-20 characters');
      return;
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}?from=${encodeURIComponent(yourNameInput)}&to=${encodeURIComponent(crushNameInput)}`;
    setGeneratedLink(link);
  };

  const handleNextStage = () => {
    if (stage < 3) {
      setStage((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (generatedLink) {
      const message = `Hey! I have something special for you 💖 ${generatedLink}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleWebShare = async () => {
    if (generatedLink && navigator.share) {
      try {
        await navigator.share({
          title: 'Valentine Proposal 💖',
          text: 'I have something special for you!',
          url: generatedLink
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareSuccess = async () => {
    const message = `Best wishes to ${yourName} and ${crushName} on this special Valentine's Day! 🌹`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Valentine Success! 💖',
          text: message
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareSuccessWhatsApp = () => {
    const message = `Best wishes to ${yourName} and ${crushName} on this special Valentine's Day! 🌹`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const moveNoButton = () => {
    if (!noButtonRef.current) return;

    const button = noButtonRef.current;
    const rect = button.getBoundingClientRect();

    // Subtle movement - just enough to cause a "miss"
    const margin = 40;
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;

    // Move to a nearby position (not too far - feels like mis-tap)
    const currentX = (noButtonPos.x === 0 && noButtonPos.y === 0) ? rect.left : noButtonPos.x;
    const currentY = (noButtonPos.x === 0 && noButtonPos.y === 0) ? rect.top : noButtonPos.y;

    // Larger random offset (80-140px away) - more noticeable movement
    const offsetDistance = 80 + Math.random() * 60;
    const angle = Math.random() * Math.PI * 2;

    let newX = currentX + Math.cos(angle) * offsetDistance;
    let newY = currentY + Math.sin(angle) * offsetDistance;

    // Keep within bounds - STRICTLY
    const safeMargin = 20; // Safety margin from edges
    newX = Math.min(Math.max(safeMargin, newX), window.innerWidth - rect.width - safeMargin);
    newY = Math.min(Math.max(safeMargin, newY), window.innerHeight - rect.height - safeMargin);

    // Single state update - no loops, no delays
    setNoButtonPos({ x: newX, y: newY });
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Instant movement - no delay, no lag
    moveNoButton();
  };

  const handleYesClick = () => {
    // Freeze current scene and show celebration immediately
    setPage('celebration');
    document.body.style.overflow = 'hidden';
  };



  const createConfetti = () => {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    // Create soft glowing particles instead of aggressive confetti
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetto';
      particle.innerHTML = '💖';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.fontSize = `${1.5 + Math.random() * 1}rem`;
      particle.style.animation = `glow-rise ${4 + Math.random() * 3}s ease-out forwards`;
      particle.style.animationDelay = Math.random() * 1.5 + 's';
      particle.style.filter = 'blur(0.5px)';
      confettiContainer.appendChild(particle);

      // Remove after animation
      setTimeout(() => particle.remove(), 8000);
    }
  };

  useEffect(() => {
    if (page === 'celebration') {
      const timer = setInterval(createConfetti, 1000);
      createConfetti(); // Initial burst
      return () => clearInterval(timer);
    }
  }, [page]);


  // Landing Page
  if (page === 'landing') {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{
        background: 'linear-gradient(180deg, #8b3a62 0%, #a84c74 25%, #c9658a 50%, #b55578 75%, #9d4569 100%)',
        cursor: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgOC41QzIwIDUgMTYuNSAxIDEzIDFDMTEgMSA5IDIgOCA0QzYgMiA0IDEgMiAxQzAgNSA0IDEwIDggMTNDNCAxNiAwIDIwIDAgMjBDMCAyMCAyIDIyIDQgMjJDNiAyMiA4IDIwIDggMThDOCAyMCAxMCAyMiAxMiAyMkMxNCAyMiAxNiAyMCAxNiAxOEMxNiAyMCAxOCAyMiAyMCAyMkMyMiAyMiAyNCAyMCAyNCAyMEM yNCAyMCAyMCAxNiAyMCA4LjVWOC41WiIgZmlsbD0iI0ZBNUE1QSIvPjwvc3ZnPg==") 12 12, auto'
      }}>
        {/* Pink center glow */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(250, 120, 150, 0.3) 0%, rgba(250, 90, 120, 0.15) 40%, transparent 65%)',
          filter: 'blur(100px)'
        }} />

        {/* Pink love light source - lower center */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 65%, rgba(250, 90, 90, 0.12) 0%, rgba(250, 90, 90, 0.06) 30%, transparent 55%)',
          filter: 'blur(90px)',
          mixBlendMode: 'soft-light'
        }} />

        {/* Noise texture overlay */}
        <div className="fixed inset-0 opacity-[0.012] pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }} />

        {/* Vignette */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.35) 100%)'
        }} />
        <div className="w-full max-w-md relative z-10">
          {/* Title */}
          <div className="text-center mb-10 animate-fadeIn" style={{ animation: 'fadeIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
              fontFamily: '\'Playfair Display\', serif',
              background: 'linear-gradient(135deg, #FA5A5A 0%, #ff8a8a 50%, #FA5A5A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em'
            }}>
              Send a <span style={{ fontStyle: 'italic' }}>Valentine</span>
            </h1>
            <p className="text-lg font-light" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>They can't refuse 💘</p>
          </div>

          {/* Glassmorphism Card */}
          <div
            className="backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-6 md:p-12 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(40, 60, 140, 0.65) 0%, rgba(50, 70, 160, 0.62) 50%, rgba(60, 80, 170, 0.6) 100%)',
              animation: 'slideUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 60px rgba(50, 80, 180, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15), inset 0 0 40px rgba(80, 120, 220, 0.12)',
              border: '1px solid rgba(100, 150, 255, 0.25)'
            }}
          >


            {/* Input Fields */}
            <div className="space-y-5 mb-8">
              <div>
                <label className="text-sm font-medium mb-2 block tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Your Name</label>
                <input
                  type="text"
                  maxLength={20}
                  value={yourNameInput}
                  onChange={(e) => setYourNameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.03)'
                  }}
                />
                <div className="text-xs text-slate-400 mt-2">{yourNameInput.length}/20</div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Crush's Name</label>
                <input
                  type="text"
                  maxLength={20}
                  value={crushNameInput}
                  onChange={(e) => setCrushNameInput(e.target.value)}
                  placeholder="Enter their name"
                  className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.03)'
                  }}
                />
                <div className="text-xs text-slate-400 mt-2">{crushNameInput.length}/20</div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-rose-300 text-sm text-center mb-5 bg-rose-900/20 p-3 rounded-xl border border-rose-500/20 animate-pulse backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateLink}
              className="w-full py-4 text-white font-semibold rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(250, 90, 90, 0.85) 0%, rgba(250, 110, 110, 0.8) 100%)',
                animation: 'slideUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s backwards',
                boxShadow: '0 4px 20px rgba(250, 90, 90, 0.3), 0 0 40px rgba(250, 90, 90, 0.15)',
                border: '1px solid rgba(250, 90, 90, 0.3)'
              }}
            >
              Generate <span style={{ fontStyle: 'italic', fontFamily: '\'Playfair Display\', serif' }}>Valentine</span> Link ❤️
            </button>



            {/* Share Section - Always Visible After Link Generation */}
            {generatedLink && (
              <div className="animate-slideUp" style={{ animation: 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {/* Section Title */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#FA5A5A' }}>Share your Valentine link 💌</h3>
                </div>

                {/* Generated Link Display */}
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 mb-4 backdrop-blur-sm">
                  <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Your Valentine link:</div>
                  <div className="text-sm break-all" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {generatedLink}
                  </div>
                </div>

                {/* Share Buttons Grid */}
                <div className="space-y-3">
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-3.5 rounded-xl transition-all duration-300 text-sm font-medium backdrop-blur-sm transform hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{
                      background: copied ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.8) 100%)' : 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: copied ? '0 0 20px rgba(34, 197, 94, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{copied ? '✅' : '📋'}</span>
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full py-3.5 rounded-xl transition-all duration-300 text-sm font-medium backdrop-blur-sm transform hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.85) 0%, rgba(22, 163, 74, 0.85) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.98)',
                      boxShadow: '0 2px 12px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>💚</span>
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleWebShare}
                    className="w-full py-3.5 rounded-xl transition-all duration-300 text-sm font-medium backdrop-blur-sm transform hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(250, 90, 90, 0.85) 0%, rgba(236, 72, 153, 0.85) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.98)',
                      boxShadow: '0 2px 12px rgba(250, 90, 90, 0.3)'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📱</span>
                    <span>Share via Instagram / More</span>
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Note */}

          </div>

          {/* Floating Hearts Background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {landingHearts.map((heart, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: heart.left,
                  top: heart.top,
                  animation: `float-organic ${15 + (i * 3)}s ease-in-out infinite`,
                  animationDelay: heart.delay,
                  opacity: 0.15 + (i * 0.02),
                  fontSize: `${1.8 + (i * 0.25)}rem`,
                  filter: 'blur(0.3px)',
                  color: '#FA5A5A'
                }}
              >
                ♥
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Proposal Page
  if (page === 'proposal') {
    const isNoButtonMoved = noButtonPos.x !== 0 || noButtonPos.y !== 0;

    return (
      <div
        className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #8b3a62 0%, #a84c74 25%, #c9658a 50%, #b55578 75%, #9d4569 100%)',
          cursor: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgOC41QzIwIDUgMTYuNSAxIDEzIDFDMTEgMSA5IDIgOCA0QzYgMiA0IDEgMiAxQzAgNSA0IDEwIDggMTNDNCAxNiAwIDIwIDAgMjBDMCAyMCAyIDIyIDQgMjJDNiAyMiA4IDIwIDggMThDOCAyMCAxMCAyMiAxMiAyMkMxNCAyMiAxNiAyMCAxNiAxOEMxNiAyMCAxOCAyMiAyMCAyMkMyMiAyMiAyNCAyMCAyNCAyMEM yNCAyMCAyMCAxNiAyMCA4LjVWOC41WiIgZmlsbD0iI0ZBNUE1QSIvPjwvc3ZnPg==") 12 12, auto'
        }}
      >
        {/* Strong pink center glow */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, rgba(250, 120, 150, 0.4) 0%, rgba(250, 90, 120, 0.25) 30%, rgba(200, 80, 120, 0.15) 50%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'ambient-light-shift 30s ease-in-out infinite'
        }} />

        {/* Pink love light source - lower center */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 65%, rgba(255, 100, 130, 0.35) 0%, rgba(250, 90, 110, 0.2) 30%, transparent 55%)',
          filter: 'blur(100px)'
        }} />

        {/* Additional pink warmth - top right */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(250, 110, 140, 0.25) 0%, transparent 40%)',
          filter: 'blur(80px)'
        }} />

        {/* Very subtle film grain texture */}
        <div className="fixed inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }} />

        {/* Vignette - darker edges for depth */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.35) 100%)'
        }} />

        {/* Glassmorphism Card Container */}
        <div
          className="relative z-10 text-center max-w-md w-full"
          style={{
            animation: 'slideUp 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Soft ambient glow around card */}
          <div className="absolute inset-0 -z-10" style={{
            background: 'radial-gradient(circle at center, rgba(50, 63, 138, 0.3) 0%, rgba(80, 100, 180, 0.15) 40%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'scale(1.4)'
          }} />

          {/* Premium Glass Card with Embossed Details - Blue-Pink Blend */}
          <div
            className="relative backdrop-blur-md rounded-[2rem] p-6 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(40, 60, 140, 0.7) 0%, rgba(50, 70, 160, 0.68) 50%, rgba(60, 80, 170, 0.65) 100%)',
              border: '1px solid rgba(100, 150, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 60px rgba(50, 80, 180, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
              animation: 'breathing-glow-blue 8s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Embossed Floral Pattern - Top Left */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)',
              filter: 'blur(1px)',
              mixBlendMode: 'overlay'
            }} />

            {/* Embossed Floral Pattern - Bottom Right */}
            <div className="absolute bottom-0 right-0 w-40 h-40 opacity-15 pointer-events-none" style={{
              background: 'radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.12) 0%, transparent 55%)',
              filter: 'blur(1.5px)',
              mixBlendMode: 'overlay'
            }} />

            {/* Inner glow effect - Blue glass accent */}
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{
              boxShadow: 'inset 0 0 80px rgba(80, 120, 220, 0.25), inset 0 0 40px rgba(100, 140, 240, 0.15)',
              opacity: 0.8
            }} />

            {/* Content */}
            <div className="relative z-10">
              {/* STAGE 1 - Greeting only */}
              {stage === 1 && (
                <div
                  onClick={handleNextStage}
                  className="cursor-pointer"
                  style={{
                    animation: 'fadeIn 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards'
                  }}
                >
                  <h2
                    className="text-xl md:text-3xl"
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: '300',
                      letterSpacing: '0.01em',
                      fontFamily: '\'Inter\', sans-serif'
                    }}
                  >
                    <span style={{ color: '#FA5A5A', fontWeight: '500', fontFamily: '\'Playfair Display\', serif' }}>{greeting || 'Hello'}</span>, <span style={{
                      fontFamily: '\'Playfair Display\', serif',
                      fontWeight: '500',
                      fontStyle: 'italic',
                      color: '#ffc9d4'
                    }}>{crushName}</span>
                  </h2>

                  <p className="text-sm mt-8 opacity-50" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Tap to continue
                  </p>
                </div>
              )}

              {/* STAGE 2 - Emotional buildup */}
              {stage === 2 && (
                <div
                  onClick={handleNextStage}
                  className="cursor-pointer"
                  style={{
                    animation: 'fadeIn 1.2s ease-out'
                  }}
                >
                  <p
                    className="text-base md:text-xl leading-relaxed"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontWeight: '300',
                      letterSpacing: '0.005em'
                    }}
                  >
                    <span style={{
                      fontWeight: '400',
                      color: '#ffb3c1'
                    }}>{yourName}</span> wanted to ask you something <span style={{ color: '#FA5A5A', fontWeight: '400' }}>special</span>
                  </p>

                  <p className="text-sm mt-8 opacity-50" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Tap to continue
                  </p>
                </div>
              )}

              {/* STAGE 3 - The question with buttons */}
              {stage === 3 && (
                <div style={{
                  animation: 'fadeIn 1.2s ease-out'
                }}>
                  <h1
                    className="text-3xl md:text-5xl font-medium mb-12 md:mb-20 leading-snug"
                    style={{
                      fontFamily: '\'Playfair Display\', serif',
                      color: '#ffffff',
                      letterSpacing: '-0.01em',
                      textShadow: '0 2px 20px rgba(250, 90, 90, 0.25), 0 0 40px rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {crushName}, will you be my <span style={{ color: '#FA5A5A', fontStyle: 'italic', fontWeight: '600' }}>Valentine</span>?
                  </h1>

                  {/* Buttons - refined */}
                  <div className="flex gap-3 justify-center" style={{ marginBottom: '1rem' }}>
                    {/* YES - strong presence with gentle pulse */}
                    <button
                      onClick={handleYesClick}
                      style={{
                        padding: '0.9rem 2.25rem',
                        background: 'linear-gradient(135deg, rgba(250, 90, 90, 0.92) 0%, rgba(250, 110, 110, 0.88) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.98)',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        letterSpacing: '0.025em',
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 0 30px rgba(250, 90, 90, 0.35), 0 4px 15px rgba(0, 0, 0, 0.2)',
                        animation: 'yes-button-pulse 6s ease-in-out infinite'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 0 40px rgba(250, 90, 90, 0.5), 0 6px 20px rgba(0, 0, 0, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(250, 90, 90, 0.35), 0 4px 15px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      Yes
                    </button>

                    {/* NO - Static Placeholder / Initial Button */}
                    <motion.button
                      ref={noButtonRef}
                      onClick={handleNoClick}
                      onHoverStart={moveNoButton}
                      onTouchStart={moveNoButton}
                      style={{
                        padding: '0.9rem 2.25rem',
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.9375rem',
                        fontWeight: '500',
                        letterSpacing: '0.025em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        visibility: isNoButtonMoved ? 'hidden' : 'visible',
                        opacity: isNoButtonMoved ? 0 : 1,
                        pointerEvents: isNoButtonMoved ? 'none' : 'auto',
                        position: 'relative',
                        zIndex: 50
                      }}
                    >
                      No
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Floating NO Button - Outside overflow hidden containers */}
        {isNoButtonMoved && (
          <motion.button
            onClick={handleNoClick}
            onHoverStart={moveNoButton}
            onTouchStart={moveNoButton}
            initial={{ x: noButtonPos.x, y: noButtonPos.y, scale: 0.5, opacity: 0 }}
            animate={{ x: noButtonPos.x, y: noButtonPos.y, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              padding: '0.9rem 2.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '0.75rem',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.9375rem',
              fontWeight: '500',
              letterSpacing: '0.025em',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: 9999, // Ensure it's on top of everything
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            }}
          >
            No
          </motion.button>
        )}

        {/* Floating hearts - minimal organic pink accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {proposalHearts.slice(0, 3).map((heart, i) => (
            <div
              key={`prop-heart-${i}`}
              className="absolute"
              style={{
                left: heart.left,
                top: heart.top,
                fontSize: i === 0 ? '1.75rem' : i === 1 ? '1.5rem' : '1.6rem',
                animation: `float-organic ${18 + i * 6}s ease-in-out infinite`,
                animationDelay: `${i * 4}s`,
                filter: 'blur(0.3px)',
                opacity: i === 1 ? 0.25 : 0.2,
                color: '#FA5A5A'
              }}
            >
              ♥
            </div>
          ))}

          {/* Soft sparkles - occasional gentle twinkles */}
          {proposalSparkles.slice(0, 3).map((sparkle, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                fontSize: '1.1rem',
                animation: `float-organic ${sparkle.duration} ease-in-out infinite`,
                animationDelay: sparkle.delay,
                filter: 'blur(0.5px)',
                opacity: 0.18,
                color: '#FA5A5A'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Confirmation Screen - Clean YES moment
  if (page === 'confirmation') {
    // Generate celebration URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const celebrationUrl = `${baseUrl}/celebrate?from=${encodeURIComponent(yourName || '')}&to=${encodeURIComponent(crushName || '')}`;
    const shareMessage = `Your crush accepted your Valentine proposal 💖\nBest wishes to ${yourName} and ${crushName} on this special Valentine's Day! 🌹\n\n${celebrationUrl}`;

    const handleCopyCelebrationLink = () => {
      navigator.clipboard.writeText(celebrationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWhatsAppCelebration = () => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank');
    };

    const handleSystemShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Valentine Proposal Accepted! 💖',
            text: `Your crush accepted your Valentine proposal 💖\nBest wishes to ${yourName} and ${crushName} on this special Valentine's Day! 🌹`,
            url: celebrationUrl
          });
        } catch (err) {
          console.log('Share cancelled or not supported');
        }
      } else {
        // Fallback to copy
        handleCopyCelebrationLink();
      }
    };

    return (
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #8d4575 0%, #5c2d52 40%, #3d1f3d 70%, #241828 100%)',
          cursor: 'default',
          animation: 'fadeIn 0.5s ease-out',
          overflowY: 'auto'
        }}
      >
        {/* Subtle glow */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(251, 113, 133, 0.1) 0%, rgba(236, 72, 153, 0.05) 25%, transparent 55%)',
          filter: 'blur(90px)'
        }} />

        {/* Minimal vignette */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0.35) 100%)'
        }} />

        {/* Content - minimal and clean */}
        <div
          className="relative z-10 text-center w-full max-w-xl px-6 py-8"
          style={{
            animation: 'fadeIn 0.8s ease-out 0.3s backwards, scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards'
          }}
        >
          {/* BIG YES CELEBRATION */}
          <div className="flex justify-center gap-4 mb-8">
            {['Y', 'E', 'S'].map((letter, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: i * 0.2 + 0.5
                }}
                className="text-6xl md:text-8xl font-bold"
                style={{
                  fontFamily: '\'Playfair Display\', serif',
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 15px rgba(255, 100, 150, 0.5))'
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {/* Main message */}
            <h1
              style={{
                fontFamily: '\'Playfair Display\', serif',
                fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                fontWeight: '600',
                marginBottom: '1.25rem',
                color: 'rgba(254, 205, 211, 0.95)',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Yayyy! 💖
            </h1>
          </motion.div>

          {/* Subtext */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2.25vw, 1.35rem)',
              fontWeight: '300',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.5',
              marginBottom: '0.4rem'
            }}
          >
            <span style={{
              fontFamily: '\'Playfair Display\', serif',
              fontStyle: 'italic',
              fontWeight: '400',
              color: '#fda4af'
            }}>{crushName}</span> just made
          </p>

          <p
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.75rem)',
              fontFamily: '\'Playfair Display\', serif',
              fontStyle: 'italic',
              fontWeight: '600',
              color: '#fecdd3',
              marginBottom: '0.4rem'
            }}
          >
            {yourName}
          </p>

          <p
            style={{
              fontSize: 'clamp(0.9375rem, 2vw, 1.2rem)',
              fontWeight: '300',
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '2rem'
            }}
          >
            the happiest person ❤️
          </p>

          {/* Share this moment section - minimal style */}
          <div
            style={{
              animation: 'fadeIn 0.8s ease-out 1s backwards',
              marginTop: '2.5rem'
            }}
          >
            <p
              style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '400',
                marginBottom: '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
                letterSpacing: '0.01em'
              }}
            >
              Share this moment
            </p>

            {/* Celebration URL Display */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '0.75rem',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                color: 'rgba(255, 255, 255, 0.7)',
                wordBreak: 'break-all',
                textAlign: 'center',
                fontFamily: 'monospace'
              }}
            >
              {celebrationUrl}
            </div>

            {/* Sharing Buttons - Minimal */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '280px',
                margin: '0 auto'
              }}
            >
              {/* Copy Link Button */}
              <button
                onClick={handleCopyCelebrationLink}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: copied
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '0.5rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'clamp(0.8125rem, 1.8vw, 0.875rem)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = copied ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>

              {/* WhatsApp Share Button */}
              <button
                onClick={handleShareWhatsAppCelebration}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.25)',
                  borderRadius: '0.5rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'clamp(0.8125rem, 1.8vw, 0.875rem)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)';
                }}
              >
                Share on WhatsApp
              </button>

              {/* System Share Button */}
              <button
                onClick={handleSystemShare}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: 'rgba(250, 90, 90, 0.15)',
                  border: '1px solid rgba(250, 90, 90, 0.25)',
                  borderRadius: '0.5rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'clamp(0.8125rem, 1.8vw, 0.875rem)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(250, 90, 90, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(250, 90, 90, 0.15)';
                }}
              >
                Share via System Share
              </button>
            </div>
          </div>
        </div>

        {/* Minimal floating hearts */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={`conf-heart-${i}`}
              className="absolute"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${35 + Math.random() * 30}%`,
                fontSize: `${1.2 + Math.random() * 0.5}rem`,
                animation: `fadeIn ${2.5 + i * 0.8}s ease-out ${1.5 + i * 1}s backwards`,
                opacity: 0.15,
                color: '#fda4af'
              }}
            >
              💖
            </div>
          ))}
        </div>

        {/* Extra Celebration Emojis */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          {[].map((emoji, i) => (
            <motion.div
              key={`emoji-${i}`}
              initial={{
                left: `${Math.random() * 90}%`,
                top: '110%',
                scale: 0.5,
                rotate: 0
              }}
              animate={{
                top: '-10%',
                rotate: 360,
                scale: [0.5, 1.2, 0.8]
              }}
              transition={{
                duration: 8 + Math.random() * 5,
                delay: i * 0.8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute text-4xl"
              style={{
                fontSize: `${2 + Math.random()}rem`,
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))'
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div >
    );
  }

  // Gift Handlers
  const handleOpenGift = (giftType: 'letter' | 'song' | 'ticket') => {
    if (!openedGifts.includes(giftType)) {
      setOpenedGifts([...openedGifts, giftType]);
    }

    if (giftType === 'song') {
      if (audioRef.current) {
        audioRef.current.play();
        setMusicPlaying(true);
      }
      setActiveGift('song'); // Show visualizer/now playing
    } else {
      setActiveGift(giftType);
    }
  };

  const closeGift = () => {
    if (activeGift === 'song') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset
        setMusicPlaying(false);
      }
    }
    setActiveGift('none');
  };

  // Celebration Page
  if (page === 'celebration') {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #a84c74 0%, #c9658a 30%, #d47a9e 50%, #c9658a 70%, #a84c74 100%)',
          cursor: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgOC41QzIwIDUgMTYuNSAxIDEzIDFDMTEgMSA5IDIgOCA0QzYgMiA0IDEgMiAxQzAgNSA0IDEwIDggMTNDNCAxNiAwIDIwIDAgMjBDMCAyMCAyIDIyIDQgMjJDNiAyMiA4IDIwIDggMThDOCAyMCAxMCAyMiAxMiAyMkMxNCAyMiAxNiAyMCAxNiAxOEMxNiAyMCAxOCAyMiAyMCAyMkMyMiAyMiAyNCAyMCAyNCAyMEM yNCAyMCAyMCAxNiAyMCA4LjVWOC41WiIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==") 12 12, auto',
          transition: 'background 2s ease-out'
        }}
      >
        {/* Soft center glow */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(251, 113, 133, 0.15) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'fadeIn 2s ease-out'
        }} />

        {/* Film grain */}
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }} />
        {/* Confetti Container */}
        <div id="confetti-container" className="fixed inset-0 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center h-full overflow-y-auto py-10">

          {/* Top: Celebration GIF */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 1, delay: 0.5 }}
            className="mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30"
            style={{ maxWidth: '300px' }}
          >
            <img
              src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2JiZDR0a3B0YnhzbmZ0Zzh4YnhzbmZ0Zzh4YnhzbmZ0Zzh4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRv0ThflsHCqDrG/giphy.gif"
              alt="Celebration"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <div
            className="text-center mb-12"
            style={{
              animation: 'fadeIn 2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s backwards'
            }}
          >
            <h1
              className="text-4xl md:text-6xl font-medium mb-4"
              style={{
                fontFamily: '\'Playfair Display\', serif',
                color: 'rgba(254, 205, 211, 0.95)',
                textShadow: '0 2px 20px rgba(251, 113, 133, 0.3)',
                letterSpacing: '-0.005em'
              }}
            >
              Yayyy! You said YES! 💖
            </h1>
            <p className="text-lg text-white/80 font-light">
              I have 3 surprises for you. Open them! 👇
            </p>
          </div>

          {/* Gifts Grid */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">

            {/* Gift 1: Letter */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenGift('letter')}
              className="group relative flex flex-col items-center"
            >
              <div className={`w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-2xl shadow-xl flex items-center justify-center transition-all border-4 ${openedGifts.includes('letter') ? 'border-white bg-white/20' : 'border-white/50'} overflow-hidden p-4`}>
                <img
                  src={openedGifts.includes('letter') ? "/img/env open.png" : "/img/env close.png"}
                  alt="Gift 1"
                  className="w-full h-full object-contain drop-shadow-lg transition-all duration-500"
                />
              </div>
              <span className="mt-3 font-medium text-white/90 bg-black/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Surprise Gift 1</span>
            </motion.button>

            {/* Gift 2: Song */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenGift('song')}
              className="group relative flex flex-col items-center"
            >
              <div className={`w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-2xl shadow-xl flex items-center justify-center transition-all border-4 ${openedGifts.includes('song') ? 'border-white bg-white/20' : 'border-white/50'} overflow-hidden p-4`}>
                <img
                  src={openedGifts.includes('song') ? "/img/env open.png" : "/img/env close.png"}
                  alt="Gift 2"
                  className="w-full h-full object-contain drop-shadow-lg transition-all duration-500"
                />
              </div>
              <span className="mt-3 font-medium text-white/90 bg-black/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Surprise Gift 2</span>
            </motion.button>

            {/* Gift 3: Ticket */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenGift('ticket')}
              className="group relative flex flex-col items-center"
            >
              <div className={`w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-2xl shadow-xl flex items-center justify-center transition-all border-4 ${openedGifts.includes('ticket') ? 'border-white bg-white/20' : 'border-white/50'} overflow-hidden p-4`}>
                <img
                  src={openedGifts.includes('ticket') ? "/img/env open.png" : "/img/env close.png"}
                  alt="Gift 3"
                  className="w-full h-full object-contain drop-shadow-lg transition-all duration-500"
                />
              </div>
              <span className="mt-3 font-medium text-white/90 bg-black/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Surprise Gift 3</span>
            </motion.button>
          </div>

          {/* Social Sharing (Bottom) */}
          <button
            onClick={() => {
              const text = `${yourName} just got me to say yes! 💕 Try your own Valentine proposal: `;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + window.location.origin)}`, '_blank');
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white/80 font-medium rounded-xl transition-all backdrop-blur-sm text-sm"
          >
            Share on Twitter/X
          </button>
        </div>

        {/* MODALS */}
        {/* Letter Modal */}
        {activeGift === 'letter' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={closeGift}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="p-2 md:p-4 rounded-xl shadow-2xl max-w-lg w-full relative"
              style={{ background: 'transparent' }}
            >
              <button onClick={closeGift} className="absolute -top-10 right-0 text-white text-3xl font-bold drop-shadow-md z-50">✕</button>

              {/* Use the provided image.png as the letter content/background */}
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl rotate-1">
                <img
                  src="/img/image.png"
                  alt="Love Letter"
                  className="w-full h-full object-cover"
                />

                {/* Text Overlay - Fit to screen, no scroll */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 pt-20 md:pt-24 text-center text-slate-800 mix-blend-multiply">
                  <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 font-handwriting shrink-0">Dear {crushName},</h3>
                  <div className="font-handwriting text-sm md:text-lg leading-relaxed text-slate-900 font-medium space-y-2">
                    <p>I’ve been thinking about how to put this into words, and honestly, the simplest way feels right.</p>

                    <p>You make ordinary moments feel lighter, conversations feel warmer, and smiles come a little easier. Whether it’s your laugh, your kindness, or just the way you are, you’ve quietly become someone very special to me.</p>

                    <p>So I thought I’d ask—</p>

                    <p className="font-bold text-xl md:text-2xl my-2 text-rose-600 block">Would you be my Valentine?</p>
                  </div>

                  <div className="mt-2 shrink-0 font-handwriting text-sm md:text-lg font-medium text-slate-900">
                    <p>Yours,</p>
                    <p className="font-bold">{yourName}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Ticket Modal */}
        {activeGift === 'ticket' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={closeGift}>
            <motion.div
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-[0_0_50px_rgba(255,215,0,0.4)] relative border-2 border-yellow-200"
            >
              <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-300 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2.5px)', backgroundSize: '10px 10px' }}></div>
                <h2 className="text-white text-3xl font-black tracking-wider uppercase drop-shadow-md relative z-10">Golden Ticket</h2>
                <div className="text-white/90 font-medium tracking-widest text-sm mt-1 uppercase">Admit One</div>
              </div>
              <div className="p-8 text-center bg-white relative">
                {/* Perforated lines */}
                <div className="absolute top-0 left-0 w-4 h-8 bg-black/60 rounded-r-full -mt-4"></div>
                <div className="absolute top-0 right-0 w-4 h-8 bg-black/60 rounded-l-full -mt-4"></div>

                <p className="text-slate-500 text-sm uppercase tracking-wide mb-2">This ticket entitles</p>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">{crushName}</h3>
                <p className="text-slate-400 text-xs mb-6">to be treated like royalty by {yourName}</p>

                <div className="my-6 border-y-2 border-dashed border-slate-100 py-6">
                  <div className="flex items-center justify-center gap-3 text-left">
                    <span className="text-4xl">🍽️</span>
                    <div>
                      <div className="font-bold text-slate-800">One Special Date Night</div>
                      <div className="text-slate-500 text-sm">Valid Forever • Non-Transferable</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-mono">ID: L0V3-Y0U-F0R3V3R</p>

                <button onClick={closeGift} className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                  Redeem Now
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Song "Modal" / Visualizer overlay */}
        {activeGift === 'song' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-20 pointer-events-none">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/80 backdrop-blur-md text-white px-8 py-4 rounded-full flex items-center gap-4 pointer-events-auto border border-white/20 shadow-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-spin-slow">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Love Song</h3>
                <p className="text-xs text-white/60">For You</p>
              </div>
              <div className="flex gap-1 h-4 items-end ml-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 16, 8, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                    className="w-1 bg-green-400 rounded-full"
                  />
                ))}
              </div>
              <button onClick={closeGift} className="ml-4 hover:bg-white/20 p-1 rounded-full text-xs">✕</button>
            </motion.div>
          </div>
        )}


        {/* Floating Hearts - Continuous Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden h-full z-0">
          {celebrationHearts.map((heart, i) => (
            <div
              key={i}
              className="absolute text-5xl opacity-30"
              style={{
                left: heart.left,
                top: heart.top,
                animation: `float ${heart.duration} ease-in-out infinite`,
                animationDelay: heart.delay
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} loop>
          <source src="/song/song.mp3" type="audio/mp3" />
        </audio>
      </div>
    );
  }

  return null;
}
