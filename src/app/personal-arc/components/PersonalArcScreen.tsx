'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArcEntry {
  id: string;
  date: string;
  dateLabel: string;
  depthScore: number;
  emotionTags: string[];
  shadowTopics: string[];
  archetypeHint: string | null;
  node: string;
  wordCount: number;
  source: 'journal' | 'portal';
}

interface PortalRoundRow {
  id: string;
  session_id: string;
  round_number: number;
  user_input: string | null;
  ai_response: string | null;
  created_at: string;
  completed_at: string | null;
  portal_sessions?: { node: string; status: string } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NODE_LABELS: Record<string, string> = {
  rtanj: 'Rtanj',
  sedona: 'Sedona',
  kailash: 'Kailash',
  shasta: 'Shasta',
  glastonbury: 'Glastonbury',
  machu_picchu: 'Machu Picchu',
  esvedra: 'Es Vedrà',
};

const NODE_COLORS: Record<string, string> = {
  rtanj: '#c8822a',
  sedona: '#e8603a',
  kailash: '#6a8acc',
  shasta: '#5aaa7a',
  glastonbury: '#9a7acc',
  machu_picchu: '#d4af37',
  esvedra: '#4aaccc',
};

const EMOTION_PALETTE: Record<string, string> = {
  grief: '#6a5acd',
  loss: '#7a6aaa',
  longing: '#8a7acc',
  fear: '#cc6a4a',
  anger: '#cc3a1a',
  shame: '#aa4a6a',
  joy: '#d4af37',
  peace: '#5aaa7a',
  love: '#cc6a8a',
  confusion: '#8aaa9a',
  hope: '#c8822a',
  exhaustion: '#7a7a7a',
  clarity: '#4aaccc',
  resistance: '#aa7a4a',
  acceptance: '#6aaa8a',
};

function getEmotionColor(tag: string): string {
  const lower = tag.toLowerCase();
  for (const [key, color] of Object.entries(EMOTION_PALETTE)) {
    if (lower.includes(key)) return color;
  }
  return '#a89880';
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayload {
  payload?: ArcEntry;
}

function ArcTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length || !payload[0]?.payload) return null;
  const entry = payload[0].payload as ArcEntry;
  return (
    <div
      className="nmq-card p-4 max-w-xs"
      style={{ background: '#110e0a', border: '1px solid rgba(200,130,42,0.25)', borderRadius: 2 }}
    >
      <p className="nmq-label text-amber mb-1">{formatFullDate(entry.date)}</p>
      <p className="nmq-label text-mist mb-2">
        {NODE_LABELS[entry.node] || entry.node} · {entry.source === 'portal' ? 'Portal' : 'Journal'}
      </p>
      <div className="flex items-center gap-2 mb-2">
        <span className="nmq-label text-mist">Depth</span>
        <div className="flex-1 h-1 bg-silence/40 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(entry.depthScore / 10) * 100}%`,
              background: 'linear-gradient(90deg, #c8822a, #d4af37)',
            }}
          />
        </div>
        <span className="nmq-label text-amber">{entry.depthScore.toFixed(1)}</span>
      </div>
      {entry.emotionTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.emotionTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="nmq-label px-2 py-0.5"
              style={{
                background: `${getEmotionColor(tag)}22`,
                border: `1px solid ${getEmotionColor(tag)}55`,
                color: getEmotionColor(tag),
                borderRadius: 2,
                fontSize: '0.55rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Companion Gate ───────────────────────────────────────────────────────────

function CompanionGate() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Sigil */}
        <div className="relative mx-auto mb-10" style={{ width: 80, height: 80 }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(200,130,42,0.12) 0%, transparent 70%)',
              animation: 'pulseAmber 3s ease-in-out infinite',
            }}
          />
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(200,130,42,0.2)" strokeWidth="1" />
            <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(200,130,42,0.35)" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="4" fill="#c8822a" opacity="0.8" />
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x = 40 + 30 * Math.cos(rad);
              const y = 40 + 30 * Math.sin(rad);
              return <circle key={deg} cx={x} cy={y} r="1.5" fill="#c8822a" opacity="0.5" />;
            })}
          </svg>
        </div>

        <p className="nmq-label text-amber mb-4" style={{ letterSpacing: '0.3em' }}>
          THE VAULT · PERSONAL ARC
        </p>
        <h1
          className="font-cormorant font-light text-cream mb-6"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.15 }}
        >
          Your emotion journey lives here.
        </h1>
        <p className="nmq-body text-mist mb-10" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
          Personal Arc is the heart of The Vault — a living map of your inner landscape across every session and journal entry. Available exclusively to Companion members.
        </p>
        <Link href="/pricing" className="amber-btn inline-block">
          Become a Companion
        </Link>
        <p className="nmq-label text-silence mt-6">€4.99 / month · Cancel anytime</p>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyArc() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="relative mb-8" style={{ width: 60, height: 60 }}>
        <svg viewBox="0 0 60 60" className="w-full h-full opacity-30">
          <circle cx="30" cy="30" r="25" fill="none" stroke="#c8822a" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="30" cy="30" r="3" fill="#c8822a" />
        </svg>
      </div>
      <p className="nmq-label text-amber mb-3">No entries yet</p>
      <p className="nmq-body text-mist" style={{ maxWidth: 320, fontSize: '0.95rem' }}>
        Your arc begins with the first word. Write in the journal or complete a Portal session to see your emotion journey unfold here.
      </p>
      <div className="flex gap-4 mt-8">
        <Link href="/journal-screen" className="ghost-btn text-xs">
          Open Journal
        </Link>
        <Link href="/portal" className="amber-btn text-xs">
          Enter Portal
        </Link>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PersonalArcScreen() {
  const [loading, setLoading] = useState(true);
  const [isCompanion, setIsCompanion] = useState(false);
  const [entries, setEntries] = useState<ArcEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ArcEntry | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'journal' | 'portal'>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Check Companion status
      const { data: sub } = await supabase
        .from('stripe_subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      // Also check user_tier in user_profiles
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_tier')
        .eq('id', user.id)
        .maybeSingle();

      const companion = !!sub || profile?.user_tier === 'companion';
      setIsCompanion(companion);

      if (!companion) { setLoading(false); return; }

      // Fetch journal entries
      const { data: journalRows } = await supabase
        .from('journal_entries')
        .select('id, created_at, depth_score, emotion_tags, shadow_topics, archetype_hint, node, word_count')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      // Fetch portal rounds (completed)
      const { data: portalRows } = await supabase
        .from('portal_rounds')
        .select('id, session_id, round_number, user_input, ai_response, created_at, completed_at, portal_sessions(node, status)')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: true });

      const arcEntries: ArcEntry[] = [];

      // Map journal entries
      (journalRows || []).forEach((row: {
        id: string; created_at: string; depth_score: number;
        emotion_tags: string[]; shadow_topics: string[]; archetype_hint: string | null;
        node: string; word_count: number;
      }) => {
        arcEntries.push({
          id: row.id,
          date: row.created_at,
          dateLabel: formatDateLabel(row.created_at),
          depthScore: row.depth_score || 0,
          emotionTags: row.emotion_tags || [],
          shadowTopics: row.shadow_topics || [],
          archetypeHint: row.archetype_hint,
          node: row.node,
          wordCount: row.word_count,
          source: 'journal',
        });
      });

      // Map portal rounds — group by session, use round 5 as representative
      const sessionMap: Record<string, PortalRoundRow[]> = {};
      (portalRows as PortalRoundRow[] || []).forEach((row) => {
        if (!sessionMap[row.session_id]) sessionMap[row.session_id] = [];
        sessionMap[row.session_id].push(row);
      });

      Object.values(sessionMap).forEach((rounds) => {
        const lastRound = rounds.sort((a, b) => b.round_number - a.round_number)[0];
        const session = lastRound.portal_sessions;
        if (!session || session.status !== 'completed') return;
        const wordCount = rounds.reduce((acc, r) => acc + (r.user_input?.split(/\s+/).length || 0), 0);
        arcEntries.push({
          id: `portal-${lastRound.session_id}`,
          date: lastRound.completed_at || lastRound.created_at,
          dateLabel: formatDateLabel(lastRound.completed_at || lastRound.created_at),
          depthScore: Math.min(10, 5 + rounds.length),
          emotionTags: [],
          shadowTopics: [],
          archetypeHint: null,
          node: session.node,
          wordCount,
          source: 'portal',
        });
      });

      // Sort chronologically
      arcEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setEntries(arcEntries);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-amber pulse-amber" />
      </div>
    );
  }

  if (!isCompanion) return <CompanionGate />;

  const filtered = entries.filter((e) => activeFilter === 'all' || e.source === activeFilter);

  // Chart data
  const chartData = filtered.map((e) => ({
    ...e,
    label: e.dateLabel,
    depth: e.depthScore,
  }));

  // Collect all unique emotion tags
  const allTags = Array.from(new Set(entries.flatMap((e) => e.emotionTags)));

  // Node frequency
  const nodeCounts: Record<string, number> = {};
  entries.forEach((e) => {
    nodeCounts[e.node] = (nodeCounts[e.node] || 0) + 1;
  });

  const avgDepth = entries.length
    ? (entries.reduce((s, e) => s + e.depthScore, 0) / entries.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-void grain-overlay">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
          <div>
            <p className="nmq-label text-amber mb-3" style={{ letterSpacing: '0.3em' }}>
              THE VAULT · PERSONAL ARC
            </p>
            <h1
              className="font-cormorant font-light text-cream"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.1 }}
            >
              Your Emotion Journey
            </h1>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="nmq-label text-mist">Sessions</p>
              <p className="font-cormorant text-2xl text-amber font-light">{entries.length}</p>
            </div>
            <div className="text-right">
              <p className="nmq-label text-mist">Avg Depth</p>
              <p className="font-cormorant text-2xl text-amber font-light">{avgDepth}</p>
            </div>
            <div className="text-right">
              <p className="nmq-label text-mist">Emotions</p>
              <p className="font-cormorant text-2xl text-amber font-light">{allTags.length}</p>
            </div>
          </div>
        </div>
        <div className="h-px bg-amber/10 mt-6" />
      </div>

      {entries.length === 0 ? (
        <EmptyArc />
      ) : (
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-20 space-y-12">

          {/* Filter tabs */}
          <div className="flex gap-1">
            {(['all', 'journal', 'portal'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`nmq-label px-4 py-2 transition-all duration-200 ${
                  activeFilter === f
                    ? 'text-amber border-b border-amber' :'text-silence hover:text-mist'
                }`}
                style={{ fontSize: '0.6rem', letterSpacing: '0.22em' }}
              >
                {f === 'all' ? 'All' : f === 'journal' ? 'Journal' : 'Portal'}
              </button>
            ))}
          </div>

          {/* Depth Score Chart */}
          <section>
            <p className="nmq-label text-mist mb-6" style={{ letterSpacing: '0.22em' }}>
              DEPTH SCORE OVER TIME
            </p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="depthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c8822a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c8822a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 6" stroke="rgba(90,78,64,0.3)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#5a4e40', fontSize: 9, fontFamily: 'Spectral, serif', letterSpacing: '0.1em' }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fill: '#5a4e40', fontSize: 9, fontFamily: 'Spectral, serif' }}
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 5, 10]}
                  />
                  <Tooltip content={<ArcTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="depth"
                    stroke="#c8822a"
                    strokeWidth={1.5}
                    fill="url(#depthGrad)"
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const entry = payload as ArcEntry;
                      return (
                        <circle
                          key={`dot-${entry.id}`}
                          cx={cx}
                          cy={cy}
                          r={entry.source === 'portal' ? 4 : 3}
                          fill={entry.source === 'portal' ? '#d4af37' : '#c8822a'}
                          stroke="#0a0806"
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedEntry(entry)}
                        />
                      );
                    }}
                    activeDot={{ r: 5, fill: '#d4af37', stroke: '#0a0806', strokeWidth: 1 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#c8822a' }} />
                <span className="nmq-label text-silence">Journal entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#d4af37' }} />
                <span className="nmq-label text-silence">Portal session</span>
              </div>
            </div>
          </section>

          {/* Emotion Tag Cloud */}
          {allTags.length > 0 && (
            <section>
              <p className="nmq-label text-mist mb-6" style={{ letterSpacing: '0.22em' }}>
                EMOTION LANDSCAPE
              </p>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const count = entries.filter((e) => e.emotionTags.includes(tag)).length;
                  const size = Math.max(0.6, Math.min(1.1, 0.6 + count * 0.08));
                  return (
                    <span
                      key={tag}
                      className="cursor-default transition-all duration-200"
                      style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontWeight: 300,
                        fontSize: `${size}rem`,
                        color: getEmotionColor(tag),
                        opacity: 0.7 + count * 0.06,
                        letterSpacing: '0.05em',
                        padding: '2px 6px',
                        border: `1px solid ${getEmotionColor(tag)}33`,
                        background: `${getEmotionColor(tag)}0d`,
                        borderRadius: 2,
                      }}
                      title={`${count} ${count === 1 ? 'entry' : 'entries'}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {/* Node Map */}
          <section>
            <p className="nmq-label text-mist mb-6" style={{ letterSpacing: '0.22em' }}>
              NODES VISITED
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(nodeCounts).map(([node, count]) => (
                <div
                  key={node}
                  className="nmq-card p-4 cursor-default transition-all duration-300"
                  style={{
                    borderColor: hoveredNode === node
                      ? `${NODE_COLORS[node] || '#c8822a'}66`
                      : 'rgba(200,130,42,0.12)',
                    background: hoveredNode === node
                      ? `${NODE_COLORS[node] || '#c8822a'}0d`
                      : '#110e0a',
                  }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div
                    className="w-2 h-2 rounded-full mb-3"
                    style={{
                      background: NODE_COLORS[node] || '#c8822a',
                      boxShadow: `0 0 8px ${NODE_COLORS[node] || '#c8822a'}66`,
                    }}
                  />
                  <p
                    className="font-cormorant font-light text-cream mb-1"
                    style={{ fontSize: '1rem' }}
                  >
                    {NODE_LABELS[node] || node}
                  </p>
                  <p className="nmq-label text-mist">
                    {count} {count === 1 ? 'session' : 'sessions'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section ref={timelineRef}>
            <p className="nmq-label text-mist mb-6" style={{ letterSpacing: '0.22em' }}>
              TIMELINE
            </p>
            <div className="relative">
              {/* Vertical ley line */}
              <div
                className="absolute left-3 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,130,42,0.2) 10%, rgba(200,130,42,0.2) 90%, transparent)' }}
              />

              <div className="space-y-1 pl-10">
                {filtered.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Node dot on ley line */}
                    <div
                      className="absolute -left-7 top-4 w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        background: NODE_COLORS[entry.node] || '#c8822a',
                        boxShadow: selectedEntry?.id === entry.id
                          ? `0 0 10px ${NODE_COLORS[entry.node] || '#c8822a'}`
                          : 'none',
                        transform: selectedEntry?.id === entry.id ? 'scale(1.5)' : 'scale(1)',
                      }}
                    />

                    <div
                      className="nmq-card p-4 transition-all duration-300"
                      style={{
                        borderColor: selectedEntry?.id === entry.id
                          ? `${NODE_COLORS[entry.node] || '#c8822a'}44`
                          : 'rgba(200,130,42,0.08)',
                        background: selectedEntry?.id === entry.id
                          ? `${NODE_COLORS[entry.node] || '#c8822a'}08`
                          : '#110e0a',
                      }}
                    >
                      {/* Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="nmq-label text-mist">{entry.dateLabel}</span>
                            <span
                              className="nmq-label px-2 py-0.5"
                              style={{
                                background: `${NODE_COLORS[entry.node] || '#c8822a'}22`,
                                border: `1px solid ${NODE_COLORS[entry.node] || '#c8822a'}44`,
                                color: NODE_COLORS[entry.node] || '#c8822a',
                                borderRadius: 2,
                                fontSize: '0.55rem',
                              }}
                            >
                              {NODE_LABELS[entry.node] || entry.node}
                            </span>
                            <span
                              className="nmq-label px-2 py-0.5"
                              style={{
                                background: entry.source === 'portal' ? 'rgba(212,175,55,0.1)' : 'rgba(200,130,42,0.08)',
                                border: `1px solid ${entry.source === 'portal' ? 'rgba(212,175,55,0.3)' : 'rgba(200,130,42,0.2)'}`,
                                color: entry.source === 'portal' ? '#d4af37' : '#c8822a',
                                borderRadius: 2,
                                fontSize: '0.55rem',
                              }}
                            >
                              {entry.source === 'portal' ? 'Portal' : 'Journal'}
                            </span>
                          </div>

                          {/* Emotion tags */}
                          {entry.emotionTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {entry.emotionTags.slice(0, 5).map((tag) => (
                                <span
                                  key={tag}
                                  className="nmq-label"
                                  style={{
                                    color: getEmotionColor(tag),
                                    fontSize: '0.55rem',
                                    letterSpacing: '0.12em',
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Depth score */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="font-cormorant text-amber font-light" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                            {entry.depthScore.toFixed(1)}
                          </span>
                          <span className="nmq-label text-silence">depth</span>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {selectedEntry?.id === entry.id && (
                        <div className="mt-4 pt-4 border-t border-amber/10 space-y-3">
                          {entry.archetypeHint && (
                            <div>
                              <p className="nmq-label text-mist mb-1">Archetype</p>
                              <p className="nmq-body text-cream" style={{ fontSize: '0.9rem' }}>
                                {entry.archetypeHint}
                              </p>
                            </div>
                          )}
                          {entry.shadowTopics.length > 0 && (
                            <div>
                              <p className="nmq-label text-mist mb-2">Shadow Themes</p>
                              <div className="flex flex-wrap gap-2">
                                {entry.shadowTopics.map((t) => (
                                  <span
                                    key={t}
                                    className="nmq-label px-2 py-1"
                                    style={{
                                      background: 'rgba(90,78,64,0.3)',
                                      border: '1px solid rgba(90,78,64,0.5)',
                                      color: '#a89880',
                                      borderRadius: 2,
                                      fontSize: '0.55rem',
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="nmq-label text-mist mb-1">Words</p>
                              <p className="font-cormorant text-cream font-light">{entry.wordCount}</p>
                            </div>
                            <div>
                              <p className="nmq-label text-mist mb-1">Date</p>
                              <p className="font-cormorant text-cream font-light" style={{ fontSize: '0.9rem' }}>
                                {formatFullDate(entry.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
