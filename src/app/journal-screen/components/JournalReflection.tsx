'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { UpsellProduct } from './JournalEditor';

interface ReflectionProps {
  reflection: string | null;
  loading: boolean;
  nodeInfo: { name: string; reflectionPrefix?: string };
  upsellProduct: UpsellProduct;
  onDismissUpsell: () => void;
  isPastEntry?: boolean;
  crisisMode?: boolean;
  crisisLanguage?: string;
}

const UPSELL_CONTENT: Record<NonNullable<UpsellProduct>, { label: string; headline: string; body: string; cta: string; price: string }> = {
  light: {
    label: 'LEAVE YOUR MARK',
    headline: 'Your first entry. Leave a light on the pyramid.',
    body: 'A permanent point on the global map. Your coordinates. One anonymous sentence. Forever.',
    cta: 'Light a Point — 1 €',
    price: '1 €',
  },
  deep_insight: {
    label: 'THE HOUSE HAS BEEN LISTENING',
    headline: 'Want to see what it heard?',
    body: 'A 5-dimensional AI analysis of everything you\'ve written. Linguistic imprint, emotional frequency, archetype mapping, shadow detection, metaphorical bridge. 600-800 words. Delivered instantly.',
    cta: 'See What It Heard — 10 €',
    price: '10 €',
  },
  companion: {
    label: 'YOU KEEP COMING BACK',
    headline: 'The House wants to go deeper.',
    body: 'Extended AI reflections, the 5-round Portal journey, a Builder light on the pyramid, and AI memory across sessions. The House that remembers.',
    cta: 'Stay — 4.99 €/month',
    price: '4.99 €/mo',
  },
};

export default function JournalReflection({
  reflection,
  loading,
  nodeInfo,
  upsellProduct,
  onDismissUpsell,
  isPastEntry = false,
  crisisMode = false,
  crisisLanguage,
}: ReflectionProps) {
  const [visible, setVisible] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);

  useEffect(() => {
    if (crisisMode) {
      const t = setTimeout(() => setCrisisVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [crisisMode]);

  useEffect(() => {
    if (reflection && !loading) {
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [reflection, loading]);

  // Crisis overlay — WF-05
  if (crisisMode) {
    return (
      <div
        className={`border-t border-ember/30 transition-all duration-700 ${
          crisisVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'linear-gradient(180deg, rgba(28,10,6,0.95) 0%, rgba(10,8,6,1) 100%)' }}
      >
        <div className="px-8 md:px-16 lg:px-24 xl:px-32 py-8" style={{ maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-ember" style={{ animation: 'pulseAmber 2s ease-in-out infinite' }} />
            <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#ff6b2b' }}>
              THE HOUSE IS WITH YOU
            </p>
          </div>

          <p className="font-cormorant italic text-cream text-lg leading-relaxed mb-6" style={{ fontWeight: 300 }}>
            What you wrote carries real weight. Before anything else — are you safe right now?
            These people are ready to listen:
          </p>

          <div className="space-y-3 mb-6">
            {[
              { name: 'Befrienders Worldwide', url: 'https://www.befrienders.org', desc: 'International emotional support' },
              { name: 'Crisis Text Line', url: 'https://www.crisistextline.org', desc: 'Text HOME to 741741 (US/UK/CA/IE)' },
              { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/', desc: 'Crisis centres worldwide' },
            ].map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-ember/20 hover:border-ember/40 transition-colors"
                style={{ background: 'rgba(255,107,43,0.04)' }}
              >
                <p className="font-cormorant font-light text-cream text-sm">{resource.name}</p>
                <p className="font-cormorant italic text-mist text-xs mt-0.5">{resource.desc}</p>
              </a>
            ))}
          </div>

          <p className="font-cormorant italic text-mist text-sm leading-relaxed">
            You can continue writing. The House is still here. You are not blocked or interrupted.
            {crisisLanguage && crisisLanguage !== 'English' && (
              <span className="block mt-2 text-silence text-xs">
                Resources shown in English. Local resources are being identified for your region.
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-t border-amber/15 transition-all duration-700 ${
        loading || reflection ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}
      style={{ background: 'linear-gradient(180deg, rgba(17,14,10,0.8) 0%, rgba(10,8,6,1) 100%)' }}
    >
      <div className="px-8 md:px-16 lg:px-24 xl:px-32 py-6" style={{ maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="light-dot pulse-amber" style={{ width: '5px', height: '5px' }} />
              <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
                THE HOUSE IS LISTENING...
              </p>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-deep-earth rounded" style={{ width: '85%' }} />
              <div className="h-3 bg-deep-earth rounded" style={{ width: '70%' }} />
              <div className="h-3 bg-deep-earth rounded" style={{ width: '90%' }} />
            </div>
          </div>
        )}

        {/* Reflection content */}
        {reflection && !loading && (
          <div
            className={`transition-all duration-1000 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="light-dot light-dot-founding"
                style={{ width: '5px', height: '5px', animation: 'pulseAmber 3s ease-in-out infinite' }}
              />
              <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#D4AF37' }}>
                {isPastEntry ? 'YOUR REFLECTION' : 'THE HOUSE REFLECTS'}
              </p>
              <span className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                · {nodeInfo.name}
              </span>
            </div>

            <p
              className="font-cormorant italic text-cream/85 text-base md:text-lg leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {reflection}
            </p>

            {/* Contextual upsell — WF-01 Step 7 */}
            {upsellProduct && !isPastEntry && UPSELL_CONTENT[upsellProduct] && (
              <div
                className="mt-5 p-4 border border-amber/20 bg-amber/5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="nmq-label mb-1" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
                    {UPSELL_CONTENT[upsellProduct].label}
                  </p>
                  <p className="font-cormorant italic text-cream/80 text-sm leading-relaxed mb-1">
                    {UPSELL_CONTENT[upsellProduct].headline}
                  </p>
                  <p className="font-cormorant italic text-mist text-xs leading-relaxed">
                    {UPSELL_CONTENT[upsellProduct].body}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Link href="/sign-up-login-screen" className="amber-btn px-4 py-2 text-xs whitespace-nowrap">
                    {UPSELL_CONTENT[upsellProduct].cta}
                  </Link>
                  <button
                    className="nmq-label text-silence hover:text-mist transition-colors text-center"
                    style={{ fontSize: '0.45rem' }}
                    onClick={onDismissUpsell}
                  >
                    NOT NOW
                  </button>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {!isPastEntry && (
              <p className="font-cormorant italic text-silence text-xs mt-4 leading-relaxed">
                This is a reflection, not therapy. If you are in crisis, please contact emergency services or a mental health professional.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}