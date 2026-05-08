'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AppNav from '@/components/AppNav';

interface TierState {
  userTier: string | null;
  loading: boolean;
  user: { id: string; email: string } | null;
}

interface DeepReadLimit {
  available: number;
  soldOut: boolean;
  loading: boolean;
}

const TIER_HIERARCHY = ['free', 'light', 'deep_read', 'deep_insight', 'companion'];

function hasTier(userTier: string | null, required: string): boolean {
  if (!userTier) return false;
  return TIER_HIERARCHY.indexOf(userTier) >= TIER_HIERARCHY.indexOf(required);
}

export default function PricingPage() {
  const router = useRouter();
  const [tierState, setTierState] = useState<TierState>({ userTier: null, loading: true, user: null });
  const [deepReadLimit, setDeepReadLimit] = useState<DeepReadLimit>({ available: 5, soldOut: false, loading: true });
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTierState({ userTier: null, loading: false, user: null });
        return;
      }
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_tier')
        .eq('id', user.id)
        .single();
      setTierState({
        userTier: profile?.user_tier || 'free',
        loading: false,
        user: { id: user.id, email: user.email || '' },
      });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const res = await fetch('/api/deep-read/weekly-limit');
        if (res.ok) {
          const data = await res.json();
          setDeepReadLimit({ available: data.available, soldOut: data.soldOut, loading: false });
        } else {
          setDeepReadLimit({ available: 5, soldOut: false, loading: false });
        }
      } catch {
        setDeepReadLimit({ available: 5, soldOut: false, loading: false });
      }
    };
    fetchLimit();
  }, []);

  const handleCheckout = async (product: string) => {
    if (!tierState.user) {
      router.push('/sign-up-login-screen');
      return;
    }
    setCheckingOut(product);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setCheckingOut(null);
    }
  };

  const isActive = (tier: string) => tierState.userTier === tier;
  const isOwned = (tier: string) => hasTier(tierState.userTier, tier);

  return (
    <>
      <style>{`
        @keyframes shimmerGold {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseRing {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tier-card {
          background: rgba(10, 8, 6, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 2px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .tier-card:hover {
          border-color: rgba(212, 175, 55, 0.28);
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.06);
        }
        .tier-card.featured {
          border-color: rgba(212, 175, 55, 0.35);
          box-shadow: 0 0 60px rgba(212, 175, 55, 0.1);
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #D4AF37 0%, #f5e17a 40%, #D4AF37 60%, #b8941f 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 3s linear infinite;
        }
        .tier-btn {
          width: 100%;
          padding: 12px 24px;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          border: 1px solid rgba(212, 175, 55, 0.4);
          background: transparent;
          color: #D4AF37;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tier-btn:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.7);
        }
        .tier-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .tier-btn.owned {
          border-color: rgba(212, 175, 55, 0.2);
          color: rgba(212, 175, 55, 0.5);
          cursor: default;
        }
        .tier-btn.primary {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.6);
        }
        .tier-btn.primary:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.25);
        }
        .feature-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.6);
          flex-shrink: 0;
          margin-top: 7px;
        }
        .active-badge {
          display: inline-block;
          padding: 2px 10px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          font-size: 0.45rem;
          letter-spacing: 0.25em;
          color: #D4AF37;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .price-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 300;
          font-style: italic;
          color: #D4AF37;
          line-height: 1;
        }
        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent);
          margin: 20px 0;
        }
        .sold-out-badge {
          display: inline-block;
          padding: 2px 10px;
          border: 1px solid rgba(200, 60, 60, 0.4);
          font-size: 0.45rem;
          letter-spacing: 0.25em;
          color: rgba(200, 60, 60, 0.8);
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(30,20,5,0.9) 0%, #0a0806 60%)',
        }}
      >
        <AppNav variant="transparent" />

        <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
          {/* Header */}
          <div className="text-center mb-16" style={{ animation: 'floatUp 0.8s ease-out both' }}>
            <p className="nmq-label mb-4" style={{ letterSpacing: '0.35em', fontSize: '0.5rem' }}>
              NOMOREQUIET · TIERS OF PRESENCE
            </p>
            <h1 className="font-cormorant font-light italic text-4xl md:text-5xl text-cream mb-5" style={{ letterSpacing: '0.04em' }}>
              Choose your depth.
            </h1>
            <p className="font-cormorant italic text-mist/60 text-lg max-w-xl mx-auto leading-relaxed">
              Every tier is a different relationship with the work. None is better. Each is honest.
            </p>
          </div>

          {/* Tier Grid — asymmetric bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* FREE — The Vault (spans 4 cols) */}
            <div className="md:col-span-4 tier-card p-7" style={{ animation: 'floatUp 0.6s ease-out 0.1s both' }}>
              <div className="flex items-start justify-between mb-1">
                <p className="nmq-label" style={{ fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.5)' }}>
                  FREE
                </p>
                {isActive('free') && <span className="active-badge">Current</span>}
              </div>
              <h2 className="font-cormorant font-light text-2xl text-cream mb-1">The Vault</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="price-num text-3xl">0</span>
                <span className="font-cormorant italic text-mist/50 text-sm">forever</span>
              </div>
              <div className="divider-line" />
              <ul className="space-y-3 mb-6">
                {[
                  'Journal writing — unlimited entries',
                  'AI Mirroring — up to 80 words per reflection',
                  'Crisis Protocol — always active',
                  'Map of Lights — view only',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <div className="feature-dot" />
                    <span className="font-cormorant text-mist/70 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className="tier-btn owned"
                disabled
              >
                {tierState.user ? 'Always included' : 'Start free'}
              </button>
            </div>

            {/* COMPANION — featured (spans 8 cols, taller) */}
            <div className="md:col-span-8 tier-card featured p-7 relative overflow-hidden" style={{ animation: 'floatUp 0.6s ease-out 0.2s both' }}>
              {/* Subtle background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.05) 0%, transparent 60%)',
                }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-1">
                  <p className="nmq-label" style={{ fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.7)' }}>
                    COMPANION · SUBSCRIPTION
                  </p>
                  {isActive('companion') && <span className="active-badge">Active</span>}
                </div>
                <h2 className="font-cormorant font-light text-3xl text-cream mb-1">
                  <span className="gold-shimmer">Companion</span>
                </h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="price-num text-4xl">4.99</span>
                  <span className="font-cormorant italic text-mist/50 text-sm">€ / month</span>
                </div>
                <div className="divider-line" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[
                    'AI Memory — Gemini remembers your previous sessions',
                    'Personal Arc — visual emotional timeline',
                    'Full 5-round Portal — unlimited sessions',
                    'Priority access to new features',
                    'Deeper AI reflections — no word limit',
                    'Cancel anytime',
                  ].map((f) => (
                    <div key={f} className="flex gap-3">
                      <div className="feature-dot" style={{ background: 'rgba(212,175,55,0.8)' }} />
                      <span className="font-cormorant text-cream/80 text-sm leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
                {isOwned('companion') ? (
                  <button className="tier-btn owned" disabled>Active subscription</button>
                ) : (
                  <button
                    className="tier-btn primary"
                    onClick={() => handleCheckout('companion')}
                    disabled={checkingOut === 'companion'}
                  >
                    {checkingOut === 'companion' ? 'Opening…' : 'Begin Companion — €4.99 / month'}
                  </button>
                )}
              </div>
            </div>

            {/* LIGHT — 1€ (spans 3 cols) */}
            <div className="md:col-span-3 tier-card p-7" style={{ animation: 'floatUp 0.6s ease-out 0.3s both' }}>
              <div className="flex items-start justify-between mb-1">
                <p className="nmq-label" style={{ fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.5)' }}>
                  LIGHT · ONE-TIME
                </p>
                {isActive('light') && <span className="active-badge">Owned</span>}
              </div>
              <h2 className="font-cormorant font-light text-2xl text-cream mb-1">Light</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="price-num text-3xl">1</span>
                <span className="font-cormorant italic text-mist/50 text-sm">€</span>
              </div>
              <div className="divider-line" />
              <ul className="space-y-3 mb-6">
                {[
                  'Your star on the pyramid',
                  'Coordinate email with your exact point',
                  'Permanent placement on Map of Lights',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <div className="feature-dot" />
                    <span className="font-cormorant text-mist/70 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              {isOwned('light') ? (
                <button className="tier-btn owned" disabled>Light placed</button>
              ) : (
                <button
                  className="tier-btn"
                  onClick={() => router.push('/landing-page#place-your-light')}
                  disabled={checkingOut === 'light'}
                >
                  Place your light
                </button>
              )}
            </div>

            {/* DEEP INSIGHT — 10€ (spans 4 cols) */}
            <div className="md:col-span-4 tier-card p-7" style={{ animation: 'floatUp 0.6s ease-out 0.35s both' }}>
              <div className="flex items-start justify-between mb-1">
                <p className="nmq-label" style={{ fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.5)' }}>
                  DEEP INSIGHT · ONE-TIME
                </p>
                {isOwned('deep_insight') && <span className="active-badge">Delivered</span>}
              </div>
              <h2 className="font-cormorant font-light text-2xl text-cream mb-1">Deep Insight</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="price-num text-3xl">10</span>
                <span className="font-cormorant italic text-mist/50 text-sm">€ · instant</span>
              </div>
              <div className="divider-line" />
              <ul className="space-y-3 mb-6">
                {[
                  'Jungian AI Soul Analysis — 600–800 words',
                  'Dominant archetype identification',
                  'Shadow topic mapping',
                  'The unlived life — what you circle but avoid',
                  'Instant delivery after payment',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <div className="feature-dot" />
                    <span className="font-cormorant text-mist/70 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              {isOwned('deep_insight') ? (
                <button className="tier-btn owned" disabled>Report delivered</button>
              ) : (
                <button
                  className="tier-btn"
                  onClick={() => handleCheckout('deep_insight')}
                  disabled={checkingOut === 'deep_insight'}
                >
                  {checkingOut === 'deep_insight' ? 'Opening…' : 'Get Soul Analysis — €10'}
                </button>
              )}
            </div>

            {/* DEEP READ — 49€ (spans 5 cols) */}
            <div className="md:col-span-5 tier-card p-7 relative" style={{ animation: 'floatUp 0.6s ease-out 0.4s both' }}>
              <div className="flex items-start justify-between mb-1">
                <p className="nmq-label" style={{ fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.5)' }}>
                  THE DEEP READ · HUMAN ANALYSIS
                </p>
                <div className="flex gap-2 items-center">
                  {isOwned('deep_read') && <span className="active-badge">In Processing</span>}
                  {!deepReadLimit.loading && deepReadLimit.soldOut && !isOwned('deep_read') && (
                    <span className="sold-out-badge">Sold out this week</span>
                  )}
                  {!deepReadLimit.loading && !deepReadLimit.soldOut && !isOwned('deep_read') && (
                    <span className="active-badge" style={{ color: 'rgba(212,175,55,0.6)' }}>
                      {deepReadLimit.available} left this week
                    </span>
                  )}
                </div>
              </div>
              <h2 className="font-cormorant font-light text-2xl text-cream mb-1">The Deep Read</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="price-num text-3xl">49</span>
                <span className="font-cormorant italic text-mist/50 text-sm">€ · 48–72h</span>
              </div>
              <div className="divider-line" />
              <ul className="space-y-3 mb-4">
                {[
                  'A human reads your entries — not an algorithm',
                  'Personal written response from the NMQ team',
                  'Delivered within 48–72 hours',
                  'Limited to 5 per week site-wide',
                  'Status visible in your Vault during processing',
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <div className="feature-dot" />
                    <span className="font-cormorant text-mist/70 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <p className="font-cormorant italic text-mist/40 text-xs mb-5 leading-relaxed">
                This is not AI. A person will read what you wrote and respond with care.
              </p>
              {isOwned('deep_read') ? (
                <button className="tier-btn owned" disabled>In processing — 48–72h</button>
              ) : deepReadLimit.soldOut ? (
                <button className="tier-btn" disabled>
                  Available again next week
                </button>
              ) : (
                <button
                  className="tier-btn"
                  onClick={() => handleCheckout('deep_read')}
                  disabled={checkingOut === 'deep_read'}
                >
                  {checkingOut === 'deep_read' ? 'Opening…' : 'Request Deep Read — €49'}
                </button>
              )}
            </div>

          </div>

          {/* Footer note */}
          <div className="mt-16 text-center">
            <div className="divider-line max-w-xs mx-auto" />
            <p className="font-cormorant italic text-mist/30 text-sm mt-6 leading-relaxed">
              All payments processed securely via Stripe. Companion subscription can be canceled anytime from Settings.
            </p>
            {!tierState.user && (
              <p className="font-cormorant italic text-mist/40 text-sm mt-3">
                <Link href="/sign-up-login-screen" className="text-amber/60 hover:text-amber transition-colors">
                  Sign in
                </Link>
                {' '}to purchase or manage your tier.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
