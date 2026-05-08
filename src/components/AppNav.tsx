'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface AppNavProps {
  variant?: 'transparent' | 'solid';
}

interface DropdownItem {
  href: string;
  label: string;
  sublabel?: string;
}

interface NavGroup {
  label: string;
  key: string;
  items: DropdownItem[];
}

interface NavLink {
  href: string;
  label: string;
  key: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'THE VAULT',
    key: 'vault',
    items: [
      { href: '/dashboard', label: 'Dashboard', sublabel: 'Your Profile & Stories' },
      { href: '/journal-screen', label: 'Write', sublabel: 'Daily Mirror & Soul Story' },
      { href: '/portal', label: 'Portal', sublabel: 'AI Companion Sessions' },
      { href: '/personal-arc', label: 'Personal Arc', sublabel: 'Your Emotion Journey' },
    ],
  },
  {
    label: 'THE MOUNTAIN',
    key: 'mountain',
    items: [
      { href: '/map-of-lights', label: 'Map of Lights', sublabel: 'Global Light Nodes' },
      { href: '/voices', label: 'Voices', sublabel: 'Stories of the Mountain' },
    ],
  },
];

const NAV_LINKS: NavLink[] = [
  { href: '/pricing', label: 'Stay in the House', key: 'nav-stay' },
];

export default function AppNav({ variant = 'solid' }: AppNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isTransparent = variant === 'transparent' && !scrolled;

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => pathname === item.href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent' :'bg-void/95 backdrop-blur-sm border-b border-amber/10'
        }`}
        style={{ height: '64px' }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/landing-page" className="flex items-center gap-3 group">
            <AppLogo src="/assets/images/ikona2-1777358983549.png" size={32} />
            <div className="flex flex-col">
              <span
                className="font-cormorant font-light tracking-widest text-gold text-sm leading-none"
                style={{ letterSpacing: '0.22em' }}
              >
                NOMOREQUIET
              </span>
              <span className="nmq-label" style={{ fontSize: '0.5rem', letterSpacing: '0.3em', marginTop: '2px' }}>
                RTANJ · 43°46′N
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8" ref={dropdownRef}>
            {/* Dropdown groups */}
            {NAV_GROUPS.map((group) => (
              <div key={group.key} className="relative">
                <button
                  className={`nmq-label flex items-center gap-1.5 transition-colors duration-200 ${
                    isGroupActive(group) || openDropdown === group.key
                      ? 'text-amber' :'text-mist hover:text-cream'
                  }`}
                  onClick={() =>
                    setOpenDropdown(openDropdown === group.key ? null : group.key)
                  }
                >
                  {group.label}
                  <Icon
                    name="ChevronDownIcon"
                    size={10}
                    className={`transition-transform duration-200 ${
                      openDropdown === group.key ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown panel */}
                {openDropdown === group.key && (
                  <div
                    className="absolute top-full left-0 mt-3 nmq-card py-2 min-w-[200px] z-50"
                    style={{ border: '1px solid rgba(200,130,42,0.2)' }}
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col px-4 py-3 transition-colors duration-150 hover:bg-amber/5 ${
                          pathname === item.href ? 'border-l-2 border-amber pl-3.5' : ''
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span
                          className={`nmq-label text-xs ${
                            pathname === item.href ? 'text-amber' : 'text-cream'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.sublabel && (
                          <span className="font-cormorant italic text-silence text-xs mt-0.5">
                            {item.sublabel}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Direct links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`nmq-label transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-amber' :'text-mist hover:text-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-4 bg-silence" />
            <Link
              href="/sign-up-login-screen"
              className="nmq-label text-mist hover:text-cream transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up-login-screen"
              className="amber-btn text-xs px-5 py-2"
            >
              Begin Writing
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-mist hover:text-cream transition-colors p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-void/95 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 bg-deep-earth border-b border-amber/15 p-6 transition-transform duration-300 ${
            mobileOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="flex flex-col gap-2">
            {/* Mobile dropdown groups */}
            {NAV_GROUPS.map((group) => (
              <div key={group.key}>
                <button
                  className={`w-full flex items-center justify-between py-3 nmq-label text-sm ${
                    isGroupActive(group) ? 'text-amber' : 'text-mist'
                  }`}
                  onClick={() =>
                    setMobileExpanded(mobileExpanded === group.key ? null : group.key)
                  }
                >
                  {group.label}
                  <Icon
                    name="ChevronDownIcon"
                    size={12}
                    className={`transition-transform duration-200 ${
                      mobileExpanded === group.key ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileExpanded === group.key && (
                  <div className="pl-4 flex flex-col gap-1 mb-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`py-2 nmq-label text-xs ${
                          pathname === item.href ? 'text-amber' : 'text-mist/80'
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile direct links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`py-3 nmq-label text-sm ${
                  pathname === link.href ? 'text-amber' : 'text-mist'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-silence/40 my-2" />
            <Link
              href="/sign-up-login-screen"
              className="nmq-label text-sm text-mist"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up-login-screen"
              className="amber-btn text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Begin Writing
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for fixed nav */}
      {variant === 'solid' && <div style={{ height: '64px' }} />}
    </>
  );
}