'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { trackPurchaseSuccess, trackLightCreated } from '@/lib/analytics';

const MAGNITUDE_LABELS: Record<string, string> = {
  iskra: 'ISKRA — Spark',
  svetlost: 'SVETLOST — Light',
  svemir: 'SVEMIR — Universe',
};

const MAGNITUDE_COLORS: Record<string, string> = {
  iskra: '#e8e0d0',
  svetlost: '#c8822a',
  svemir: '#D4AF37',
};

const MAGNITUDE_GLOW: Record<string, string> = {
  iskra: '0 0 8px rgba(232,224,208,0.9), 0 0 16px rgba(232,224,208,0.4)',
  svetlost: '0 0 10px rgba(200,130,42,0.9), 0 0 20px rgba(200,130,42,0.5)',
  svemir: '0 0 16px rgba(212,175,55,1), 0 0 32px rgba(212,175,55,0.6), 0 0 48px rgba(212,175,55,0.2)',
};

const MAGNITUDE_DOT_SIZE: Record<string, number> = {
  iskra: 8,
  svetlost: 12,
  svemir: 18,
};

type ConfirmState = 'waiting' | 'confirmed' | 'timeout';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product') || 'light';
  const magnitude = searchParams.get('magnitude') || 'iskra';
  const fragment = searchParams.get('fragment') || '';
  const sessionId = searchParams.get('session_id') || '';

  const [visible, setVisible] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>('waiting');

  const isLight = product === 'light';
  const dotColor = MAGNITUDE_COLORS[magnitude] || '#D4AF37';
  const dotGlow = MAGNITUDE_GLOW[magnitude] || MAGNITUDE_GLOW.svemir;
  const dotSize = MAGNITUDE_DOT_SIZE[magnitude] || 12;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Track purchase success on mount
  useEffect(() => {
    trackPurchaseSuccess({ product, magnitude, sessionId });
    if (isLight) {
      trackLightCreated({ magnitude, nodeId: '', sessionId });
    }
  }, [isLight, sessionId]);

  // Subscribe to real-time broadcast to confirm light was placed on the map
  useEffect(() => {
    if (!isLight || !sessionId) {
      setConfirmState('confirmed');
      return;
    }

    const supabase = createClient();
    let confirmed = false;

    const channel = supabase
      .channel('nmq_light_created')
      .on('broadcast', { event: 'light_placed' }, (payload) => {
        if (
          payload?.payload?.checkout_session === sessionId ||
          !payload?.payload?.checkout_session
        ) {
          confirmed = true;
          setConfirmState('confirmed');
        }
      })
      .subscribe();

    // Fallback: after 8 seconds assume confirmed (webhook may have already fired)
    const timeout = setTimeout(() => {
      if (!confirmed) setConfirmState('timeout');
    }, 8000);

    return () => {
      clearTimeout(timeout);
      supabase.removeChannel(channel);
    };
  }, [isLight, sessionId]);

  return (
    <>
      <style>{`
        @keyframes starPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.18); opacity: 0.85; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>

      <div
        className={`max-w-lg w-full transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Modal card */}
        <div
          className="nmq-card p-10 flex flex-col items-center text-center"
          style={{
            background: 'rgba(10,8,6,0.92)',
            border: `1px solid ${dotColor}30`,
            boxShadow: `0 0 60px ${dotColor}10`,
          }}
        >
          {/* Animated star */}
          <div className="relative flex items-center justify-center mb-8" style={{ width: 72, height: 72 }}>
            {/* Halo ring for svemir */}
            {magnitude === 'svemir' && (
              <div
                className="absolute rounded-full"
                style={{
                  width: 56,
                  height: 56,
                  border: '1px solid rgba(212,175,55,0.3)',
                  animation: 'starPulse 3s ease-in-out infinite',
                }}
              />
            )}
            {/* Outer glow */}
            <div
              className="absolute rounded-full"
              style={{
                width: dotSize * 4,
                height: dotSize * 4,
                background: `radial-gradient(circle, ${dotColor}22 0%, transparent 70%)`,
                animation: 'starPulse 2.5s ease-in-out infinite',
              }}
            />
            {/* Core dot */}
            <div
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                background: dotColor,
                boxShadow: dotGlow,
                animation: 'starPulse 2.5s ease-in-out infinite',
                position: 'relative',
                zIndex: 2,
              }}
            />
          </div>

          {/* Magnitude badge */}
          {isLight && MAGNITUDE_LABELS[magnitude] && (
            <p
              className="nmq-label mb-3"
              style={{ color: dotColor, letterSpacing: '0.28em', fontSize: '0.5rem' }}
            >
              {MAGNITUDE_LABELS[magnitude]}
            </p>
          )}

          {/* Headline */}
          <h1 className="nmq-heading text-2xl md:text-3xl italic text-gold mb-3">
            {isLight ? 'Your light has been placed.' : 'Payment successful.'}
          </h1>

          {/* Fragment display */}
          {isLight && fragment && (
            <div
              className="w-full my-5 px-6 py-4 rounded"
              style={{
                background: `${dotColor}08`,
                borderLeft: `2px solid ${dotColor}50`,
                animation: 'fadeUp 0.6s ease-out 0.4s both',
              }}
            >
              <p className="font-cormorant italic text-cream/80 text-base leading-relaxed">
                &ldquo;{decodeURIComponent(fragment)}&rdquo;
              </p>
            </div>
          )}

          {/* Confirmation status */}
          {isLight && (
            <div className="mt-2 mb-6 flex items-center justify-center gap-2 min-h-[24px]">
              {confirmState === 'waiting' && (
                <>
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: dotColor, animation: 'shimmer 1.4s ease-in-out infinite' }}
                  />
                  <span
                    className="font-cormorant italic text-mist/50 text-sm"
                    style={{ animation: 'shimmer 1.4s ease-in-out infinite' }}
                  >
                    Placing your light on the map…
                  </span>
                </>
              )}
              {confirmState === 'confirmed' && (
                <>
                  <span style={{ color: dotColor, fontSize: '0.7rem' }}>▲</span>
                  <span className="font-cormorant italic text-sm" style={{ color: dotColor }}>
                    Your light is live on the Map of Lights.
                  </span>
                </>
              )}
              {confirmState === 'timeout' && (
                <span className="font-cormorant italic text-mist/40 text-sm">
                  Your light will appear on the map shortly.
                </span>
              )}
            </div>
          )}

          {!isLight && (
            <p className="font-cormorant italic text-mist/60 text-base mb-6 leading-relaxed">
              {product === 'deep_insight' && 'Your Jungian Soul Analysis is being generated. It will appear in your journal within minutes.'}
              {product === 'deep_read' && 'Your request has been received. A human will read your entries and respond within 48–72 hours. Status visible in your Vault.'}
              {product === 'companion' && 'Welcome to NMQ Companion. AI memory, Personal Arc, and unlimited Portal sessions are now active.'}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full mt-2">
            {product === 'deep_insight' && (
              <Link href="/journal-screen" className="amber-btn px-8 py-3 text-sm">
                View in Journal
              </Link>
            )}
            {product === 'deep_read' && (
              <Link href="/journal-screen" className="amber-btn px-8 py-3 text-sm">
                Return to Vault
              </Link>
            )}
            {product === 'companion' && (
              <Link href="/portal" className="amber-btn px-8 py-3 text-sm">
                Enter the Portal
              </Link>
            )}
            {product === 'light' && (
              <Link href="/map-of-lights" className="amber-btn px-8 py-3 text-sm">
                View Map of Lights
              </Link>
            )}
            <Link href="/landing-page" className="ghost-btn px-8 py-3 text-sm">
              Return Home
            </Link>
          </div>
        </div>

        {/* Coordinates note */}
        {isLight && (
          <p
            className="font-cormorant italic text-silence text-xs text-center mt-6"
            style={{ animation: 'fadeUp 0.6s ease-out 0.8s both' }}
          >
            Your coordinates will be sent to you by email.
          </p>
        )}
      </div>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: 'var(--color-void)' }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-gold border-t-transparent animate-spin" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}
