'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AppNav from '@/components/AppNav';
import Icon from '@/components/ui/AppIcon';
import WinCelebration from './WinCelebration';

interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  assigned_node: string;
  role: string;
  user_tier: string;
  companion_assigned_at: string | null;
  created_at: string;
}

interface SoulStory {
  id: string;
  title: string;
  content: string;
  is_nominated: boolean;
  is_winner: boolean;
  anointed_at: string | null;
  created_at: string;
}

interface WinNotification {
  id: string;
  story_id: string;
  story_title: string;
  seen: boolean;
  created_at: string;
}

const NODE_LABELS: Record<string, string> = {
  rtanj: 'Rtanj', sedona: 'Sedona', kailash: 'Kailash',
  shasta: 'Shasta', glastonbury: 'Glastonbury',
  machu_picchu: 'Machu Picchu', esvedra: 'Es Vedrà',
};

const TIER_CONFIG: Record<string, { label: string; color: string; glow: string; desc: string }> = {
  companion: {
    label: 'Companion',
    color: '#D4AF37',
    glow: 'rgba(212,175,55,0.35)',
    desc: 'Full access · AI Portal · Deep Insight · Soul Stories',
  },
  free: {
    label: 'Basic',
    color: '#c8822a',
    glow: 'rgba(200,130,42,0.2)',
    desc: 'Daily Mirror · Map of Lights · Public Voices',
  },
};

