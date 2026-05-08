'use client';

import React, { useEffect, useRef, useState } from 'react';

const manifestParagraphs = [
  'We believe many people have been silent for too long — not because they had nothing to say, but because they had nowhere to say it. NoMoreQuiet exists as an answer to that silence.',
  'This is not a place to fix yourself. It is a place where you are allowed to be. You don\'t have to explain yourself, fit in, or appear stronger, better, or calmer than you are. Here, there is no judgment, no mockery, no painful criticism, and no neglect.',
  'NoMoreQuiet is a home — and a home doesn\'t need to be proven, it needs to be felt. We are building a real family, not a perfect one: a space where every story belongs, where silence and words are equally welcome, and where writing is not weakness, but courage.',
  'We don\'t offer instant solutions, miracles, or therapy. What we offer is presence: attention, time, and words that do not rush you. We stay with you — not because you have to, but because you are not alone.',
];

function ManifestParagraph({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <p
      ref={ref}
      className={`nmq-body text-lg md:text-xl text-cream/80 leading-relaxed transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ fontStyle: 'italic' }}
    >
      {text}
    </p>
  );
}

export default function LandingManifest() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section className="py-24 md:py-36 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div
          className={`transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="nmq-label mb-8 text-center" style={{ letterSpacing: '0.28em' }}>
            THE MANIFEST
          </p>
          <div className="w-12 h-px bg-amber mx-auto mb-16 opacity-60" />
        </div>

        <div className="flex flex-col gap-10">
          {manifestParagraphs.map((text, i) => (
            <ManifestParagraph key={`manifest-p-${i}`} text={text} delay={i * 150} />
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-1000 delay-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="nmq-heading text-2xl md:text-3xl italic text-gold">
            NoMoreQuiet is not silence.
          </p>
          <p className="nmq-heading text-2xl md:text-3xl italic text-gold">
            It is the place where silence finally finds its voice.
          </p>
        </div>
      </div>
    </section>
  );
}