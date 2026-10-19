'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { JournalEntryData, NodeType } from './JournalLayout';
import BurnVaultButton from './BurnVaultButton';

interface SidebarProps {
  entries: JournalEntryData[];
  selectedEntry: JournalEntryData | null;
  onSelectEntry: (entry: JournalEntryData) => void;
  userNode: NodeType;
  nodeInfo: { name: string; tagline: string };
}

const DEPTH_COLORS = (score: number) => {
  if (score >= 8) return '#D4AF37';
  if (score >= 6) return '#c8822a';
  if (score >= 4) return '#a89880';
  return '#5a4e40';
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Broj dana od prvog unosa. Bez unosa → 0 (nikad izmišljen broj). */
function daysSinceFirstEntry(entries: JournalEntryData[]): number {
  if (!entries.length) return 0;
  const first = entries.reduce((min, e) => (e.date < min ? e.date : min), entries[0].date);
  const diff = Date.now() - new Date(first).getTime();
  return Math.max(1, Math.ceil(diff / 86_400_000));
}

export default function JournalSidebar({
  entries,
  selectedEntry,
  onSelectEntry,
  userNode,
  nodeInfo,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div
        className="w-12 flex flex-col items-center py-4 gap-4 border-r border-amber/10 bg-deep-earth/50 transition-all duration-300"
      >
        <button
          className="text-mist hover:text-amber transition-colors p-1"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
        >
          <Icon name="ChevronRightIcon" size={16} />
        </button>
        <div className="flex flex-col gap-3 mt-2">
          {entries.slice(0, 6).map((entry) => (
            <button
              key={`sidebar-dot-${entry.id}`}
              className={`transition-all duration-200 rounded-full ${
                selectedEntry?.id === entry.id ? 'scale-125' : 'hover:scale-110'
              }`}
              style={{
                width: '6px',
                height: '6px',
                background: DEPTH_COLORS(entry.depthScore),
                boxShadow: selectedEntry?.id === entry.id
                  ? `0 0 8px ${DEPTH_COLORS(entry.depthScore)}cc`
                  : 'none',
              }}
              onClick={() => onSelectEntry(entry)}
              aria-label={`Entry from ${entry.date}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 xl:w-80 flex flex-col border-r border-amber/10 bg-deep-earth/30 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-amber/10">
        <div>
          <p className="nmq-label" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
            {nodeInfo.name.toUpperCase()} · YOUR VAULT
          </p>
          <p className="font-cormorant font-light text-cream text-sm mt-0.5">
            {entries.length} entries
          </p>
        </div>
        <button
          className="text-silence hover:text-mist transition-colors p-1"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse sidebar"
        >
          <Icon name="ChevronLeftIcon" size={16} />
        </button>
      </div>

      {/* Node indicator */}
      <div className="px-5 py-3 border-b border-amber/8">
        <div className="flex items-center gap-2">
          <span
            className="light-dot pulse-slow"
            style={{ width: '5px', height: '5px' }}
          />
          <p className="font-cormorant italic text-mist text-xs">
            {nodeInfo.tagline}
          </p>
        </div>
      </div>

      {/* Stats row — samo stvarni brojevi (Koncept v2: Kuća ne mjeri izmišljeno) */}
      <div className="grid grid-cols-3 border-b border-amber/8">
        {[
          { id: 'stat-entries', label: 'ENTRIES', value: entries.length },
          { id: 'stat-days', label: 'DAYS', value: daysSinceFirstEntry(entries) },
          {
            id: 'stat-depth',
            label: 'AVG DEPTH',
            value: entries.length
              ? (entries.reduce((s, e) => s + e.depthScore, 0) / entries.length).toFixed(1)
              : '—',
          },
        ].map((stat) => (
          <div key={stat.id} className="p-3 text-center">
            <p className="font-cormorant font-light tabular-nums text-amber" style={{ fontSize: '1.1rem' }}>
              {stat.value}
            </p>
            <p className="nmq-label mt-0.5" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <button
            key={entry.id}
            className={`w-full text-left px-5 py-4 border-b border-amber/6 transition-all duration-200 group ${
              selectedEntry?.id === entry.id
                ? 'bg-amber/8 border-l-2 border-l-amber' :'hover:bg-amber/4'
            }`}
            onClick={() => onSelectEntry(entry)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                {formatDate(entry.date)}
              </p>
              {/* Depth indicator */}
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, di) => (
                    <div
                      key={`depth-${entry.id}-${di}`}
                      style={{
                        width: '2px',
                        height: '6px',
                        borderRadius: '1px',
                        background: di < entry.depthScore ? DEPTH_COLORS(entry.depthScore) : '#1a1612',
                      }}
                    />
                  ))}
                </div>
                <span className="nmq-label" style={{ fontSize: '0.45rem', color: DEPTH_COLORS(entry.depthScore) }}>
                  {entry.depthScore}
                </span>
              </div>
            </div>

            <p className="font-cormorant font-light text-cream/70 text-sm leading-relaxed line-clamp-2 group-hover:text-cream/90 transition-colors">
              {entry.content}
            </p>

            {/* Emotion tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.emotionTags.slice(0, 3).map((tag) => (
                <span
                  key={`tag-${entry.id}-${tag}`}
                  className="font-spectral text-silence"
                  style={{ fontSize: '0.45rem', letterSpacing: '0.12em' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Footer — new entry CTA + Burn Vault */}
      <div className="px-5 py-4 border-t border-amber/10 space-y-3">
        <p className="font-cormorant italic text-silence text-xs text-center">
          The House is open. Always.
        </p>
        <BurnVaultButton />
      </div>
    </div>
  );
}