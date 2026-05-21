'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const nodes = [
  { id: 'prev-rtanj', name: 'Rtanj', label: 'THE HOUSE', x: 53.5, y: 36, count: 847, founding: true },
  { id: 'prev-sedona', name: 'Sedona', label: 'THE VORTEX', x: 14, y: 40, count: 213, founding: false },
  { id: 'prev-kailash', name: 'Kailash', label: 'THE CROWN', x: 70, y: 38, count: 156, founding: false },
  { id: 'prev-shasta', name: 'Shasta', label: 'THE SOURCE', x: 10, y: 32, count: 189, founding: false },
  { id: 'prev-glastonbury', name: 'Glastonbury', label: 'THE TOR', x: 46, y: 24, count: 174, founding: false },
  { id: 'prev-machu', name: 'Machu Picchu', label: 'THE CROSSING', x: 22, y: 62, count: 142, founding: false },
  { id: 'prev-esvedra', name: 'Es Vedrà', label: 'THE MAGNET', x: 49, y: 40, count: 126, founding: false },
];

export default function LandingMapPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rtanj = nodes.find((n) => n.id === 'prev-rtanj')!;

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="nmq-label mb-4" style={{ letterSpacing: '0.28em' }}>
            THE MAP OF LIGHTS
          </p>
          <h2 className="nmq-heading text-3xl md:text-4xl italic text-gold">
            Every light is a person who wrote.
          </h2>
        </div>

        {/* Map preview */}
        <div
          className={`relative nmq-card overflow-hidden transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ height: 'min(420px, 55vh)', minHeight: '260px', background: '#0d0b08' }}
        >
          {/* SVG map */}
          <svg
            viewBox="0 0 100 80"
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.3 }}
            aria-hidden="true"
          >
            {/* Simplified world outline */}
            <path
              d="M10,25 Q20,20 30,22 Q40,18 50,20 Q60,17 70,22 Q80,20 90,25 L92,55 Q80,60 70,58 Q60,62 50,60 Q40,62 30,58 Q20,60 10,55 Z"
              fill="none"
              stroke="rgba(200,130,42,0.2)"
              strokeWidth="0.3"
            />
            {/* Ley lines from all nodes to Rtanj */}
            {nodes.filter(n => n.id !== 'prev-rtanj').map((node) => (
              <line
                key={`ley-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={rtanj.x}
                y2={rtanj.y}
                stroke="rgba(200,130,42,0.12)"
                strokeWidth="0.3"
                strokeDasharray="1.5 3"
                className="ley-line"
              />
            ))}
          </svg>

          {/* Node dots */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer ring */}
              <div
                className={`absolute rounded-full border transition-all duration-300 ${
                  hoveredNode === node.id ? 'opacity-100 scale-150' : 'opacity-30'
                }`}
                style={{
                  width: node.founding ? '24px' : '16px',
                  height: node.founding ? '24px' : '16px',
                  borderColor: node.founding ? '#D4AF37' : '#c8822a',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              {/* Core dot */}
              <div
                style={{
                  width: node.founding ? '8px' : '5px',
                  height: node.founding ? '8px' : '5px',
                  borderRadius: '50%',
                  background: node.founding ? '#D4AF37' : '#c8822a',
                  boxShadow: node.founding
                    ? '0 0 12px rgba(212,175,55,0.9), 0 0 24px rgba(212,175,55,0.5)'
                    : '0 0 6px rgba(200,130,42,0.8)',
                  animation: 'pulseAmber 3s ease-in-out infinite',
                }}
              />

              {/* Tooltip */}
              {hoveredNode === node.id && (
                <div
                  className="absolute z-10 nmq-card p-3 whitespace-nowrap pointer-events-none"
                  style={{
                    bottom: '130%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: '120px',
                  }}
                >
                  <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
                    {node.label}
                  </p>
                  <p className="font-cormorant font-light text-cream text-sm">{node.name}</p>
                  <p className="nmq-label mt-1" style={{ fontSize: '0.45rem' }}>
                    {node.count} lights
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Overlay gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,8,6,0.8) 100%)',
            }}
          />

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p
              className="nmq-label text-silence text-center"
              style={{ fontSize: '0.5rem', letterSpacing: '0.4em' }}
            >
              ALL PATHS LEAD TO RTANJ
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/map-of-lights" className="ghost-btn px-10 py-3">
            Open the Full Map of Lights
          </Link>
        </div>
      </div>
    </section>
  );
}