export default function DashboardScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stories, setStories] = useState<SoulStory[]>([]);
  const [winNotif, setWinNotif] = useState<WinNotification | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const loadDashboard = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('id, email, nickname, assigned_node, role, user_tier, companion_assigned_at, created_at')
        .eq('id', userId)
        .single();

      if (profileData) setProfile(profileData as UserProfile);

      // Load soul stories
      const { data: storiesData } = await supabase
        .from('soul_stories')
        .select('id, title, content, is_nominated, is_winner, anointed_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setStories((storiesData as SoulStory[]) ?? []);

      // Load unseen win notifications
      const { data: notifData } = await supabase
        .from('win_notifications')
        .select('id, story_id, story_title, seen, created_at')
        .eq('user_id', userId)
        .eq('seen', false)
        .order('created_at', { ascending: false })
        .limit(1);

      if (notifData && notifData.length > 0) {
        setWinNotif(notifData[0] as WinNotification);
        setShowCelebration(true);
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-up-login-screen');
    }
    if (user) {
      loadDashboard(user.id);
    }
  }, [user, authLoading, router, loadDashboard]);

  const handleDismissCelebration = async () => {
    setShowCelebration(false);
    if (winNotif) {
      await supabase
        .from('win_notifications')
        .update({ seen: true })
        .eq('id', winNotif.id);
      setWinNotif(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <span className="light-dot pulse-amber" style={{ width: '10px', height: '10px' }} />
      </div>
    );
  }

  if (!user || !profile) return null;

  const tier = TIER_CONFIG[profile.user_tier] ?? TIER_CONFIG.free;
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });
  const winnerStories = stories.filter((s) => s.is_winner);
  const nominatedStories = stories.filter((s) => s.is_nominated && !s.is_winner);
  const regularStories = stories.filter((s) => !s.is_nominated && !s.is_winner);

  return (
    <>
      <AppNav variant="solid" />

      {/* Win Celebration Overlay */}
      {showCelebration && winNotif && (
        <WinCelebration
          storyTitle={winNotif.story_title}
          onDismiss={handleDismissCelebration}
        />
      )}

      <div className="min-h-screen bg-void pt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* ── Profile Header ─────────────────────────────── */}
          <div className="mb-10">
            <p className="nmq-label mb-1" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
              YOUR SANCTUARY
            </p>
            <h1 className="nmq-heading text-4xl italic text-gold mb-6">
              {profile.nickname ?? profile.email.split('@')[0]}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tier Card */}
              <div
                className="nmq-card p-5 col-span-1 md:col-span-2"
                style={{
                  border: `1px solid ${tier.color}40`,
                  boxShadow: `0 0 24px ${tier.glow}`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="nmq-label mb-1" style={{ fontSize: '0.45rem', color: tier.color }}>
                      CURRENT TIER
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: tier.color, boxShadow: `0 0 8px ${tier.glow}` }}
                      />
                      <span
                        className="font-cormorant italic text-2xl"
                        style={{ color: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>
                  </div>
                  {profile.user_tier === 'companion' && profile.companion_assigned_at && (
                    <div className="text-right">
                      <p className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                        GRANTED
                      </p>
                      <p className="nmq-label" style={{ fontSize: '0.4rem', color: '#c8822a' }}>
                        {new Date(profile.companion_assigned_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
                <p className="font-cormorant italic text-silence text-sm">{tier.desc}</p>
                {profile.user_tier === 'free' && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 mt-4 nmq-label transition-colors hover:text-amber"
                    style={{ fontSize: '0.45rem', color: '#c8822a' }}
                  >
                    <Icon name="ArrowUpCircleIcon" size={12} />
                    BECOME A COMPANION
                  </Link>
                )}
              </div>

              {/* Info Card */}
              <div className="nmq-card p-5">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="nmq-label mb-0.5" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                      NODE
                    </p>
                    <p className="font-cormorant italic text-cream text-base">
                      {NODE_LABELS[profile.assigned_node] ?? profile.assigned_node}
                    </p>
                  </div>
                  <div className="w-full h-px bg-amber/8" />
                  <div>
                    <p className="nmq-label mb-0.5" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                      MEMBER SINCE
                    </p>
                    <p className="font-cormorant italic text-cream text-sm">{memberSince}</p>
                  </div>
                  <div className="w-full h-px bg-amber/8" />
                  <div>
                    <p className="nmq-label mb-0.5" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                      SOUL STORIES
                    </p>
                    <p className="font-cormorant italic text-cream text-base">{stories.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Soul Stories ───────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="nmq-label mb-0.5" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
                  YOUR ECHOES
                </p>
                <h2 className="font-cormorant italic text-cream text-2xl">Soul Stories</h2>
              </div>
              <Link
                href="/journal-screen"
                className="flex items-center gap-2 amber-btn text-xs px-4 py-2"
              >
                <Icon name="PencilSquareIcon" size={12} />
                Write New
              </Link>
            </div>

            {stories.length === 0 ? (
              <div
                className="nmq-card p-10 text-center"
                style={{ border: '1px solid rgba(200,130,42,0.1)' }}
              >
                <p className="font-cormorant italic text-silence text-lg mb-2">
                  Your silence is still unwritten.
                </p>
                <p className="font-cormorant italic text-silence text-sm mb-6">
                  Every great echo begins with a single word.
                </p>
                <Link
                  href="/journal-screen"
                  className="inline-flex items-center gap-2 nmq-label transition-colors hover:text-amber"
                  style={{ fontSize: '0.5rem', color: '#c8822a' }}
                >
                  <Icon name="PencilSquareIcon" size={12} />
                  WRITE YOUR FIRST SOUL STORY
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Winners */}
                {winnerStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    badge="winner"
                    expanded={expandedStory === story.id}
                    onToggle={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                  />
                ))}
                {/* Nominated */}
                {nominatedStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    badge="nominated"
                    expanded={expandedStory === story.id}
                    onToggle={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                  />
                ))}
                {/* Regular */}
                {regularStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    badge="none"
                    expanded={expandedStory === story.id}
                    onToggle={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Quick Links ────────────────────────────────── */}
          <div className="mt-12 pt-8 border-t border-amber/8">
            <p className="nmq-label mb-4" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
              QUICK ACCESS
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/journal-screen', label: 'Write', icon: 'PencilSquareIcon' },
                { href: '/portal', label: 'Portal', icon: 'SparklesIcon' },
                { href: '/voices', label: 'Voices', icon: 'BookOpenIcon' },
                { href: '/map-of-lights', label: 'Map of Lights', icon: 'GlobeAltIcon' },
                { href: '/personal-arc', label: 'Personal Arc', icon: 'ChartBarIcon' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2.5 nmq-card transition-all duration-200 hover:border-amber/30 group"
                  style={{ border: '1px solid rgba(200,130,42,0.12)' }}
                >
                  <Icon
                    name={link.icon as Parameters<typeof Icon>[0]['name']}
                    size={13}
                    className="text-silence group-hover:text-amber transition-colors"
                  />
                  <span className="nmq-label group-hover:text-cream transition-colors" style={{ fontSize: '0.45rem', color: '#8a7a6a' }}>
                    {link.label.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── Story Card ──────────────────────────────────────────────── */
interface StoryCardProps {
  story: SoulStory;
  badge: 'winner' | 'nominated' | 'none';
  expanded: boolean;
  onToggle: () => void;
}

function StoryCard({ story, badge, expanded, onToggle }: StoryCardProps) {
  const preview = story.content.slice(0, 160) + (story.content.length > 160 ? '…' : '');

  return (
    <div
      className="nmq-card p-5 transition-all duration-300 cursor-pointer"
      style={{
        border: badge === 'winner' ?'1px solid rgba(212,175,55,0.45)'
          : badge === 'nominated' ?'1px solid rgba(200,130,42,0.3)' :'1px solid rgba(200,130,42,0.12)',
        background: badge === 'winner' ? 'rgba(212,175,55,0.03)' : undefined,
      }}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {badge === 'winner' && (
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: '#FFD700', boxShadow: '0 0 6px rgba(255,215,0,0.8)' }}
              />
            )}
            {badge === 'nominated' && (
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#c8822a', boxShadow: '0 0 4px rgba(200,130,42,0.6)' }}
              />
            )}
            <h3
              className="font-cormorant italic text-lg truncate"
              style={{ color: badge === 'winner' ? '#D4AF37' : '#e8e0d0' }}
            >
              {story.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 mb-2">
            {badge === 'winner' && (
              <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#D4AF37' }}>
                ✦ WINNER OF THE WEEK
              </span>
            )}
            {badge === 'nominated' && (
              <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#c8822a' }}>
                NOMINATED
              </span>
            )}
            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
              {new Date(story.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>

          {!expanded && (
            <p
              className="font-cormorant italic text-sm leading-relaxed"
              style={{ color: 'rgba(232,224,208,0.55)', fontFamily: 'Georgia, serif' }}
            >
              {preview}
            </p>
          )}
        </div>

        <Icon
          name={expanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          size={14}
          className="text-silence flex-shrink-0 mt-1"
        />
      </div>

      {expanded && (
        <div
          className="mt-4 pt-4 border-t border-amber/10"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '0.95rem',
            lineHeight: '1.85',
            color: 'rgba(232,224,208,0.82)',
          }}
        >
          {story.content}
        </div>
      )}
    </div>
  );
}
