'use client';

import React, { useEffect, useRef, useState } from 'react';

const nodeStats = [
  { id: 'node-rtanj', name: 'Rtanj', label: 'THE HOUSE', count: 847, coords: '43°46′N · 21°50′E', color: '#D4AF37' },
  { id: 'node-sedona', name: 'Sedona', label: 'THE VORTEX', count: 213, coords: '34°52′N · 111°47′W', color: '#c8822a' },
  { id: 'node-kailash', name: 'Kailash', label: 'THE CROWN', count: 156, coords: '31°04′N · 81°18′E', color: '#a89880' },
  { id: 'node-shasta', name: 'Shasta', label: 'THE SOURCE', count: 189, coords: '41°24′N · 122°11′W', color: '#a89880' },
  { id: 'node-glastonbury', name: 'Glastonbury', label: 'THE TOR', count: 174, coords: '51°08′N · 2°42′W', color: '#a89880' },
  { id: 'node-machu', name: 'Machu Picchu', label: 'THE CROSSING', count: 142, coords: '13°09′S · 72°32′W', color: '#a89880' },
  { id: 'node-esvedra', name: 'Es Vedrà', label: 'THE MAGNET', count: 126, coords: '38°52′N · 1°12′E', color: '#a89880' },
];

export default function LandingLightCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-20 px-6 border-y border-amber/10" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="nmq-label mb-4" style={{ letterSpacing: '0.28em' }}>
            THE GLOBAL NEXUS
          </p>
          <h2 className="nmq-heading text-3xl md:text-4xl italic">
            Seven nodes. One House.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-amber/8">
          {nodeStats?.map((node, i) => (
            <div
              key={node?.id}
              className={`bg-void p-6 text-center transition-all duration-700 hover:bg-deep-earth cursor-default ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-center mb-3">
                <span
                  className="light-dot"
                  style={{
                    background: node?.color,
                    boxShadow: `0 0 8px ${node?.color}cc, 0 0 16px ${node?.color}66`,
                    animation: i === 0 ? 'pulseAmber 2s ease-in-out infinite' : `pulseAmber ${3 + i}s ease-in-out infinite`,
                  }}
                />
              </div>
              <p className="nmq-label mb-1" style={{ fontSize: '0.5rem', color: node?.color }}>
                {node?.label}
              </p>
              <p
                className="font-cormorant font-light tabular-nums mb-1"
                style={{ fontSize: '1.75rem', color: node?.color, lineHeight: 1.1 }}
              >
                {node?.count?.toLocaleString()}
              </p>
              <p className="font-cormorant font-light text-mist text-sm">{node?.name}</p>
              <p className="nmq-label mt-1" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                {node?.coords}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-500 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="nmq-body text-mist text-base">
            <span className="text-gold font-cormorant font-light text-2xl tabular-nums">1,847</span>
            {' '}lights burning across the pyramid · {' '}
            <span className="text-amber">1,000</span> founding lights sealed
          </p>
        </div>
      </div>
    </section>
  );
}