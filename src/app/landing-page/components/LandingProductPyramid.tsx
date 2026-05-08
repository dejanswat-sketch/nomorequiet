'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const tiers = [
  {
    id: 'tier-vault',
    name: 'THE VAULT',
    price: 'Free',
    subtitle: 'Write. Be reflected. Begin.',
    features: [
      'Unlimited journaling in any language',
      'Voice-to-text input',
      'AI Mirroring after every entry (80 words)',
      'Public light map access',
      'Crisis protocol always active',
    ],
    cta: 'Begin Writing',
    href: '/sign-up-login-screen',
    width: 'w-full',
    highlight: false,
    tier: 'base',
  },
  {
    id: 'tier-light',
    name: 'LIGHT',
    price: '1 €',
    subtitle: 'Your point on the pyramid. Forever.',
    features: [
      'One light on the global map',
      'Position on the 3D pyramid mesh',
      'Anonymous fragment attached',
      'Coordinates sent to you',
      'Annual fragment update invitation',
    ],
    cta: 'Light a Point',
    href: '/sign-up-login-screen',
    width: 'w-5/6',
    highlight: false,
    tier: 'light',
  },
  {
    id: 'tier-insight',
    name: 'DEEP INSIGHT',
    price: '10 €',
    subtitle: '5-dimensional AI soul analysis',
    features: [
      'Linguistic imprint analysis',
      'Emotional frequency mapping',
      'Jungian archetype detection',
      'Shadow topic identification',
      'Metaphorical bridge synthesis',
      '600–800 word report in your language',
    ],
    cta: 'Receive Your Analysis',
    href: '/sign-up-login-screen',
    width: 'w-4/6',
    highlight: false,
    tier: 'insight',
  },
  {
    id: 'tier-companion',
    name: 'COMPANION',
    price: '4.99 €',
    priceSuffix: '/month',
    subtitle: 'Full AI depth + Portal + private map',
    features: [
      'Extended AI reflection (200+ words)',
      'AI Portal — 5-round guided journey',
      'Certificate of Exit after Portal',
      'Personal Arc page (emotion timeline)',
      'Seasonal ritual access (4×/year)',
      'AI memory across sessions',
      'Builder light on pyramid',
    ],
    cta: 'Stay in the House',
    href: '/sign-up-login-screen',
    width: 'w-3/6',
    highlight: true,
    tier: 'companion',
  },
  {
    id: 'tier-deepread',
    name: 'THE DEEP READ',
    price: '49 €',
    subtitle: 'A human reads everything. You write back.',
    features: [
      'Admin reads all your entries',
      'AI Soul Profile Brief prepared',
      '400+ word personal response',
      'Delivered in your language',
      'Within 48–72 hours',
      'Maximum 5 per week',
    ],
    cta: 'Request a Reading',
    href: '/sign-up-login-screen',
    width: 'w-2/6',
    highlight: false,
    tier: 'deepread',
  },
];

export default function LandingProductPyramid() {
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
      { threshold: 0.1 }
    );
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 bg-deep-earth/50 border-y border-amber/8" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="nmq-label mb-4" style={{ letterSpacing: '0.28em' }}>
            THE PYRAMID OF OFFERINGS
          </p>
          <h2 className="nmq-heading text-3xl md:text-4xl italic text-gold">
            Begin where you are.
          </h2>
          <p className="nmq-body text-mist mt-4 text-base">
            The House is free. Everything else is a deeper room.
          </p>
        </div>

        {/* Pyramid layout — bottom to top visually = base to apex */}
        <div className="flex flex-col items-center gap-3">
          {/* Apex first in reading order = top visually */}
          {[...tiers]?.reverse()?.map((tier, i) => (
            <div
              key={tier?.id}
              className={`${tier?.width} max-w-full transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`nmq-card p-6 md:p-8 text-center group hover:bg-void/80 transition-all duration-300 ${
                  tier?.highlight
                    ? 'border-amber/40 bg-amber/5' :''
                }`}
              >
                {tier?.highlight && (
                  <p
                    className="nmq-label mb-2"
                    style={{ fontSize: '0.5rem', color: '#c8822a', letterSpacing: '0.3em' }}
                  >
                    MOST CHOSEN
                  </p>
                )}
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="nmq-heading text-2xl md:text-3xl italic text-gold">
                    {tier?.price}
                  </span>
                  {tier?.priceSuffix && (
                    <span className="nmq-label text-mist">{tier?.priceSuffix}</span>
                  )}
                </div>
                <p className="nmq-label mb-2" style={{ color: '#c8822a' }}>
                  {tier?.name}
                </p>
                <p className="font-cormorant italic text-mist text-sm mb-5">
                  {tier?.subtitle}
                </p>
                <ul className="flex flex-col gap-1.5 mb-6 text-left max-w-xs mx-auto">
                  {tier?.features?.map((feat, fi) => (
                    <li key={`${tier?.id}-feat-${fi}`} className="flex items-start gap-2">
                      <span className="text-amber mt-1 flex-shrink-0" style={{ fontSize: '8px' }}>▲</span>
                      <span className="font-cormorant font-light text-cream/70 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier?.href}
                  className={`inline-block transition-all duration-200 ${
                    tier?.highlight
                      ? 'amber-btn px-8 py-3' :'ghost-btn px-8 py-3'
                  }`}
                >
                  {tier?.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pyramid tip label */}
        <div className="text-center mt-4">
          <div className="flex justify-center mb-2">
            <span className="light-dot light-dot-founding pulse-amber" />
          </div>
          <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            THE APEX · THE DEEP READ
          </p>
        </div>
      </div>
    </section>
  );
}