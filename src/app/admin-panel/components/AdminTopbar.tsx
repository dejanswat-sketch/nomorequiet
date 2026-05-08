import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function AdminTopbar() {
  return (
    <div
      className="flex items-center justify-between px-6 border-b border-amber/12 bg-deep-earth/60"
      style={{ height: '56px' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <AppLogo size={24} />
          <span className="font-cormorant font-light tracking-widest text-gold text-xs" style={{ letterSpacing: '0.2em' }}>
            NOMOREQUIET
          </span>
        </div>
        <div className="w-px h-4 bg-silence" />
        <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
          ADMIN · FOUNDER PANEL
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber pulse-slow" />
          <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            LIVE
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(200,130,42,0.15)', border: '1px solid rgba(200,130,42,0.3)' }}
          >
            <span className="font-cormorant font-light text-amber text-xs">F</span>
          </div>
          <span className="font-cormorant font-light text-mist text-sm">Founder</span>
        </div>
        <Link
          href="/landing-page"
          className="nmq-label text-silence hover:text-mist transition-colors"
          style={{ fontSize: '0.5rem' }}
        >
          VIEW SITE
        </Link>
      </div>
    </div>
  );
}