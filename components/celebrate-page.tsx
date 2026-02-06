'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CelebratePage() {
  const searchParams = useSearchParams();
  const yourName = searchParams.get('from');
  const crushName = searchParams.get('to');
  
  const [hearts, setHearts] = useState<Array<{ left: string, top: string, duration: string, delay: string }>>([]);

  useEffect(() => {
    setHearts([...Array(12)].map((_, i) => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      duration: `${6 + i}s`,
      delay: `${i * 0.4}s`
    })));
  }, []);

  // If no valid params, show error
  if (!yourName || !crushName) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at center, #8d4575 0%, #5c2d52 40%, #3d1f3d 70%, #241828 100%)'
      }}>
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Oops! 💔
          </h1>
          <p className="text-lg text-white/80 mb-6">
            This celebration link seems incomplete.
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-all"
          >
            Create Your Own Valentine Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'radial-gradient(ellipse at center, #8d4575 0%, #5c2d52 40%, #3d1f3d 70%, #241828 100%)',
        cursor: 'default'
      }}
    >
      {/* Soft glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at center, rgba(251, 113, 133, 0.25) 0%, rgba(236, 72, 153, 0.15) 25%, transparent 60%)',
        filter: 'blur(100px)'
      }} />
      
      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Content */}
      <div 
        className="relative z-10 text-center max-w-3xl px-6"
        style={{
          animation: 'fadeIn 1s ease-out, scaleIn 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Celebration Icon */}
        <div 
          style={{
            fontSize: 'clamp(4rem, 12vw, 6rem)',
            marginBottom: '1.5rem',
            animation: 'fadeIn 1.2s ease-out 0.3s backwards'
          }}
        >
          🎉
        </div>

        {/* Main celebration message */}
        <h1 
          style={{ 
            fontFamily: '\'Playfair Display\', serif',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: 'rgba(254, 205, 211, 0.98)',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            animation: 'fadeIn 1s ease-out 0.5s backwards'
          }}
        >
          Congratulations! 💖
        </h1>

        {/* Names announcement */}
        <div 
          style={{
            animation: 'fadeIn 1s ease-out 0.7s backwards'
          }}
        >
          <p 
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              fontWeight: '300',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}
          >
            <span style={{ 
              fontFamily: '\'Playfair Display\', serif',
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#fda4af',
              fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)'
            }}>{crushName}</span>
            {' '}said YES to{' '}
            <span style={{ 
              fontFamily: '\'Playfair Display\', serif',
              fontStyle: 'italic',
              fontWeight: '500',
              color: '#fecdd3',
              fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)'
            }}>{yourName}</span>
          </p>

          <p 
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
              fontWeight: '300',
              color: 'rgba(255, 255, 255, 0.75)',
              marginTop: '1.5rem',
              marginBottom: '2.5rem'
            }}
          >
            Best wishes to them on this special Valentine's Day! 🌹
          </p>
        </div>

        {/* Call to action */}
        <div 
          style={{
            animation: 'fadeIn 1s ease-out 1s backwards'
          }}
        >
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, rgba(250, 90, 90, 0.95) 0%, rgba(236, 72, 153, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.875rem',
              color: 'rgba(255, 255, 255, 0.98)',
              fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(250, 90, 90, 0.4)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(250, 90, 90, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(250, 90, 90, 0.4)';
            }}
          >
            Create Your Own Valentine Link 💘
          </a>
        </div>
      </div>

      {/* Floating hearts - celebration style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart, i) => (
          <div
            key={`heart-${i}`}
            className="absolute"
            style={{
              left: heart.left,
              top: heart.top,
              fontSize: `${1.5 + Math.random() * 1.5}rem`,
              animation: `float ${heart.duration} ease-in-out infinite`,
              animationDelay: heart.delay,
              opacity: 0.3,
              color: '#fda4af'
            }}
          >
            💖
          </div>
        ))}
      </div>
    </div>
  );
}
