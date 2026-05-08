'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStripeCheckout } from '@/lib/hooks/useStripeCheckout';
import { useAuth } from '@/contexts/AuthContext';

export type StarMagnitude = 'iskra' | 'svetlost' | 'svemir';

export interface StarTier {
  id: StarMagnitude;
  name: string;
  subtitle: string;
  priceRange: string;
  priceNote: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
  dotSize: number;
  dotColor: string;
  dotGlow: string;
  pulse: boolean;
  halo: boolean;
  defaultAmountCents: number;
}

const STAR_TIERS: StarTier[] = [
  {
    id: 'iskra',
    name: 'SPARK',
    subtitle: 'Spark',
    priceRange: '$1 – $5',
    priceNote: 'One-time',
    description: 'A small, white light placed on the pyramid. Quiet. Present. Yours.',
    features: [
      'Standard white particle on the pyramid',
      'Anonymous fragment attached',
      'Permanent position on the map',
      'Coordinates sent to you',
    ],
    cta: 'Place Your Spark',
    href: '/sign-up-login-screen',
    highlight: false,
    dotSize: 5,
    dotColor: '#e8e0d0',
    dotGlow: '0 0 6px rgba(232,224,208,0.9), 0 0 12px rgba(232,224,208,0.4)',
    pulse: false,
    halo: false,
    defaultAmountCents: 300,
  },
  {
    id: 'svetlost',
    name: 'LIGHT',
    subtitle: 'Light',
    priceRange: '$10 – $20',
    priceNote: 'One-time',
    description: 'A larger presence. Visible from across the pyramid. It breathes.',
    features: [
      'Larger amber particle — visible at distance',
      'Gentle pulse animation',
      'Fragment displayed in node detail',
      'Permanent position on the map',
      'Coordinates sent to you',
    ],
    cta: 'Place Your Light',
    href: '/sign-up-login-screen',
    highlight: true,
    dotSize: 8,
    dotColor: '#c8822a',
    dotGlow: '0 0 10px rgba(200,130,42,0.9), 0 0 20px rgba(200,130,42,0.5)',
    pulse: true,
    halo: false,
    defaultAmountCents: 1500,
  },
  {
    id: 'svemir',
    name: 'UNIVERSE',
    subtitle: 'Universe',
    priceRange: '$50+',
    priceNote: 'One-time',
    description: 'A dominant gold star. It has a halo. It is seen from everywhere in the pyramid.',
    features: [
      'Large gold particle — dominant presence',
      'Visible halo glow that distinguishes it from all others',
      'Named fragment displayed prominently',
      'Permanent apex-tier position',
      'Coordinates + certificate sent to you',
      'Annual invitation to update your fragment',
    ],
    cta: 'Claim Your Universe',
    href: '/sign-up-login-screen',
    highlight: false,
    dotSize: 13,
    dotColor: '#D4AF37',
    dotGlow: '0 0 16px rgba(212,175,55,1), 0 0 32px rgba(212,175,55,0.6), 0 0 48px rgba(212,175,55,0.2)',
    pulse: true,
    halo: true,
    defaultAmountCents: 5000,
  },
];

function StarDot({ tier, animate }: { tier: StarTier; animate: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      {/* Halo ring — Svemir only */}
      {tier.halo && (
        <>
          <div
            className="absolute rounded-full"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0) 70%)',
              animation: animate ? 'svemirHalo 3s ease-in-out infinite' : 'none',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid rgba(212,175,55,0.35)',
              animation: animate ? 'svemirRing 3s ease-in-out infinite' : 'none',
            }}
          />
        </>
      )}
      {/* Core dot */}
      <div
        style={{
          width: tier.dotSize,
          height: tier.dotSize,
          borderRadius: '50%',
          background: tier.dotColor,
          boxShadow: tier.dotGlow,
          animation: animate && tier.pulse ? 'pulseAmber 2.5s ease-in-out infinite' : 'none',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      />
    </div>
  );
}

