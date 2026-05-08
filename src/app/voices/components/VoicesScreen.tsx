'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface WinnerStory {
  id: string;
  title: string;
  content: string;
  pinned_at: string | null;
  anointed_at: string | null;
  created_at: string;
  user_profiles?: {
    nickname: string | null;
    assigned_node: string | null;
  };
}

const NODE_LABELS: Record<string, string> = {
  rtanj: 'Rtanj',
  sedona: 'Sedona',
  kailash: 'Kailash',
  shasta: 'Shasta',
  glastonbury: 'Glastonbury',
  machu_picchu: 'Machu Picchu',
  esvedra: 'Es Vedrà',
};

export default function VoicesScreen() {
  const supabase = createClient();
  const [stories, setStories] = useState<WinnerStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('soul_stories')
      .select(`
        id, title, content, pinned_at, anointed_at, created_at,
        user_profiles (nickname, assigned_node)
      `)
      .eq('is_winner', true)
      .order('pinned_at', { ascending: false })
      .then(({ data }) => {
        setStories((data as WinnerStory[]) ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.06) 0%, rgba(10,8,6,1) 50%)',
      }}
    >
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Gold sigil */}
        <div className="flex justify-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              border: '1px solid rgba(212,175,55,0.4)',
              boxShadow: '0 0 40px rgba(212,175,55,0.15)',
            }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.1) 70%)',
                boxShadow: '0 0 20px rgba(212,175,55,0.5)',
                animation: 'pulseAmber 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        <p className="nmq-label mb-4" style={{ fontSize: '0.5rem', color: '#D4AF37', letterSpacing: '0.35em' }}>
          THE VOICES
        </p>
        <h1
          className="font-cormorant font-light text-3xl md:text-4xl text-gold mb-6 leading-relaxed"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
        >
          Ovo su odjeci planine.
        </h1>
        <p
          className="font-cormorant italic text-mist/80 text-lg leading-relaxed"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Glasovi koji su zaslužili da budu zapisani u večnost.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3))' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.8)' }} />
          <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.3))' }} />
        </div>
      </div>

      {/* Stories */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-cormorant italic text-silence text-xl">
              The mountain is still listening. No voices have been anointed yet.
            </p>
            <p className="nmq-label mt-4" style={{ fontSize: '0.45rem', color: '#3a3028' }}>
              RETURN WHEN THE SILENCE HAS SPOKEN
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {stories.map((story, index) => (
              <VoiceCard
                key={story.id}
                story={story}
                index={index}
                expanded={expandedId === story.id}
                onToggle={() => setExpandedId(expandedId === story.id ? null : story.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VoiceCard({
  story,
  index,
  expanded,
  onToggle,
}: {
  story: WinnerStory;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const node = story.user_profiles?.assigned_node;
  const nodeLabel = node ? NODE_LABELS[node] ?? node : null;
  const anointedDate = story.anointed_at
    ? new Date(story.anointed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const preview = story.content.slice(0, 400);

  return (
    <div
      className="relative"
      style={{
        background: 'linear-gradient(135deg, rgba(245,235,210,0.05) 0%, rgba(212,175,55,0.03) 50%, rgba(200,130,42,0.02) 100%)',
        border: '1px solid rgba(212,175,55,0.2)',
        boxShadow: '0 0 40px rgba(212,175,55,0.04)',
      }}
    >
      {/* Parchment lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 30px,
            rgba(212,175,55,0.1) 30px,
            rgba(212,175,55,0.1) 31px
          )`,
        }}
      />

      <div className="relative z-10 p-8 md:p-10">
        {/* Story number */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-cormorant italic text-gold/40"
            style={{ fontSize: '2.5rem', lineHeight: 1 }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(212,175,55,0.15)' }} />
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#FFD700', boxShadow: '0 0 8px rgba(255,215,0,0.7)', animation: 'pulseAmber 2.5s ease-in-out infinite' }}
            />
            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#D4AF37', letterSpacing: '0.25em' }}>
              ANOINTED
            </span>
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-cream mb-2"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '1.6rem',
            fontStyle: 'italic',
            fontWeight: 300,
          }}
        >
          {story.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          {nodeLabel && (
            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#c8822a' }}>
              {nodeLabel.toUpperCase()}
            </span>
          )}
          {nodeLabel && anointedDate && (
            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#3a3028' }}>·</span>
          )}
          {anointedDate && (
            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
              {anointedDate}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className="text-mist/85 leading-relaxed mb-6"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '1rem',
            lineHeight: '1.9',
          }}
        >
          {expanded ? (
            <p>{story.content}</p>
          ) : (
            <p>
              {preview}
              {story.content.length > 400 && (
                <>
                  <span className="text-silence">...</span>
                </>
              )}
            </p>
          )}
        </div>

        {story.content.length > 400 && (
          <button
            onClick={onToggle}
            className="font-cormorant italic text-amber/60 hover:text-amber transition-colors text-sm"
          >
            {expanded ? '— read less' : '— read the full story'}
          </button>
        )}
      </div>
    </div>
  );
}
