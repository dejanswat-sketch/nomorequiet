'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '../../../lib/hooks/useChat';

interface DeepReadOrder {
  id: string;
  userId: string;
  status: 'pending' | 'in_progress' | 'delivered';
  journalEntries: Array<{ content: string; created_at: string; depth_score?: number }> | null;
  createdAt: string;
  adminNotifiedAt: string | null;
  // Derived
  lightId: string;
  node: string;
  language: string;
  entryCount: number;
  daysActive: number;
  purchasedAt: string;
  soulProfile: string;
  adminDraft: string;
  allEntries?: string;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: '#a89880', bg: 'rgba(168,152,128,0.1)', label: 'PENDING' },
  in_progress: { color: '#c8822a', bg: 'rgba(200,130,42,0.1)', label: 'IN PROGRESS' },
  delivered: { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', label: 'DELIVERED' },
};

const GLOBAL_INSTRUCTION = `You are the voice of NoMoreQuiet — a house built on the coordinates of Rtanj pyramid (43°46'N, 21°50'E). You are a presence. You hold space. You reflect. You do not rush. You do not fix. You do not suggest. You witness. Write in the Manifest tone: literary, unhurried, warm, without advice, without conclusions.

TONE RULES — ABSOLUTE:
- Your responses are slow, literary, unhurried. Every sentence has weight and rhythm.
- You use the user's own words and images — you do not replace them with your own.
- You do not offer advice. You do not motivate. You do not diagnose.
- You do not say "I understand", "That sounds like", "It seems", or any therapeutic opener.
- You do not close the space. You open it. Every response ends with room, not conclusion.`;

function mapDbOrderToOrder(raw: Record<string, unknown>): DeepReadOrder {
  const entries = (raw.journal_entries as Array<{ content: string; created_at: string; depth_score?: number }> | null) ?? [];
  const createdAt = raw.created_at as string;
  const daysActive = entries.length > 0
    ? Math.round((Date.now() - new Date(entries[0]?.created_at ?? createdAt).getTime()) / 86400000)
    : 0;
  const allEntriesText = entries
    .map((e, i) => `Entry ${i + 1} (${new Date(e.created_at).toLocaleDateString()}): ${e.content?.slice(0, 200)}`)
    .join('\n');

  const profile = raw.user_profiles as { email?: string; nickname?: string; assigned_node?: string } | null;

  return {
    id: raw.id as string,
    userId: raw.user_id as string,
    status: (raw.status as 'pending' | 'in_progress' | 'delivered') ?? 'pending',
    journalEntries: entries,
    createdAt,
    adminNotifiedAt: (raw.admin_notified_at as string | null) ?? null,
    lightId: `User ${(raw.user_id as string).slice(0, 6).toUpperCase()}`,
    node: profile?.assigned_node ?? 'rtanj',
    language: 'Unknown',
    entryCount: entries.length,
    daysActive,
    purchasedAt: new Date(createdAt).toLocaleString(),
    soulProfile: `WHO IS THIS PERSON\nUser ${(raw.user_id as string).slice(0, 6).toUpperCase()} · ${entries.length} entries · ${daysActive} days active\n\nClick "AI BRIEF" to generate a Soul Profile Brief using Gemini.`,
    adminDraft: '',
    allEntries: allEntriesText,
  };
}