interface TierCTAProps {
  tier: StarTier;
  isAuthenticated: boolean;
  onCheckout: (magnitude: StarMagnitude, amountCents: number) => void;
  loading: boolean;
  activeId: StarMagnitude | null;
}

function TierCTA({ tier, isAuthenticated, onCheckout, loading, activeId }: TierCTAProps) {
  const isLoading = loading && activeId === tier.id;

  if (!isAuthenticated) {
    return (
      <Link
        href={`/sign-up-login-screen?redirect=checkout&product=light&magnitude=${tier.id}`}
        className={`inline-block w-full transition-all duration-200 text-center ${
          tier.highlight || tier.id === 'svemir' ? 'amber-btn px-6 py-3' : 'ghost-btn px-6 py-3'
        }`}
      >
        {tier.cta}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onCheckout(tier.id, tier.defaultAmountCents)}
      disabled={loading}
      className={`w-full transition-all duration-200 text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
        tier.highlight || tier.id === 'svemir' ? 'amber-btn px-6 py-3' : 'ghost-btn px-6 py-3'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full border border-current border-t-transparent animate-spin"
          />
          Redirecting...
        </span>
      ) : (
        tier.cta
      )}
    </button>
  );
}

export default function LandingStarTiers() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<StarMagnitude | null>(null);
  const { user } = useAuth();
  const { checkout, loading, error, clearError } = useStripeCheckout();

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

  const handleCheckout = async (magnitude: StarMagnitude, amountCents: number) => {
    clearError();
    setActiveId(magnitude);
    await checkout({ product: 'light', magnitude, amountCents });
    setActiveId(null);
  };

  const isCardDecline = error?.type === 'card_declined';
  const isNetworkError = error?.type === 'network';
  const isAuthError = error?.type === 'auth';

  return (
    <section
      ref={ref}
      id="place-your-light"
      className="py-24 px-6 border-b border-amber/8"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 60%)' }}
    >
      <style>{`
        @keyframes svemirHalo {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes svemirRing {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="nmq-label mb-4" style={{ letterSpacing: '0.28em' }}>
            PLACE YOUR LIGHT
          </p>
          <h2 className="nmq-heading text-3xl md:text-4xl italic text-gold">
            One transaction. Choose your magnitude.
          </h2>
          <p className="nmq-body text-mist mt-4 text-base max-w-xl mx-auto">
            A larger donation places a larger star. One star. Yours. Forever on the pyramid.
          </p>
        </div>

        {/* Checkout Error Banner */}
        {error && (
          <div
            className="mb-8 rounded border px-5 py-4 flex items-start gap-4"
            style={{
              animation: 'fadeInDown 0.3s ease-out',
              background: isCardDecline
                ? 'rgba(180, 60, 60, 0.08)'
                : isNetworkError
                ? 'rgba(180, 120, 40, 0.08)'
                : 'rgba(100, 80, 60, 0.08)',
              borderColor: isCardDecline
                ? 'rgba(200, 80, 80, 0.3)'
                : isNetworkError
                ? 'rgba(200, 140, 60, 0.3)'
                : 'rgba(140, 120, 100, 0.3)',
            }}
          >
            {/* Icon */}
            <span
              className="flex-shrink-0 mt-0.5 text-base"
              style={{
                color: isCardDecline ? '#c85050' : isNetworkError ? '#c8822a' : '#8a7a6a',
              }}
            >
              {isCardDecline ? '✕' : isNetworkError ? '⟳' : '!'}
            </span>

            <div className="flex-1 min-w-0">
              {/* Error label */}
              <p
                className="nmq-label mb-1"
                style={{
                  fontSize: '0.5rem',
                  letterSpacing: '0.22em',
                  color: isCardDecline ? '#c85050' : isNetworkError ? '#c8822a' : '#8a7a6a',
                }}
              >
                {isCardDecline
                  ? 'PAYMENT DECLINED'
                  : isNetworkError
                  ? 'CONNECTION ERROR'
                  : isAuthError
                  ? 'AUTHENTICATION REQUIRED' :'CHECKOUT ERROR'}
              </p>

              {/* Error message */}
              <p className="font-cormorant italic text-cream/80 text-sm leading-relaxed">
                {error.message}
              </p>

              {/* Decline code hint */}
              {error.declineCode && (
                <p className="font-cormorant text-silence text-xs mt-1">
                  Decline code: <span className="text-mist/50">{error.declineCode}</span>
                </p>
              )}

              {/* Retry / action prompt */}
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                {error.retryable && !isAuthError && (
                  <button
                    onClick={() => {
                      if (activeId) {
                        const tier = STAR_TIERS.find(t => t.id === activeId);
                        if (tier) handleCheckout(tier.id, tier.defaultAmountCents);
                      } else {
                        clearError();
                      }
                    }}
                    className="font-cormorant italic text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
                    style={{ color: isNetworkError ? '#c8822a' : '#c8822a' }}
                  >
                    Try again
                  </button>
                )}
                {isCardDecline && (
                  <span className="font-cormorant italic text-silence text-xs">
                    or choose a different tier to use another card
                  </span>
                )}
                {isAuthError && (
                  <Link
                    href="/sign-up-login-screen"
                    className="font-cormorant italic text-sm underline underline-offset-2 text-amber/70 hover:text-amber transition-colors"
                  >
                    Sign in
                  </Link>
                )}
                <button
                  onClick={clearError}
                  className="font-cormorant italic text-silence text-xs hover:text-mist/50 transition-colors ml-auto"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Three tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STAR_TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className={`transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className={`nmq-card p-7 flex flex-col items-center text-center h-full group hover:bg-void/80 transition-all duration-300 relative ${
                  tier.highlight ? 'border-amber/40 bg-amber/5' : ''
                } ${tier.id === 'svemir' ? 'border-gold/30 bg-gold/3' : ''}`}
              >
                {tier.highlight && (
                  <p
                    className="nmq-label mb-3"
                    style={{ fontSize: '0.45rem', color: '#c8822a', letterSpacing: '0.3em' }}
                  >
                    MOST CHOSEN
                  </p>
                )}
                {tier.id === 'svemir' && (
                  <p
                    className="nmq-label mb-3"
                    style={{ fontSize: '0.45rem', color: '#D4AF37', letterSpacing: '0.3em' }}
                  >
                    DOMINANT PRESENCE
                  </p>
                )}

                {/* Star visual */}
                <div className="mb-5">
                  <StarDot tier={tier} animate={visible} />
                </div>

                {/* Name */}
                <p
                  className="nmq-label mb-1"
                  style={{
                    color: tier.id === 'svemir' ? '#D4AF37' : tier.id === 'svetlost' ? '#c8822a' : '#8a7a6a',
                    letterSpacing: '0.25em',
                  }}
                >
                  {tier.name}
                </p>
                <p className="font-cormorant italic text-mist/60 text-xs mb-3">
                  {tier.subtitle}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="nmq-heading text-2xl italic text-gold">{tier.priceRange}</span>
                  <p className="nmq-label text-silence mt-0.5" style={{ fontSize: '0.45rem' }}>
                    {tier.priceNote}
                  </p>
                </div>

                {/* Description */}
                <p className="font-cormorant italic text-cream/60 text-sm mb-5 leading-relaxed">
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-1.5 mb-7 text-left w-full">
                  {tier.features.map((feat, fi) => (
                    <li key={`${tier.id}-f-${fi}`} className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 mt-1"
                        style={{
                          fontSize: '7px',
                          color: tier.id === 'svemir' ? '#D4AF37' : '#c8822a',
                        }}
                      >
                        ▲
                      </span>
                      <span className="font-cormorant font-light text-cream/70 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto w-full">
                  <TierCTA
                    tier={tier}
                    isAuthenticated={!!user}
                    onCheckout={handleCheckout}
                    loading={loading}
                    activeId={activeId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-10">
          <p className="font-cormorant italic text-silence text-sm">
            Each star is permanent. One transaction. No subscriptions.
          </p>
        </div>
      </div>
    </section>
  );
}
