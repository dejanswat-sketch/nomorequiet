import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function LandingFooter() {
  return (
    <footer className="border-t border-amber/10 py-16 px-6 bg-deep-earth/30">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <AppLogo src="/assets/images/ikona2-1777358983549.png" size={28} />
              <span className="font-cormorant font-light tracking-widest text-gold text-sm" style={{ letterSpacing: '0.22em' }}>
                NOMOREQUIET
              </span>
            </div>
            <p className="font-cormorant italic text-mist text-sm leading-relaxed">
              The place where silence finally finds its voice.
            </p>
            <p className="nmq-label mt-3" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
              43°46′N · 21°50′E · RTANJ, SERBIA
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="nmq-label mb-4" style={{ fontSize: '0.55rem' }}>THE HOUSE</p>
              <div className="flex flex-col gap-2">
                {[
                  { href: '/journal-screen', label: 'Write', key: 'foot-write' },
                  { href: '/map-of-lights', label: 'Map of Lights', key: 'foot-map' },
                  { href: '/sign-up-login-screen', label: 'Join', key: 'foot-join' },
                ]?.map((link) => (
                  <Link
                    key={link?.key}
                    href={link?.href}
                    className="font-cormorant font-light text-mist hover:text-cream transition-colors text-sm"
                  >
                    {link?.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="nmq-label mb-4" style={{ fontSize: '0.55rem' }}>OFFERINGS</p>
              <div className="flex flex-col gap-2">
                {[
                  { href: '/sign-up-login-screen', label: 'The Vault (Free)', key: 'foot-vault' },
                  { href: '/sign-up-login-screen', label: 'Deep Insight — 10 €', key: 'foot-insight' },
                  { href: '/sign-up-login-screen', label: 'Companion — 4.99 €/mo', key: 'foot-companion' },
                  { href: '/sign-up-login-screen', label: 'The Deep Read — 49 €', key: 'foot-deepread' },
                ]?.map((link) => (
                  <Link
                    key={link?.key}
                    href={link?.href}
                    className="font-cormorant font-light text-mist hover:text-cream transition-colors text-sm"
                  >
                    {link?.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="nmq-label mb-4" style={{ fontSize: '0.55rem' }}>LEGAL</p>
              <div className="flex flex-col gap-2">
                {[
                  { href: '#', label: 'Terms of Service', key: 'foot-terms' },
                  { href: '#', label: 'Privacy Policy', key: 'foot-privacy' },
                  { href: '#', label: 'Cookie Policy', key: 'foot-cookies' },
                ]?.map((link) => (
                  <Link
                    key={link?.key}
                    href={link?.href}
                    className="font-cormorant font-light text-mist hover:text-cream transition-colors text-sm"
                  >
                    {link?.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-amber/8">
          <p className="font-cormorant font-light text-silence text-xs leading-relaxed max-w-3xl mx-auto text-center italic">
            NoMoreQuiet is a reflective writing space, not a therapy service or medical provider. It does not offer diagnosis, treatment, or crisis intervention. If you are in crisis or need immediate support, please contact a mental health professional or emergency services in your country.
          </p>
          <p className="nmq-label mt-6 text-center" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            © 2026 NOMOREQUIET · RTANJ PYRAMID · 43°46′N, 21°50′E · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}