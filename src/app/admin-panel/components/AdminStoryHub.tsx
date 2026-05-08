'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';

interface NominatedStory {
  id: string;
  title: string;
  content: string;
  is_winner: boolean;
  is_nominated: boolean;
  created_at: string;
  user_id: string;
  user_profiles?: {
    nickname: string | null;
    email: string;
    assigned_node: string | null;
  };
}

interface UserRow {
  id: string;
  email: string;
  nickname: string | null;
  assigned_node: string | null;
  user_tier: string;
  companion_assigned_at: string | null;
  role: string;
  created_at: string;
}

const NODE_LABELS: Record<string, string> = {
  rtanj: 'Rtanj', sedona: 'Sedona', kailash: 'Kailash',
  shasta: 'Shasta', glastonbury: 'Glastonbury',
  machu_picchu: 'Machu Picchu', esvedra: 'Es Vedrà',
};

type HubTab = 'stories' | 'users';

export default function AdminStoryHub() {
  const supabase = createClient();
  const [hubTab, setHubTab] = useState<HubTab>('stories');

  // ── Stories state ──
  const [stories, setStories] = useState<NominatedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [anointing, setAnointing] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'nominated' | 'winners' | 'all'>('nominated');

  // ── Users state ──
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const loadStories = async () => {
    setLoading(true);
    let query = supabase
      .from('soul_stories')
      .select(`
        id, title, content, is_winner, is_nominated, created_at, user_id,
        user_profiles (nickname, email, assigned_node)
      `)
      .order('created_at', { ascending: false });

    if (filter === 'nominated') {
      query = query.eq('is_nominated', true).eq('is_winner', false);
    } else if (filter === 'winners') {
      query = query.eq('is_winner', true);
    }

    const { data } = await query;
    setStories((data as NominatedStory[]) ?? []);
    setLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('id, email, nickname, assigned_node, user_tier, companion_assigned_at, role, created_at')
      .order('created_at', { ascending: false });
    setUsers((data as UserRow[]) ?? []);
    setUsersLoading(false);
  };

  useEffect(() => { loadStories(); }, [filter]);
  useEffect(() => { if (hubTab === 'users') loadUsers(); }, [hubTab]);

  const handleAnoint = async (storyId: string) => {
    setAnointing(storyId);
    try {
      const res = await fetch('/api/admin/anoint-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      });
      if (res.ok) {
        setSuccessId(storyId);
        setStories((prev) =>
          prev.map((s) =>
            s.id === storyId ? { ...s, is_winner: true, is_nominated: true } : s
          )
        );
        setTimeout(() => setSuccessId(null), 4000);
      }
    } finally {
      setAnointing(null);
    }
  };

  const handleAssignCompanion = async (userId: string, action: 'grant' | 'revoke') => {
    setAssigningId(userId);
    try {
      const res = await fetch('/api/admin/assign-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        setAssignSuccess(userId);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  user_tier: action === 'grant' ? 'companion' : 'free',
                  companion_assigned_at: action === 'grant' ? new Date().toISOString() : null,
                }
              : u
          )
        );
        setTimeout(() => setAssignSuccess(null), 3000);
      }
    } finally {
      setAssigningId(null);
    }
  };

  const nominatedCount = stories.filter((s) => s.is_nominated && !s.is_winner).length;
  const winnersCount = stories.filter((s) => s.is_winner).length;
  const companionCount = users.filter((u) => u.user_tier === 'companion').length;

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.nickname ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
          ADMIN · STORY HUB
        </p>
        <h1 className="nmq-heading text-3xl italic text-gold">
          The Book of Voices
        </h1>
        <p className="font-cormorant italic text-mist text-base mt-1">
          Review nominated stories. Anoint the ones that deserve eternity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'AWAITING REVIEW', value: nominatedCount, color: '#c8822a' },
          { label: 'ANOINTED WINNERS', value: winnersCount, color: '#D4AF37' },
          { label: 'COMPANIONS', value: companionCount, color: '#5a4e40' },
        ].map((stat) => (
          <div key={stat.label} className="nmq-card p-4">
            <p className="nmq-label mb-1" style={{ fontSize: '0.45rem', color: stat.color }}>
              {stat.label}
            </p>
            <p className="font-cormorant text-2xl text-cream">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Hub Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-amber/10">
        {(['stories', 'users'] as HubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setHubTab(t)}
            className={`px-4 py-2.5 nmq-label transition-colors ${
              hubTab === t
                ? 'text-amber border-b-2 border-amber' :'text-silence hover:text-mist'
            }`}
            style={{ fontSize: '0.5rem' }}
          >
            {t === 'stories' ? 'STORIES' : 'USER MANAGEMENT'}
          </button>
        ))}
      </div>

      {/* ── Stories Tab ── */}
      {hubTab === 'stories' && (
        <>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 mb-6">
            {(['nominated', 'winners', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 nmq-label transition-colors ${
                  filter === f
                    ? 'text-amber border border-amber/30 bg-amber/5' :'text-silence hover:text-mist'
                }`}
                style={{ fontSize: '0.5rem' }}
              >
                {f === 'nominated' ? 'NOMINATED' : f === 'winners' ? 'ANOINTED' : 'ALL STORIES'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-cormorant italic text-silence text-lg">
                {filter === 'nominated' ?'No stories awaiting review.'
                  : filter === 'winners' ?'No stories have been anointed yet.' :'No stories found.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="nmq-card p-6 transition-all duration-300"
                  style={{
                    border: story.is_winner
                      ? '1px solid rgba(212,175,55,0.4)'
                      : '1px solid rgba(200,130,42,0.15)',
                    background: story.is_winner ? 'rgba(212,175,55,0.04)' : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {story.is_winner && (
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: '#FFD700', boxShadow: '0 0 6px rgba(255,215,0,0.8)' }}
                          />
                        )}
                        <h3 className="font-cormorant italic text-cream text-lg truncate">
                          {story.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#c8822a' }}>
                          {story.user_profiles?.nickname ?? story.user_profiles?.email ?? 'Anonymous'}
                        </span>
                        {story.user_profiles?.assigned_node && (
                          <>
                            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>·</span>
                            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                              {NODE_LABELS[story.user_profiles.assigned_node] ?? story.user_profiles.assigned_node}
                            </span>
                          </>
                        )}
                        <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>·</span>
                        <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
                          {new Date(story.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedId(expandedId === story.id ? null : story.id)}
                        className="p-2 text-silence hover:text-mist transition-colors"
                      >
                        <Icon name={expandedId === story.id ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={14} />
                      </button>

                      {!story.is_winner && (
                        <button
                          onClick={() => handleAnoint(story.id)}
                          disabled={anointing === story.id}
                          className="flex items-center gap-2 px-4 py-2 transition-all duration-200 disabled:opacity-40"
                          style={{
                            background: 'rgba(212,175,55,0.1)',
                            border: '1px solid rgba(212,175,55,0.4)',
                            color: '#D4AF37',
                          }}
                        >
                          <Icon name="StarIcon" size={12} />
                          <span className="nmq-label" style={{ fontSize: '0.45rem' }}>
                            {anointing === story.id ? 'ANOINTING...' : 'ANOINT WINNER'}
                          </span>
                        </button>
                      )}

                      {story.is_winner && (
                        <div
                          className="flex items-center gap-2 px-4 py-2"
                          style={{ border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: '#FFD700', boxShadow: '0 0 4px rgba(255,215,0,0.8)' }}
                          />
                          <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#D4AF37' }}>
                            ANOINTED
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {successId === story.id && (
                    <div
                      className="mb-3 px-4 py-2"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)' }}
                    >
                      <p className="font-cormorant italic text-gold text-sm">
                        ✦ Story anointed. Gold star set for 7 days. Email sent: "Tvoja tišina je postala svetlost."
                      </p>
                    </div>
                  )}

                  {expandedId === story.id && (
                    <div
                      className="mt-4 pt-4 border-t border-amber/10"
                      style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        fontSize: '0.95rem',
                        lineHeight: '1.85',
                        color: 'rgba(232,224,208,0.8)',
                      }}
                    >
                      {story.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Users Tab ── */}
      {hubTab === 'users' && (
        <>
          <div className="mb-5">
            <p className="font-cormorant italic text-mist text-sm mb-4">
              Manually assign Companion tier to users while payment gateway is being configured.
            </p>
            {/* Search */}
            <div className="relative max-w-sm">
              <Icon
                name="MagnifyingGlassIcon"
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-silence"
              />
              <input
                type="text"
                placeholder="Search by email or nickname..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-void border border-amber/15 text-cream placeholder-silence focus:outline-none focus:border-amber/40 transition-colors"
                style={{ fontSize: '0.75rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex justify-center py-16">
              <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-cormorant italic text-silence text-lg">No users found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="nmq-card p-5 flex items-center justify-between gap-4"
                  style={{
                    border: u.user_tier === 'companion' ?'1px solid rgba(212,175,55,0.3)' :'1px solid rgba(200,130,42,0.12)',
                    background: u.user_tier === 'companion' ? 'rgba(212,175,55,0.03)' : undefined,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {u.user_tier === 'companion' && (
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: '#D4AF37', boxShadow: '0 0 4px rgba(212,175,55,0.7)' }}
                        />
                      )}
                      <span className="font-cormorant italic text-cream text-base truncate">
                        {u.nickname ?? u.email}
                      </span>
                      {u.role === 'admin' && (
                        <span
                          className="nmq-label px-1.5 py-0.5"
                          style={{
                            fontSize: '0.38rem',
                            color: '#c8822a',
                            border: '1px solid rgba(200,130,42,0.3)',
                            background: 'rgba(200,130,42,0.08)',
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                        {u.email}
                      </span>
                      {u.assigned_node && (
                        <>
                          <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>·</span>
                          <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                            {NODE_LABELS[u.assigned_node] ?? u.assigned_node}
                          </span>
                        </>
                      )}
                      <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>·</span>
                      <span
                        className="nmq-label"
                        style={{
                          fontSize: '0.4rem',
                          color: u.user_tier === 'companion' ? '#D4AF37' : '#5a4e40',
                        }}
                      >
                        {u.user_tier === 'companion' ? 'COMPANION' : 'BASIC'}
                      </span>
                      {u.companion_assigned_at && (
                        <>
                          <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>·</span>
                          <span className="nmq-label" style={{ fontSize: '0.38rem', color: '#3a3028' }}>
                            since {new Date(u.companion_assigned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {assignSuccess === u.id && (
                      <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#D4AF37' }}>
                        ✦ Updated
                      </span>
                    )}

                    {u.user_tier !== 'companion' ? (
                      <button
                        onClick={() => handleAssignCompanion(u.id, 'grant')}
                        disabled={assigningId === u.id}
                        className="flex items-center gap-2 px-4 py-2 transition-all duration-200 disabled:opacity-40"
                        style={{
                          background: 'rgba(212,175,55,0.08)',
                          border: '1px solid rgba(212,175,55,0.35)',
                          color: '#D4AF37',
                        }}
                      >
                        <Icon name="StarIcon" size={11} />
                        <span className="nmq-label" style={{ fontSize: '0.42rem' }}>
                          {assigningId === u.id ? 'GRANTING...' : 'GRANT COMPANION'}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignCompanion(u.id, 'revoke')}
                        disabled={assigningId === u.id}
                        className="flex items-center gap-2 px-4 py-2 transition-all duration-200 disabled:opacity-40"
                        style={{
                          background: 'rgba(90,78,64,0.15)',
                          border: '1px solid rgba(90,78,64,0.4)',
                          color: '#8a7a6a',
                        }}
                      >
                        <Icon name="XMarkIcon" size={11} />
                        <span className="nmq-label" style={{ fontSize: '0.42rem' }}>
                          {assigningId === u.id ? 'REVOKING...' : 'REVOKE'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