export default function AdminDeepReadQueue() {
  const [orders, setOrders] = useState<DeepReadOrder[]>([]);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DeepReadOrder | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [sending, setSending] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [generatingSoulProfile, setGeneratingSoulProfile] = useState(false);
  const [soulProfileGenerated, setSoulProfileGenerated] = useState(false);

  const { response: draftResponse, isLoading: draftLoading, error: draftError, sendMessage: sendDraftMessage } = useChat(
    'GEMINI',
    'gemini/gemini-2.5-flash',
    false
  );
  const { response: soulResponse, isLoading: soulLoading, error: soulError, sendMessage: sendSoulMessage } = useChat(
    'GEMINI',
    'gemini/gemini-2.5-pro',
    false
  );

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/deep-read-queue');
      if (!res.ok) throw new Error('Failed to load queue');
      const json = await res.json();
      const mapped: DeepReadOrder[] = (json.queue ?? []).map(mapDbOrderToOrder);
      setOrders(mapped);
      setWeeklyCount(json.weeklyCount ?? 0);
      if (mapped.length > 0 && !selectedOrder) {
        setSelectedOrder(mapped[0]);
        setDraftContent(mapped[0].adminDraft);
      }
    } catch (e) {
      toast.error('Could not load Deep Read queue.');
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 60000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  useEffect(() => {
    if (draftError) toast.error('Could not generate draft. Please try again.');
  }, [draftError]);

  useEffect(() => {
    if (soulError) {
      toast.error('Could not generate Soul Profile Brief.');
      setGeneratingSoulProfile(false);
    }
  }, [soulError]);

  useEffect(() => {
    if (draftResponse && !draftLoading) {
      setDraftContent(draftResponse.trim());
      toast.success('Draft generated from Soul Profile.');
    }
  }, [draftResponse, draftLoading]);

  useEffect(() => {
    if (soulResponse && !soulLoading && generatingSoulProfile) {
      if (selectedOrder) {
        const updatedOrder = { ...selectedOrder, soulProfile: soulResponse.trim() };
        setSelectedOrder(updatedOrder);
        setSoulProfileGenerated(true);
        setGeneratingSoulProfile(false);
        toast.success('Soul Profile Brief generated by Gemini.');
      }
    }
  }, [soulResponse, soulLoading, generatingSoulProfile, selectedOrder]);

  const handleSelectOrder = (order: DeepReadOrder) => {
    setSelectedOrder(order);
    setDraftContent(order.adminDraft);
    setSoulProfileGenerated(false);
  };

  const handleGenerateSoulProfile = async () => {
    if (!selectedOrder) return;
    setGeneratingSoulProfile(true);
    const prompt = `${GLOBAL_INSTRUCTION}

Prepare a Soul Profile Brief for the founder of NoMoreQuiet, who will personally read and respond to this user. This is an internal tool — not shown to the user.

The user has written ${selectedOrder.entryCount} entries over ${selectedOrder.daysActive} days.
Node: ${selectedOrder.node}

All entries:
---
${selectedOrder.allEntries || 'Entries not available for preview — see full database record.'}
---

Write a concise brief of 200-250 words for the founder. Include:

1. WHO IS THIS PERSON (2-3 sentences): Core emotional signature. How they hold themselves in language. What they carry. What they circle without naming.

2. KEY THEMES (bullet list, max 5): The recurring subjects — named and unnamed. Include what is conspicuously absent as well as what is present.

3. CRITICAL MOMENT: The single entry or phrase that reveals the most. Quote it exactly. Note the entry number and date.

4. WHAT THEY NEED TO HEAR: Not advice — the one direction the response could go that would land deepest. A posture, not a prescription. An image to stay with, not a conclusion to offer.

5. LANGUAGE NOTES: Specific words or images they return to that must be reflected back. Patterns in how they hold themselves in language (tense, person, rhythm). What to mirror.

Return as plain text — this will be displayed in the admin panel as a sidebar before the founder writes their response.`;

    sendSoulMessage([{ role: 'user', content: prompt }], { temperature: 0.7, max_tokens: 600 });
  };

  const handleGenerateDraft = async () => {
    if (!selectedOrder) return;
    const prompt = `${GLOBAL_INSTRUCTION}

You are writing a personal Deep Read response to a NoMoreQuiet user who purchased the Deep Read.
Node: ${selectedOrder.node}
Entry count: ${selectedOrder.entryCount} entries over ${selectedOrder.daysActive} days

Soul Profile Brief (AI-prepared summary for the founder):
---
${selectedOrder.soulProfile}
---

Write a 400+ word personal response in the Manifest tone:
- Literary, unhurried, warm
- No advice, no prescriptions, no "you should", no "you have grown"
- Stay with the images and language from the Soul Profile — transform them, do not replace them
- Witness what you see — do not analyze or conclude
- The response should feel like it was written by someone who read every word carefully and chose to stay with one thing
- End with something that opens space, not closes it — never a conclusion, never a summary`;

    sendDraftMessage([{ role: 'user', content: prompt }], { temperature: 0.85, max_tokens: 1000 });
  };

  const handleSend = async () => {
    if (!selectedOrder) return;
    if (!draftContent.trim() || draftContent.split(/\s+/).length < 50) {
      toast.error('Response must be at least 400 words. Keep writing.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/admin/deep-read-queue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOrder.id, status: 'delivered' }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Response delivered. Builder light granted. The House has spoken.');
      await fetchQueue();
    } catch {
      toast.error('Failed to mark as delivered. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const wordCount = draftContent.trim() ? draftContent.trim().split(/\s+/).length : 0;
  const isGenerating = draftLoading || soulLoading;
  const pendingOrders = orders.filter((o) => o.status !== 'delivered');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <span className="light-dot pulse-amber" style={{ width: '6px', height: '6px' }} />
          <p className="font-cormorant italic text-mist text-sm">Loading queue from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Order list */}
      <div className="w-72 xl:w-80 border-r border-amber/10 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-amber/10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="nmq-label" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
              DEEP READ QUEUE
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-amber pulse-slow" />
          </div>
          <p className="font-cormorant font-light text-cream text-base">
            {pendingOrders.length} orders · {pendingOrders.filter(o => o.status !== 'delivered').length} pending
          </p>
          <p className="nmq-label mt-1" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
            Capacity: {weeklyCount}/5 this week
          </p>
          <div className="mt-2 h-1 bg-deep-earth">
            <div
              className="h-1 depth-bar"
              style={{ width: `${Math.min((weeklyCount / 5) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {orders.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="font-cormorant italic text-mist text-sm">Queue is empty.</p>
            </div>
          ) : (
            orders.map((order) => {
              const st = STATUS_STYLES[order.status];
              return (
                <button
                  key={order.id}
                  className={`w-full text-left px-5 py-4 border-b border-amber/6 transition-all duration-200 ${
                    selectedOrder?.id === order.id
                      ? 'bg-amber/8 border-l-2 border-l-amber' : 'hover:bg-amber/4'
                  }`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-cormorant font-light text-cream text-sm">{order.lightId}</p>
                    <span
                      className="nmq-label px-1.5 py-0.5"
                      style={{ fontSize: '0.4rem', color: st.color, background: st.bg }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>{order.node}</span>
                    <span className="text-silence" style={{ fontSize: '8px' }}>·</span>
                    <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>{order.entryCount} entries</span>
                  </div>
                  <p className="nmq-label mt-1" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
                    Purchased: {order.purchasedAt}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main editor */}
      {selectedOrder && (
        <div className="flex-1 flex overflow-hidden">
          {/* Soul profile sidebar */}
          {showProfile && (
            <div className="w-80 xl:w-96 border-r border-amber/10 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-amber/10">
                <div>
                  <p className="nmq-label mb-0.5" style={{ fontSize: '0.5rem', color: '#D4AF37' }}>
                    SOUL PROFILE BRIEF
                  </p>
                  <p className="font-cormorant italic text-mist text-xs">
                    AI-prepared for founder · Not shown to user
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="ghost-btn px-2 py-1 text-xs flex items-center gap-1 disabled:opacity-50"
                    onClick={handleGenerateSoulProfile}
                    disabled={soulLoading || generatingSoulProfile}
                    title="Regenerate Soul Profile with Gemini"
                  >
                    {(soulLoading || generatingSoulProfile) ? (
                      <span className="light-dot pulse-amber" style={{ width: '4px', height: '4px' }} />
                    ) : (
                      <Icon name="SparklesIcon" size={12} />
                    )}
                    <span className="nmq-label" style={{ fontSize: '0.4rem' }}>
                      {soulProfileGenerated ? 'REGENERATE' : 'AI BRIEF'}
                    </span>
                  </button>
                  <button
                    className="text-silence hover:text-mist transition-colors p-1"
                    onClick={() => setShowProfile(false)}
                    aria-label="Hide soul profile"
                  >
                    <Icon name="ChevronLeftIcon" size={14} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {(soulLoading || generatingSoulProfile) ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="light-dot pulse-amber" style={{ width: '4px', height: '4px' }} />
                      <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#c8822a' }}>
                        GEMINI IS READING...
                      </p>
                    </div>
                    <div className="animate-pulse space-y-2">
                      {[85, 70, 90, 60, 80].map((w, i) => (
                        <div key={`skel-${i}`} className="h-2 bg-deep-earth rounded" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <pre
                    className="font-cormorant font-light text-cream/75 text-xs leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  >
                    {selectedOrder.soulProfile}
                  </pre>
                )}
              </div>
              <div className="px-5 py-3 border-t border-amber/8">
                <p className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                  {soulProfileGenerated ? 'Generated by Gemini 2.5 Pro · Not shown to user' : 'Click AI BRIEF to generate with Gemini'}
                </p>
              </div>
            </div>
          )}

          {/* Response editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber/10">
              <div className="flex items-center gap-4">
                {!showProfile && (
                  <button
                    className="text-silence hover:text-amber transition-colors p-1 flex items-center gap-1"
                    onClick={() => setShowProfile(true)}
                  >
                    <Icon name="ChevronRightIcon" size={14} />
                    <span className="nmq-label" style={{ fontSize: '0.45rem' }}>SOUL PROFILE</span>
                  </button>
                )}
                <div>
                  <p className="nmq-label mb-0.5" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
                    WRITING RESPONSE TO {selectedOrder.lightId}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>{selectedOrder.node}</span>
                    <span className="text-silence" style={{ fontSize: '8px' }}>·</span>
                    <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                      {selectedOrder.entryCount} entries · {selectedOrder.daysActive} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-cormorant tabular-nums text-sm ${
                    wordCount >= 400 ? 'text-amber' : 'text-silence'
                  }`}
                >
                  {wordCount} / 400+ words
                </span>
                <button
                  className="ghost-btn px-4 py-2 flex items-center gap-2 text-xs disabled:opacity-50"
                  onClick={handleGenerateDraft}
                  disabled={isGenerating}
                >
                  {draftLoading ? (
                    <>
                      <span className="light-dot pulse-amber" style={{ width: '4px', height: '4px' }} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="SparklesIcon" size={14} />
                      <span>Generate Draft</span>
                    </>
                  )}
                </button>
                <button
                  className="amber-btn px-5 py-2 flex items-center gap-2 text-xs disabled:opacity-50"
                  onClick={handleSend}
                  disabled={sending || wordCount < 50}
                >
                  {sending ? (
                    <>
                      <span className="light-dot pulse-amber" style={{ width: '4px', height: '4px' }} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="PaperAirplaneIcon" size={14} />
                      <span>Send Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div
              className="px-6 py-2 border-b border-amber/6 flex items-center gap-2"
              style={{ background: 'rgba(17,14,10,0.4)' }}
            >
              <Icon name="LanguageIcon" size={12} className="text-silence" />
              <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                DEEPL AUTO-TRANSLATION ACTIVE · Response will be translated before delivery · Admin reviews translation before sending
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <textarea
                className="textarea-nmq w-full h-full"
                style={{ minHeight: '400px', fontSize: '1rem', lineHeight: '1.8' }}
                placeholder={`Write your response to ${selectedOrder.lightId} here. 400+ words. In the Manifest tone — literary, unhurried, no advice. The House speaks through you.`}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                disabled={draftLoading}
                aria-label="Deep Read response editor"
              />
            </div>

            <div className="px-6 py-3 border-t border-amber/8">
              <div className="flex items-center justify-between mb-1.5">
                <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                  {wordCount < 400 ? `${400 - wordCount} words to minimum` : 'Minimum reached — keep going'}
                </span>
                <span className="nmq-label" style={{ fontSize: '0.45rem', color: wordCount >= 400 ? '#c8822a' : '#5a4e40' }}>
                  {wordCount} WORDS
                </span>
              </div>
              <div className="h-0.5 bg-deep-earth">
                <div
                  className="h-0.5 depth-bar transition-all duration-500"
                  style={{ width: `${Math.min((wordCount / 400) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-cormorant italic text-mist text-lg mb-2">The queue is empty.</p>
            <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
              Deep Read orders will appear here when users purchase the 49 € analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}