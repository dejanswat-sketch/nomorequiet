'use client';

import React, { useEffect, useRef, useState } from 'react';

const fragments = [
  { id: 'frag-001', text: 'I stopped explaining myself to people who weren\'t listening.', node: 'Rtanj', age: '312 days' },
  { id: 'frag-002', text: 'The weight has a shape now. That\'s something.', node: 'Sedona', age: '289 days' },
  { id: 'frag-003', text: 'I came here because I had nowhere else to put this.', node: 'Rtanj', age: '401 days' },
  { id: 'frag-004', text: 'Quiet is not the same as peace. I\'m learning the difference.', node: 'Glastonbury', age: '178 days' },
  { id: 'frag-005', text: 'Still here. Still carrying it. But less alone.', node: 'Kailash', age: '356 days' },
  { id: 'frag-006', text: 'I don\'t know what I\'m waiting for. Maybe that\'s the point.', node: 'Shasta', age: '223 days' },
  { id: 'frag-007', text: 'The stone is lighter when I say its name.', node: 'Rtanj', age: '445 days' },
  { id: 'frag-008', text: 'Something moved today. I can\'t explain it. It moved.', node: 'Machu Picchu', age: '167 days' },
  { id: 'frag-009', text: 'I wrote for the first time in years. It felt like breathing.', node: 'Es Vedrà', age: '198 days' },
];

export default function LandingFoundingFragments() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % fragments?.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="nmq-label mb-4" style={{ letterSpacing: '0.28em' }}>
            VOICES FROM THE PYRAMID
          </p>
          <h2 className="nmq-heading text-3xl md:text-4xl italic text-gold">
            Anonymous fragments from those who wrote.
          </h2>
          <p className="nmq-body text-mist mt-4">
            One sentence. It doesn&apos;t have to be beautiful. Just true.
          </p>
        </div>

        {/* Featured rotating fragment */}
        <div
          className={`nmq-card p-10 md:p-16 text-center mb-12 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            borderColor: 'rgba(212,175,55,0.2)',
            background: 'linear-gradient(135deg, rgba(17,14,10,1) 0%, rgba(17,14,10,0.6) 100%)',
          }}
        >
          <div className="flex justify-center mb-6">
            <span
              className="light-dot light-dot-founding pulse-amber"
              style={{ width: '8px', height: '8px' }}
            />
          </div>
          <p
            className="font-cormorant italic text-cream text-xl md:text-2xl lg:text-3xl leading-relaxed transition-all duration-700"
            key={`featured-frag-${activeIndex}`}
            style={{ fontWeight: 300 }}
          >
            &ldquo;{fragments?.[activeIndex]?.text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="nmq-label" style={{ fontSize: '0.55rem' }}>
              {fragments?.[activeIndex]?.node}
            </span>
            <span className="w-px h-3 bg-silence" />
            <span className="nmq-label" style={{ fontSize: '0.55rem' }}>
              Light #{activeIndex + 1} · {fragments?.[activeIndex]?.age} ago
            </span>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {fragments?.map((_, i) => (
              <button
                key={`dot-${i}`}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? 'bg-amber w-4 h-1.5' :'bg-silence w-1.5 h-1.5'
                }`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Fragment ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Grid of fragments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fragments?.slice(0, 6)?.map((frag, i) => (
            <div
              key={frag?.id}
              className={`nmq-card p-6 transition-all duration-700 cursor-default ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="light-dot" style={{ width: '5px', height: '5px' }} />
                <span className="nmq-label" style={{ fontSize: '0.5rem' }}>
                  {frag?.node}
                </span>
              </div>
              <p className="font-cormorant italic text-cream/70 text-base leading-relaxed">
                &ldquo;{frag?.text}&rdquo;
              </p>
              <p className="nmq-label mt-3" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                {frag?.age} ago
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}