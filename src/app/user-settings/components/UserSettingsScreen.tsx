'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppNav from '@/components/AppNav';

const TIER_LABELS: Record<string, string> = {
  iskra: 'ISKRA',
  svetlost: 'SVETLOST',
  svemir: 'SVEMIR',
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  iskra: 'Spark Light — a small, white presence on the pyramid.',
  svetlost: 'Radiant Light — amber, visible from across the mountain.',
  svemir: 'Universe Light — gold, seen from everywhere.',
};

const TIER_COLORS: Record<string, string> = {
  iskra: 'text-mist',
  svetlost: 'text-amber',
  svemir: 'text-gold',
};

interface SettingsData {
  profile: {
    nickname: string | null;
    appearance_year: number | null;
    shadow_mode: boolean;
    assigned_node: string;
  } | null;
  hasCompanion: boolean;
  lightMagnitude: string | null;
}

export default function UserSettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [appearanceYear, setAppearanceYear] = useState('');
  const [shadowMode, setShadowMode] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/account/settings');
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
      setAppearanceYear(json.profile?.appearance_year?.toString() || '');
      setShadowMode(json.profile?.shadow_mode || false);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/sign-up-login-screen');
      return;
    }
    fetchSettings();
  }, [user, router, fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const body: Record<string, unknown> = {};
      if (appearanceYear) {
        body.appearanceYear = parseInt(appearanceYear, 10);
      } else {
        body.appearanceYear = null;
      }
      body.shadowMode = shadowMode;

      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setSaveMsg(err.error || 'Could not save.');
      } else {
        setSaveMsg('Saved.');
        await fetchSettings();
      }
    } catch {
      setSaveMsg('Could not save.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/customer-portal', { method: 'POST' });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        alert(json.error || 'Could not open billing portal.');
      }
    } catch {
      alert('Could not open billing portal.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (res.ok) {
        await signOut();
        router.push('/landing-page');
      } else {
        const err = await res.json();
        alert(err.error || 'Deletion failed.');
        setDeleting(false);
      }
    } catch {
      alert('Deletion failed.');
      setDeleting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 18;
  const yearNum = parseInt(appearanceYear, 10);
  const yearValid = !appearanceYear || (!isNaN(yearNum) && yearNum >= 1900 && yearNum <= maxYear);

  const tier = data?.lightMagnitude || null;

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* 3D Rtanj background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 100%, rgba(139,90,43,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 80% 40% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 60%),
            linear-gradient(180deg, #0a0a0f 0%, #0d0b08 40%, #110e07 70%, #0a0a0f 100%)
          `,
        }}
      />
      {/* Pyramid silhouette */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
        style={{
          width: '900px',
          height: '420px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(139,90,43,0.06) 40%, rgba(212,175,55,0.04) 100%)',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(2px)',
        }}
      />
      {/* Noise grain overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <AppNav variant="transparent" />

      <div className="relative z-10 max-w-xl mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <div className="mb-10">
          <p className="nmq-label mb-3" style={{ letterSpacing: '0.3em', fontSize: '0.6rem' }}>
            NOMOREQUIET · SETTINGS
          </p>
          <h1
            className="font-cormorant font-light text-cream leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', letterSpacing: '0.08em' }}
          >
            Your Presence
          </h1>
          <div className="mt-2 h-px w-16 bg-amber/30" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-1 h-1 rounded-full bg-amber animate-ping" />
          </div>
        ) : (
          <div className="space-y-4">

            {/* ── Profile & Generational Context ── */}
            <section
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,175,55,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <p className="nmq-label mb-5" style={{ letterSpacing: '0.25em', fontSize: '0.6rem' }}>
                GENERATIONAL CONTEXT
              </p>

              <div className="mb-1">
                <label
                  htmlFor="appearance_year"
                  className="font-cormorant font-light text-cream/80 text-sm tracking-widest block mb-2"
                >
                  Appearance Year
                </label>
                <p className="text-mist/50 text-xs font-light tracking-wide mb-3" style={{ fontFamily: 'inherit' }}>
                  The year you arrived in this world. Used to calibrate the depth and tone of your Portal sessions.
                </p>
                <input
                  id="appearance_year"
                  type="number"
                  min={1900}
                  max={maxYear}
                  placeholder={`e.g. ${maxYear - 10}`}
                  value={appearanceYear}
                  onChange={(e) => setAppearanceYear(e.target.value)}
                  className="w-full bg-transparent border-b border-amber/20 focus:border-amber/50 outline-none text-cream font-light text-sm py-2 tracking-widest transition-colors placeholder:text-mist/30"
                  style={{ fontFamily: 'var(--font-cormorant, serif)' }}
                />
                {appearanceYear && !yearValid && (
                  <p className="text-red-400/70 text-xs mt-1 font-light tracking-wide">
                    Must be 18 or older (born {maxYear} or earlier).
                  </p>
                )}
              </div>
            </section>

            {/* ── Stripe Billing ── */}
            <section
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,175,55,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <p className="nmq-label mb-5" style={{ letterSpacing: '0.25em', fontSize: '0.6rem' }}>
                YOUR LIGHT
              </p>

              {tier ? (
                <div className="mb-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className={`font-cormorant font-light text-xl tracking-widest ${TIER_COLORS[tier] || 'text-cream'}`}
                    >
                      {TIER_LABELS[tier] || tier.toUpperCase()}
                    </span>
                    <span className="nmq-label text-mist/40" style={{ fontSize: '0.55rem' }}>
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-mist/50 text-xs font-light tracking-wide">
                    {TIER_DESCRIPTIONS[tier] || ''}
                  </p>
                </div>
              ) : (
                <div className="mb-5">
                  <p className="font-cormorant font-light text-mist/60 text-sm tracking-widest">
                    No light placed yet.
                  </p>
                  <p className="text-mist/40 text-xs font-light tracking-wide mt-1">
                    Visit the landing page to place your star on the pyramid.
                  </p>
                </div>
              )}

              {data?.hasCompanion && (
                <div className="mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                  <span className="nmq-label text-amber/70" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
                    NMQ COMPANION ACTIVE
                  </span>
                </div>
              )}

              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="w-full py-2.5 rounded-lg font-light text-xs tracking-widest transition-all duration-300 disabled:opacity-40"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: 'rgba(212,175,55,0.85)',
                  letterSpacing: '0.2em',
                  fontFamily: 'inherit',
                }}
              >
                {portalLoading ? '...' : 'MANAGE SUBSCRIPTION'}
              </button>
            </section>

            {/* ── Privacy ── */}
            <section
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,175,55,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <p className="nmq-label mb-5" style={{ letterSpacing: '0.25em', fontSize: '0.6rem' }}>
                PRIVACY
              </p>

              {/* Shadow Mode */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <p className="font-cormorant font-light text-cream/80 text-sm tracking-widest mb-1">
                    Shadow Mode
                  </p>
                  <p className="text-mist/50 text-xs font-light tracking-wide leading-relaxed">
                    Your star remains on the pyramid, but your name and fragment are hidden from all other visitors. You become a presence without identity.
                  </p>
                </div>
                <button
                  onClick={() => setShadowMode(!shadowMode)}
                  className="relative flex-shrink-0 mt-0.5"
                  aria-label="Toggle shadow mode"
                >
                  <div
                    className="w-10 h-5 rounded-full transition-all duration-300"
                    style={{
                      background: shadowMode
                        ? 'rgba(212,175,55,0.3)'
                        : 'rgba(255,255,255,0.08)',
                      border: shadowMode
                        ? '1px solid rgba(212,175,55,0.5)'
                        : '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
                      style={{
                        left: shadowMode ? '22px' : '2px',
                        background: shadowMode ? 'rgba(212,175,55,0.9)' : 'rgba(255,255,255,0.3)',
                      }}
                    />
                  </div>
                </button>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving || !yearValid}
                className="w-full py-2.5 rounded-lg font-light text-xs tracking-widest transition-all duration-300 disabled:opacity-40 mb-8"
                style={{
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: 'rgba(212,175,55,0.9)',
                  letterSpacing: '0.2em',
                  fontFamily: 'inherit',
                }}
              >
                {saving ? '...' : 'SAVE CHANGES'}
              </button>

              {saveMsg && (
                <p
                  className={`text-xs font-light tracking-widest text-center mb-6 transition-opacity ${
                    saveMsg === 'Saved.' ? 'text-amber/60' : 'text-red-400/60'
                  }`}
                >
                  {saveMsg}
                </p>
              )}

              {/* Nuclear Option */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(220,38,38,0.04)',
                  border: '1px solid rgba(220,38,38,0.15)',
                }}
              >
                <p className="font-cormorant font-light text-red-400/70 text-sm tracking-widest mb-1">
                  Clear my light from the mountain
                </p>
                <p className="text-mist/40 text-xs font-light tracking-wide leading-relaxed mb-4">
                  This permanently erases your account, all journal entries, portal sessions, and removes your star from the pyramid. This cannot be undone.
                </p>

                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full py-2 rounded-lg font-light text-xs tracking-widest transition-all duration-300"
                    style={{
                      background: 'rgba(220,38,38,0.08)',
                      border: '1px solid rgba(220,38,38,0.25)',
                      color: 'rgba(220,38,38,0.7)',
                      letterSpacing: '0.2em',
                      fontFamily: 'inherit',
                    }}
                  >
                    DELETE ACCOUNT
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-400/60 text-xs font-light tracking-wide">
                      Type <span className="text-red-400/90 font-normal">DELETE</span> to confirm.
                    </p>
                    <input
                      type="text"
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder="DELETE"
                      className="w-full bg-transparent border-b border-red-500/30 focus:border-red-500/60 outline-none text-red-400/80 font-light text-sm py-1.5 tracking-widest transition-colors placeholder:text-red-900/40"
                      style={{ fontFamily: 'var(--font-cormorant, serif)' }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setDeleteConfirm(false); setDeleteInput(''); }}
                        className="flex-1 py-2 rounded-lg font-light text-xs tracking-widest transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.4)',
                          letterSpacing: '0.15em',
                          fontFamily: 'inherit',
                        }}
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteInput !== 'DELETE' || deleting}
                        className="flex-1 py-2 rounded-lg font-light text-xs tracking-widest transition-all disabled:opacity-30"
                        style={{
                          background: deleteInput === 'DELETE' ? 'rgba(220,38,38,0.2)' : 'rgba(220,38,38,0.06)',
                          border: '1px solid rgba(220,38,38,0.4)',
                          color: 'rgba(220,38,38,0.85)',
                          letterSpacing: '0.15em',
                          fontFamily: 'inherit',
                        }}
                      >
                        {deleting ? '...' : 'CONFIRM'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
