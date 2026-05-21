'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [lightCount, setLightCount] = useState<number | null>(null);

  // Animate light count from live Supabase total (via /api/stats/lights)
  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    const runAnimation = (target: number) => {
      if (cancelled || target <= 0) {
        if (!cancelled) setLightCount(target);
        return;
      }
      const duration = 2400;
      const start = Date.now();
      const tick = () => {
        if (cancelled) return;
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setLightCount(Math.floor(eased * target));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    fetch('/api/stats/lights')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('stats fetch failed'))))
      .then((data: { total?: number }) => {
        if (cancelled) return;
        const total = typeof data.total === 'number' && data.total >= 0 ? data.total : 0;
        setTimeout(() => runAnimation(total), 600);
      })
      .catch(() => {
        if (!cancelled) setLightCount(0);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Three.js-style pyramid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2 + 20;

    // Pyramid vertices (3D → projected)
    const project = (x: number, y: number, z: number, a: number) => {
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const rx = x * cosA - z * sinA;
      const rz = x * sinA + z * cosA;
      const scale = 320 / (320 + rz);
      return {
        px: cx + rx * scale * 120,
        py: cy + (y - 10) * scale * 120,
        scale,
      };
    };

    // Pyramid base + apex
    const apex = { x: 0, y: -1.4, z: 0 };
    const base = [
      { x: -1, y: 0.6, z: -1 },
      { x: 1, y: 0.6, z: -1 },
      { x: 1, y: 0.6, z: 1 },
      { x: -1, y: 0.6, z: 1 },
    ];

    // Particles
    const particles: { x: number; y: number; z: number; life: number; speed: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1.6,
        y: 0.6 - Math.random() * 2.0,
        z: (Math.random() - 0.5) * 1.6,
        life: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      angle += 0.004;

      // Draw particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -1.4) {
          p.y = 0.6;
          p.x = (Math.random() - 0.5) * 1.6;
          p.z = (Math.random() - 0.5) * 1.6;
        }
        p.life = (p.life + 0.005) % 1;
        const proj = project(p.x, p.y, p.z, angle);
        const alpha = 0.3 + Math.sin(p.life * Math.PI) * 0.5;
        const r = 2 * proj.scale;
        const grd = ctx.createRadialGradient(proj.px, proj.py, 0, proj.px, proj.py, r * 3);
        grd.addColorStop(0, `rgba(232,160,74,${alpha})`);
        grd.addColorStop(1, 'rgba(200,130,42,0)');
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Draw faces
      const apexP = project(apex.x, apex.y, apex.z, angle);
      const baseP = base.map((v) => project(v.x, v.y, v.z, angle));

      const faces = [
        [apexP, baseP[0], baseP[1]],
        [apexP, baseP[1], baseP[2]],
        [apexP, baseP[2], baseP[3]],
        [apexP, baseP[3], baseP[0]],
      ];

      faces.forEach((face, fi) => {
        const avgZ = face.reduce((s, v) => s + v.scale, 0) / 3;
        const alpha = 0.06 + avgZ * 0.08;

        ctx.beginPath();
        ctx.moveTo(face[0].px, face[0].py);
        face.forEach((v) => ctx.lineTo(v.px, v.py));
        ctx.closePath();
        ctx.fillStyle = `rgba(200,130,42,${alpha})`;
        ctx.fill();

        // Wireframe
        ctx.beginPath();
        ctx.moveTo(face[0].px, face[0].py);
        face.forEach((v) => ctx.lineTo(v.px, v.py));
        ctx.closePath();
        ctx.strokeStyle = `rgba(212,175,55,${0.3 + fi * 0.05})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Sub-divisions
        const mid1 = {
          px: (face[0].px + face[1].px) / 2,
          py: (face[0].py + face[1].py) / 2,
        };
        const mid2 = {
          px: (face[1].px + face[2].px) / 2,
          py: (face[1].py + face[2].py) / 2,
        };
        ctx.beginPath();
        ctx.moveTo(face[0].px, face[0].py);
        ctx.lineTo(mid2.px, mid2.py);
        ctx.strokeStyle = `rgba(212,175,55,0.15)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mid1.px, mid1.py);
        ctx.lineTo(face[2].px, face[2].py);
        ctx.stroke();
      });

      // Base
      ctx.beginPath();
      baseP.forEach((v, i) => {
        if (i === 0) ctx.moveTo(v.px, v.py);
        else ctx.lineTo(v.px, v.py);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(212,175,55,0.2)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Glow at apex
      const apexGrd = ctx.createRadialGradient(apexP.px, apexP.py, 0, apexP.px, apexP.py, 30);
      apexGrd.addColorStop(0, 'rgba(212,175,55,0.3)');
      apexGrd.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.beginPath();
      ctx.arc(apexP.px, apexP.py, 30, 0, Math.PI * 2);
      ctx.fillStyle = apexGrd;
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden overflow-x-hidden px-4 sm:px-6">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(200,130,42,0.06) 0%, rgba(10,8,6,0) 70%)',
        }}
      />

      {/* Hero text */}
      <div className="relative z-10 text-center w-full max-w-3xl mx-auto">
        {/* Pyramid canvas — compact, sits above title */}
        <div className="flex justify-center mb-0 w-full" style={{ height: 'min(220px, 32vw)' }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={220}
            className="opacity-90 w-full max-w-[600px] h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
            aria-label="Animated low-poly pyramid with amber light particles drifting inside the wireframe mesh"
          />
        </div>

        <p className="nmq-label mb-6 tracking-widest" style={{ letterSpacing: '0.3em' }}>
          43°46′N · 21°50′E · RTANJ, SERBIA
        </p>
        <h1
          className="nmq-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl italic mb-6 sm:mb-8 break-words"
          style={{ lineHeight: '1.05' }}
        >
          NoMoreQuiet
        </h1>
        <p className="nmq-body text-mist text-lg md:text-xl max-w-xl mx-auto mb-3" style={{ fontStyle: 'italic' }}>
          The place where silence finally finds its voice.
        </p>
        <p className="nmq-label mb-10 text-silence">
          Not therapy. Not coaching. A House.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up-login-screen" className="amber-btn px-10 py-4 text-sm">
            Begin Writing
          </Link>
          <Link href="/map-of-lights" className="ghost-btn px-10 py-4">
            See the Map of Lights
          </Link>
        </div>

        {/* Live counter */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="light-dot pulse-amber" />
          <span className="nmq-label text-mist">
            <span className="text-amber tabular-nums font-cormorant font-light text-xl" style={{ letterSpacing: '0.05em' }}>
              {lightCount === null ? '—' : lightCount.toLocaleString()}
            </span>
            {' '}lights burning on the pyramid
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-amber to-transparent" />
        <p className="nmq-label" style={{ fontSize: '0.55rem' }}>SCROLL</p>
      </div>
    </section>
  );
}