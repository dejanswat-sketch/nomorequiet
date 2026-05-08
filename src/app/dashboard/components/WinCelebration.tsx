'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WinCelebrationProps {
  storyTitle: string;
  onDismiss: () => void;
}

export default function WinCelebration({ storyTitle, onDismiss }: WinCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const animRef = useRef<number>(0);

  // Fade in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Gold particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; alpha: number;
      decay: number; color: string;
    }

    const colors = ['#FFD700', '#D4AF37', '#FFF8DC', '#c8822a', '#FFFACD'];
    const particles: Particle[] = [];

    // Burst from center
    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 4;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        size: 2 + Math.random() * 4,
        alpha: 0.9 + Math.random() * 0.1,
        decay: 0.008 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Rain from top
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.5 + Math.random() * 3,
        size: 1.5 + Math.random() * 3,
        alpha: 0.7 + Math.random() * 0.3,
        decay: 0.004 + Math.random() * 0.006,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.alpha <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.alpha -= p.decay;
      }
      if (alive) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'rgba(8,6,4,0.88)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-8 py-12 max-w-lg mx-4"
        style={{
          background: 'rgba(18,14,10,0.92)',
          border: '1px solid rgba(212,175,55,0.5)',
          boxShadow: '0 0 60px rgba(212,175,55,0.25), 0 0 120px rgba(212,175,55,0.1)',
        }}
      >
        {/* Gold sigil */}
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
              border: '1px solid rgba(212,175,55,0.4)',
              boxShadow: '0 0 30px rgba(212,175,55,0.4)',
            }}
          >
            <span style={{ fontSize: '2rem' }}>✦</span>
          </div>
        </div>

        <p
          className="nmq-label mb-3"
          style={{ fontSize: '0.5rem', color: '#D4AF37', letterSpacing: '0.3em' }}
        >
          THE MOUNTAIN HAS SPOKEN
        </p>

        <h2
          className="font-cormorant italic mb-4"
          style={{ fontSize: '2rem', color: '#FFD700', lineHeight: 1.2 }}
        >
          Winner of the Week
        </h2>

        <p
          className="font-cormorant italic mb-2"
          style={{ fontSize: '1.1rem', color: 'rgba(232,224,208,0.7)' }}
        >
          Your story has been anointed:
        </p>

        <p
          className="font-cormorant italic mb-8"
          style={{
            fontSize: '1.35rem',
            color: '#D4AF37',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}
        >
          "{storyTitle}"
        </p>

        <p
          className="font-cormorant italic mb-8"
          style={{ fontSize: '0.95rem', color: 'rgba(232,224,208,0.5)', lineHeight: 1.7 }}
        >
          Tvoja tišina je postala svetlost.<br />
          Your silence has become light.
        </p>

        <button
          onClick={handleDismiss}
          className="amber-btn px-8 py-3 text-sm"
          style={{ letterSpacing: '0.15em' }}
        >
          RECEIVE THIS HONOR
        </button>
      </div>
    </div>
  );
}
