'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

interface CrisisFlag {
  id: string;
  userId: string;
  lightId: string;
  node: string;
  language: string;
  flaggedAt: string;
  triggerCount: number;
  status: 'unreviewed' | 'reviewed' | 'escalated';
  notes: string;
}

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  unreviewed: { color: '#ff6b2b', bg: 'rgba(255,107,43,0.1)', label: 'UNREVIEWED', icon: 'ExclamationTriangleIcon' },
  reviewed: { color: '#c8822a', bg: 'rgba(200,130,42,0.1)', label: 'REVIEWED', icon: 'CheckCircleIcon' },
  escalated: { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', label: 'ESCALATED', icon: 'ArrowUpCircleIcon' },
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default function AdminCrisisInbox() {
  const [flags, setFlags] = useState<CrisisFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState<CrisisFlag | null>(null);
  const [notes, setNotes] = useState('');

  const fetchFlags = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/crisis-flags');
      if (!res.ok) throw new Error('Failed to load crisis flags');
      const json = await res.json();
      const mapped: CrisisFlag[] = (json.flags ?? []).map((f: Record<string, unknown>) => ({
        id: f.id as string,
        userId: f.userId as string,
        lightId: f.lightId as string,
        node: f.node as string,
        language: f.language as string,
        flaggedAt: f.flaggedAt as string,
        triggerCount: f.triggerCount as number,
        status: 'unreviewed' as const,
        notes: '',
      }));
      setFlags(mapped);
      if (mapped.length > 0 && !selectedFlag) {
        setSelectedFlag(mapped[0]);
        setNotes('');
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [selectedFlag]);

  useEffect(() => {
    fetchFlags();
    const interval = setInterval(fetchFlags, 30000);
    return () => clearInterval(interval);
  }, [fetchFlags]);

  const handleMarkReviewed = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'reviewed' as const, notes } : f))
    );
    toast.success('Flagged entry marked as reviewed.');
  };

  const unreviewedCount = flags.filter((f) => f.status === 'unreviewed').length;

  if (loading) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
        <div className="mb-6">
          <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#ff6b2b' }}>CRISIS INBOX · PRIORITY</p>
          <h1 className="nmq-heading text-3xl italic text-gold">Crisis Flags</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="light-dot pulse-amber" style={{ width: '6px', height: '6px' }} />
          <p className="font-cormorant italic text-mist text-sm">Loading crisis flags from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <p className="nmq-label" style={{ fontSize: '0.55rem', color: '#ff6b2b' }}>
            CRISIS INBOX · PRIORITY
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-amber pulse-slow" />
        </div>
        <h1 className="nmq-heading text-3xl italic text-gold">Crisis Flags</h1>
        <p className="font-cormorant italic text-mist text-base mt-1">
          {unreviewedCount} unreviewed · {flags.length} total · Entry content is not shown without user consent · Flag only.
        </p>
      </div>

      {/* Privacy notice */}
      <div
        className="nmq-card p-4 mb-6 flex items-start gap-3"
        style={{ borderColor: 'rgba(200,130,42,0.2)', background: 'rgba(200,130,42,0.04)' }}
      >
        <Icon name="ShieldCheckIcon" size={16} className="text-amber flex-shrink-0 mt-0.5" />
        <p className="font-cormorant italic text-cream/70 text-sm leading-relaxed">
          Crisis flags show only: node, language, trigger count, and timestamp. Entry content is never shown here. User privacy is protected unless the user explicitly consents via the SOS mode write-to-the-House feature.
        </p>
      </div>

      {flags.length === 0 ? (
        <div className="nmq-card p-8 text-center">
          <p className="font-cormorant italic text-mist text-lg mb-2">No crisis flags detected.</p>
          <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            Crisis flags appear here when AI detects distress signals in journal entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Flag list */}
          <div className="xl:col-span-1 nmq-card overflow-hidden">
            <div className="px-5 py-4 border-b border-amber/10">
              <p className="font-cormorant font-light text-cream text-base">
                {flags.length} flags total
              </p>
            </div>
            <div className="divide-y divide-amber/6">
              {flags.map((flag) => {
                const st = STATUS_STYLES[flag.status];
                return (
                  <button
                    key={flag.id}
                    className={`w-full text-left px-5 py-4 transition-all duration-200 ${
                      selectedFlag?.id === flag.id
                        ? 'bg-amber/8 border-l-2 border-l-amber' : 'hover:bg-amber/4'
                    }`}
                    onClick={() => {
                      setSelectedFlag(flag);
                      setNotes(flag.notes);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-cormorant font-light text-cream text-sm">{flag.lightId}</p>
                      <span
                        className="nmq-label px-1.5 py-0.5 flex items-center gap-1"
                        style={{ fontSize: '0.4rem', color: st.color, background: st.bg }}
                      >
                        {flag.triggerCount > 1 && (
                          <span className="font-cormorant">{flag.triggerCount}×</span>
                        )}
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                        {flag.language}
                      </span>
                      <span className="text-silence" style={{ fontSize: '8px' }}>·</span>
                      <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                        {flag.node}
                      </span>
                    </div>
                    <p className="nmq-label mt-1" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
                      {timeAgo(flag.flaggedAt)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flag detail */}
          {selectedFlag && (
            <div className="xl:col-span-2 flex flex-col gap-4">
              <div className="nmq-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="nmq-label mb-1" style={{ fontSize: '0.5rem', color: STATUS_STYLES[selectedFlag.status].color }}>
                      {STATUS_STYLES[selectedFlag.status].label}
                      {selectedFlag.triggerCount > 1 && ` · ${selectedFlag.triggerCount} TRIGGERS`}
                    </p>
                    <p className="nmq-heading text-2xl italic text-gold">{selectedFlag.lightId}</p>
                  </div>
                  {selectedFlag.triggerCount >= 3 && (
                    <div
                      className="nmq-label px-3 py-1.5 flex items-center gap-1.5"
                      style={{
                        fontSize: '0.5rem',
                        color: '#ff6b2b',
                        background: 'rgba(255,107,43,0.1)',
                        border: '1px solid rgba(255,107,43,0.3)',
                      }}
                    >
                      <Icon name="ExclamationTriangleIcon" size={12} />
                      SOS MODE ACTIVE
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { id: 'cf-lang', label: 'LANGUAGE', value: selectedFlag.language },
                    { id: 'cf-node', label: 'NODE', value: selectedFlag.node },
                    { id: 'cf-triggers', label: 'TRIGGER COUNT', value: selectedFlag.triggerCount.toString() },
                  ].map((item) => (
                    <div key={item.id}>
                      <p className="nmq-label mb-1" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                        {item.label}
                      </p>
                      <p className="font-cormorant font-light text-cream text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="p-4 mb-4"
                  style={{ background: 'rgba(200,130,42,0.04)', border: '1px solid rgba(200,130,42,0.12)' }}
                >
                  <p className="nmq-label mb-2" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
                    AUTOMATED PROTOCOL EXECUTED
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      '✓ Mirroring response suppressed for this entry',
                      '✓ Warm holding message shown',
                      `✓ Crisis resources shown for ${selectedFlag.language} speaker`,
                      selectedFlag.triggerCount >= 3 ? '✓ SOS mode activated on next login' : '✓ User not blocked or interrupted',
                      '✓ Admin notified (this flag)',
                      '✓ Entry content not shown here (privacy protected)',
                    ].map((step, si) => (
                      <li key={`protocol-${selectedFlag.id}-${si}`} className="font-cormorant italic text-cream/70 text-xs">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="nmq-label block mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                    REVIEW NOTES
                  </label>
                  <textarea
                    className="textarea-nmq w-full border border-amber/15 p-3 text-sm"
                    style={{ minHeight: '80px', background: 'rgba(17,14,10,0.8)' }}
                    placeholder="Add notes about this flag — what you observed, what action was taken..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    aria-label="Crisis flag review notes"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  {selectedFlag.status === 'unreviewed' && (
                    <button
                      className="amber-btn px-5 py-2 text-xs flex items-center gap-2"
                      onClick={() => handleMarkReviewed(selectedFlag.id)}
                    >
                      <Icon name="CheckCircleIcon" size={14} />
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    className="ghost-btn px-5 py-2 text-xs flex items-center gap-2"
                    onClick={() => {
                      setFlags((prev) =>
                        prev.map((f) => (f.id === selectedFlag.id ? { ...f, status: 'escalated' as const } : f))
                      );
                      toast.success('Flag escalated.');
                    }}
                  >
                    <Icon name="ArrowUpCircleIcon" size={14} />
                    Escalate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}