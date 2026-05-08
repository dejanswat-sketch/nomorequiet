'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';

type WriteMode = 'daily' | 'soul';

interface SoulStory {
  id: string;
  title: string;
  content: string;
  is_nominated: boolean;
  is_winner: boolean;
  created_at: string;
}

export default function WriteScreen() {
  const [mode, setMode] = useState<WriteMode>('daily');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-void">
      {/* Mode Toggle */}
      <div className="border-b border-amber/10 bg-void/95 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-8">
          <button
            onClick={() => setMode('daily')}
            className={`flex items-center gap-2 transition-all duration-200 ${
              mode === 'daily' ?'text-amber border-b-2 border-amber pb-1' :'text-mist hover:text-cream pb-1'
            }`}
          >
            <span className="nmq-label text-xs">DAILY MIRROR</span>
          </button>
          <button
            onClick={() => setMode('soul')}
            className={`flex items-center gap-2 transition-all duration-200 ${
              mode === 'soul' ?'text-amber border-b-2 border-amber pb-1' :'text-mist hover:text-cream pb-1'
            }`}
          >
            <span className="nmq-label text-xs">THE SOUL STORY</span>
          </button>
          <div className="flex-1" />
          <p className="font-cormorant italic text-silence text-sm">
            {mode === 'daily' ? 'Private · Dark · Yours alone.' : 'For the mountain. For eternity.'}
          </p>
        </div>
      </div>

      {mode === 'daily' ? (
        <DailyMirrorPanel userId={user?.id} />
      ) : (
        <SoulStoryPanel userId={user?.id} />
      )}
    </div>
  );
}

/* ─── Daily Mirror ─────────────────────────────────────────────────────── */

function DailyMirrorPanel({ userId }: { userId?: string }) {
  // Render the existing JournalLayout for Daily Mirror
  const JournalLayout = React.lazy(() => import('./JournalLayout'));
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
      </div>
    }>
      <JournalLayout />
    </React.Suspense>
  );
}

/* ─── Soul Story ───────────────────────────────────────────────────────── */

