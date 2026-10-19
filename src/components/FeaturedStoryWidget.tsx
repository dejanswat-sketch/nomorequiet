'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface WinnerStory {
  id: string;
  title: string;
  content: string;
  user_profiles?: {
    nickname: string | null;
    assigned_node: string | null;
  };
}

// Koncept v2: ne izmišljamo tuđe riječi. Dok nema stvarnog pobjedničkog unosa,
// govori sama Kuća — i to je jasno označeno.
const EMPTY_LINE =
  'Nothing has been written here yet. The first echo could be yours.';

function getFirstTwoSentences(text: string): string {
  const cleaned = text.replace(/\n+/g, ' ').trim();
  const matches = cleaned.match(/[^.!?]*[.!?]+/g);
  if (!matches) return cleaned.slice(0, 180);
  return matches.slice(0, 2).join(' ').trim();
}

export default function FeaturedStoryWidget() {
  const supabase = createClient();
  const [story, setStory] = useState<WinnerStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('soul_stories')
      .select('id, title, content, user_profiles(nickname, assigned_node)')
      .eq('is_winner', true)
      .order('pinned_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        setStory(data as WinnerStory | null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div
      className="relative rounded-xl px-6 py-5 max-w-xl w-full"
      style={{
        background: 'rgba(10, 8, 6, 0.85)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow:
          '0 0 18px rgba(212, 175, 55, 0.18), 0 0 4px rgba(212, 175, 55, 0.10), inset 0 0 24px rgba(212, 175, 55, 0.04)',
      }}
    >
      {/* Gold top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent)',
        }}
      />

      {/* Label — „Echo" samo kad je stvarni unos; inače govori Kuća */}
      <p
        className="text-xs uppercase tracking-widest mb-3"
        style={{ color: 'rgba(212,175,55,0.55)', fontFamily: 'Georgia, serif', letterSpacing: '0.18em' }}
      >
        {story ? 'Featured Echo' : 'From the House'}
      </p>

      {story ? (
        <>
          {/* Title */}
          <h3
            className="text-base font-semibold mb-2 leading-snug"
            style={{ color: '#e8dcc8', fontFamily: 'Georgia, serif' }}
          >
            {story.title}
          </h3>

          {/* First two sentences */}
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: 'rgba(232,220,200,0.65)', fontFamily: 'Georgia, serif' }}
          >
            {getFirstTwoSentences(story.content)}
            <span style={{ color: 'rgba(212,175,55,0.4)' }}> …</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/voices"
              className="text-xs transition-colors duration-200"
              style={{ color: 'rgba(212,175,55,0.8)', fontFamily: 'Georgia, serif', letterSpacing: '0.04em' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFD700')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(212,175,55,0.8)')}
            >
              Read the full echo at The Voices →
            </Link>
            <span style={{ color: 'rgba(212,175,55,0.2)' }}>|</span>
            <Link
              href="/journal-screen"
              className="text-xs transition-colors duration-200"
              style={{ color: 'rgba(200,190,175,0.55)', fontFamily: 'Georgia, serif' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(212,175,55,0.8)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(200,190,175,0.55)')}
            >
              Write your story
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Prazno stanje — bez navodnika, jer ovo nije tuđi citat */}
          <p
            className="text-sm leading-relaxed mb-4 italic"
            style={{ color: 'rgba(232,220,200,0.60)', fontFamily: 'Georgia, serif' }}
          >
            {EMPTY_LINE}
          </p>

          {/* CTA */}
          <Link
            href="/journal-screen"
            className="text-xs transition-colors duration-200"
            style={{ color: 'rgba(212,175,55,0.75)', fontFamily: 'Georgia, serif', letterSpacing: '0.04em' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = '#FFD700')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(212,175,55,0.75)')}
          >
            Write your story — be the first echo →
          </Link>
        </>
      )}

      {/* Gold bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)',
        }}
      />
    </div>
  );
}