function SoulStoryPanel({ userId }: { userId?: string }) {
  const supabase = createClient();
  const [stories, setStories] = useState<SoulStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nominating, setNominating] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('soul_stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setStories(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const handleContentChange = (val: string) => {
    setContent(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
  };

  const handleSave = async () => {
    if (!userId || !title.trim() || !content.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('soul_stories')
      .insert({ user_id: userId, title: title.trim(), content: content.trim() })
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      setStories((prev) => [data, ...prev]);
      setTitle('');
      setContent('');
      setWordCount(0);
      setShowForm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleNominate = async (storyId: string) => {
    if (!userId) return;
    setNominating(storyId);
    const { error } = await supabase
      .from('soul_stories')
      .update({ is_nominated: true })
      .eq('id', storyId)
      .eq('user_id', userId);
    setNominating(null);
    if (!error) {
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, is_nominated: true } : s))
      );
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(200,130,42,0.04) 0%, rgba(10,8,6,1) 60%)',
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="nmq-label mb-3" style={{ fontSize: '0.5rem', color: '#c8822a', letterSpacing: '0.3em' }}>
            THE SOUL STORY
          </p>
          <h1
            className="font-cormorant font-light text-4xl text-gold mb-3"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
          >
            Write what the mountain must remember.
          </h1>
          <p className="font-cormorant italic text-mist/70 text-base">
            These are not journal entries. These are stories. They may be nominated for the NMQ Book —
            an archive of voices that earned their place in silence.
          </p>
        </div>

        {/* New Story Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-8 py-4 border border-amber/20 hover:border-amber/50 transition-all duration-300 group"
            style={{
              background: 'rgba(200,130,42,0.03)',
            }}
          >
            <span className="font-cormorant italic text-mist group-hover:text-cream text-lg">
              + Begin a new story
            </span>
          </button>
        )}

        {saveSuccess && (
          <div className="mb-6 px-4 py-3 border border-amber/30 bg-amber/5">
            <p className="font-cormorant italic text-amber text-sm">
              Your story has been saved to the vault.
            </p>
          </div>
        )}

        {/* Write Form — Parchment UI */}
        {showForm && (
          <div
            className="mb-10 p-8 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(245,235,210,0.06) 0%, rgba(220,200,160,0.03) 50%, rgba(200,130,42,0.04) 100%)',
              border: '1px solid rgba(200,130,42,0.25)',
              boxShadow: 'inset 0 0 60px rgba(200,130,42,0.03)',
            }}
          >
            {/* Parchment texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 28px,
                  rgba(200,130,42,0.08) 28px,
                  rgba(200,130,42,0.08) 29px
                )`,
              }}
            />

            <div className="relative z-10">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of your story..."
                className="w-full bg-transparent border-none outline-none mb-6 text-cream placeholder-silence/50"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1.5rem',
                  fontStyle: 'italic',
                  borderBottom: '1px solid rgba(200,130,42,0.2)',
                  paddingBottom: '12px',
                }}
              />
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your story here. Take your time. The mountain is listening..."
                rows={14}
                className="w-full bg-transparent border-none outline-none resize-none text-cream/90 placeholder-silence/40 leading-relaxed"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1rem',
                  lineHeight: '1.9',
                }}
              />

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber/10">
                <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                  {wordCount} WORDS
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setShowForm(false); setTitle(''); setContent(''); setWordCount(0); }}
                    className="nmq-label text-silence hover:text-mist transition-colors"
                    style={{ fontSize: '0.5rem' }}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !title.trim() || !content.trim()}
                    className="amber-btn text-xs px-6 py-2 disabled:opacity-40"
                  >
                    {saving ? 'Saving...' : 'Save Story'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-cormorant italic text-silence text-lg">
              No stories yet. The mountain waits.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {stories.map((story) => (
              <SoulStoryCard
                key={story.id}
                story={story}
                onNominate={handleNominate}
                nominating={nominating === story.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SoulStoryCard({
  story,
  onNominate,
  nominating,
}: {
  story: SoulStory;
  onNominate: (id: string) => void;
  nominating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = story.content.slice(0, 220);

  return (
    <div
      className="p-6 relative transition-all duration-300"
      style={{
        background: story.is_winner
          ? 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(200,130,42,0.04) 100%)'
          : 'linear-gradient(135deg, rgba(245,235,210,0.04) 0%, rgba(200,130,42,0.02) 100%)',
        border: story.is_winner
          ? '1px solid rgba(212,175,55,0.4)'
          : story.is_nominated
          ? '1px solid rgba(200,130,42,0.3)'
          : '1px solid rgba(200,130,42,0.12)',
      }}
    >
      {story.is_winner && (
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#FFD700', boxShadow: '0 0 8px rgba(255,215,0,0.8)' }}
          />
          <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#FFD700', letterSpacing: '0.25em' }}>
            ANOINTED · IN THE BOOK OF VOICES
          </span>
        </div>
      )}
      {story.is_nominated && !story.is_winner && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-amber" />
          <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#c8822a', letterSpacing: '0.25em' }}>
            NOMINATED FOR THE NMQ BOOK
          </span>
        </div>
      )}

      <h3
        className="text-cream mb-3"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.2rem', fontStyle: 'italic' }}
      >
        {story.title}
      </h3>

      <p
        className="text-mist/80 leading-relaxed mb-4"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.95rem', lineHeight: '1.8' }}
      >
        {expanded ? story.content : preview}
        {!expanded && story.content.length > 220 && (
          <button
            onClick={() => setExpanded(true)}
            className="text-amber/70 hover:text-amber ml-1 font-cormorant italic"
          >
            ...read more
          </button>
        )}
      </p>

      <div className="flex items-center justify-between">
        <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
          {new Date(story.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>

        {!story.is_nominated && !story.is_winner && (
          <button
            onClick={() => onNominate(story.id)}
            disabled={nominating}
            className="flex items-center gap-2 px-4 py-2 border border-amber/30 hover:border-amber/60 transition-all duration-200 group disabled:opacity-40"
            style={{ background: 'rgba(200,130,42,0.05)' }}
          >
            <Icon name="BookOpenIcon" size={12} className="text-amber/70 group-hover:text-amber" />
            <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#c8822a' }}>
              {nominating ? 'NOMINATING...' : 'NOMINATE FOR NMQ BOOK'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
