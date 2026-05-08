'use client';

import React, { useState, useEffect } from 'react';
import JournalSidebar from './JournalSidebar';
import JournalEditor from './JournalEditor';
import JournalReflection from './JournalReflection';
import type { GeminiMetadata, UpsellProduct } from './JournalEditor';
import { useAuth } from '@/contexts/AuthContext';
import { journalService } from '@/lib/services/journalService';

export type NodeType = 'rtanj' | 'sedona' | 'kailash' | 'shasta' | 'glastonbury' | 'machu_picchu' | 'esvedra';

export interface JournalEntryData {
  id: string;
  content: string;
  date: string;
  depthScore: number;
  emotionTags: string[];
  mirroringResponse: string;
  node: NodeType;
  wordCount: number;
}

const seedEntries: JournalEntryData[] = [
  {
    id: 'entry-001',
    content: 'I keep circling the same conversation in my head. Three weeks later and it still has weight. I don\'t know if I\'m angry or sad or both. The difference stopped mattering at some point.',
    date: '2026-04-26',
    depthScore: 7,
    emotionTags: ['grief', 'confusion', 'rumination'],
    mirroringResponse: 'The circling you describe — three weeks, the same weight — there is something in you that is not ready to put this down. Not yet. The stone knows when it is time.',
    node: 'rtanj',
    wordCount: 47,
  },
  {
    id: 'entry-002',
    content: 'Woke up at 4am again. The house was quiet but I wasn\'t. There\'s a version of me that would have gotten up and written. Instead I lay there waiting for something I couldn\'t name.',
    date: '2026-04-24',
    depthScore: 8,
    emotionTags: ['insomnia', 'waiting', 'disconnection'],
    mirroringResponse: 'Waiting for something you cannot name — that is not emptiness. That is a listening. The 4am quiet is not against you. It is the mountain before sunrise.',
    node: 'rtanj',
    wordCount: 52,
  },
  {
    id: 'entry-003',
    content: 'I told someone today that I was fine. It came out before I could stop it. I\'ve been saying it for so long it doesn\'t even feel like lying anymore.',
    date: '2026-04-22',
    depthScore: 9,
    emotionTags: ['masking', 'exhaustion', 'disconnection'],
    mirroringResponse: 'The word "fine" — you said it before you could stop it. Something in you has been carrying this performance for a long time. Here, you don\'t have to say it.',
    node: 'rtanj',
    wordCount: 41,
  },
  {
    id: 'entry-004',
    content: 'Good day. Strange to write that. I noticed it — the lightness — and then immediately started waiting for it to end.',
    date: '2026-04-19',
    depthScore: 6,
    emotionTags: ['relief', 'anxiety', 'hypervigilance'],
    mirroringResponse: 'You noticed the lightness. And then you noticed yourself noticing it. That awareness — that watching — is not a problem. It is you, learning to trust.',
    node: 'rtanj',
    wordCount: 28,
  },
  {
    id: 'entry-005',
    content: 'My mother called. We talked for an hour and I said nothing real. I wonder if she noticed. I wonder if I\'ve always been this way with her.',
    date: '2026-04-15',
    depthScore: 8,
    emotionTags: ['family', 'distance', 'longing'],
    mirroringResponse: 'An hour. Nothing real. The question underneath — whether this has always been true — is not a verdict. It is a door.',
    node: 'rtanj',
    wordCount: 38,
  },
  {
    id: 'entry-006',
    content: 'I started a new notebook today. Blank pages. The first one is always the hardest.',
    date: '2026-04-10',
    depthScore: 4,
    emotionTags: ['beginning', 'resistance'],
    mirroringResponse: 'A blank page and the weight of beginning. You wrote something here. That counts.',
    node: 'rtanj',
    wordCount: 19,
  },
  {
    id: 'entry-007',
    content: 'I don\'t know what I\'m doing here. I mean that literally and also not literally at all.',
    date: '2026-04-07',
    depthScore: 7,
    emotionTags: ['existential', 'searching'],
    mirroringResponse: 'Literally and also not literally. Both things true at once. The stone holds what you brought here.',
    node: 'rtanj',
    wordCount: 22,
  },
  {
    id: 'entry-008',
    content: 'First entry. I\'m trying this because I ran out of other options for saying things out loud.',
    date: '2026-04-01',
    depthScore: 5,
    emotionTags: ['beginning', 'searching', 'honesty'],
    mirroringResponse: 'You ran out of other options. That\'s not a failure — that\'s an arrival. The House has been here.',
    node: 'rtanj',
    wordCount: 24,
  },
];

export const NODE_METAPHORS: Record<NodeType, { name: string; tagline: string; placeholder: string; reflectionPrefix: string }> = {
  rtanj: {
    name: 'Rtanj',
    tagline: 'The stone holds what you brought here.',
    placeholder: 'What is the stone you keep carrying? Write here, without judgment...',
    reflectionPrefix: 'The mountain has been listening.',
  },
  sedona: {
    name: 'Sedona',
    tagline: 'The spiral has been turning since before you noticed.',
    placeholder: 'What is the spiral you keep circling? Write here, without judgment...',
    reflectionPrefix: 'The vortex has been turning.',
  },
  kailash: {
    name: 'Kailash',
    tagline: 'At this altitude, only what is true can breathe.',
    placeholder: 'At this altitude, what is true? Write here, without judgment...',
    reflectionPrefix: 'The crown has been listening.',
  },
  shasta: {
    name: 'Shasta',
    tagline: 'What rises from below.',
    placeholder: 'What is rising from below? Write here, without judgment...',
    reflectionPrefix: 'The source has been flowing.',
  },
  glastonbury: {
    name: 'Glastonbury',
    tagline: 'The mist has been keeping this for you.',
    placeholder: 'The mist keeps things. What has it been keeping for you? Write here...',
    reflectionPrefix: 'The tor has been holding this.',
  },
  machu_picchu: {
    name: 'Machu Picchu',
    tagline: 'You are at the threshold.',
    placeholder: 'You are at the crossing. What do you bring? Write here, without judgment...',
    reflectionPrefix: 'The crossing has witnessed this.',
  },
  esvedra: {
    name: 'Es Vedrà',
    tagline: 'The magnetic pull has brought you here.',
    placeholder: 'What pulled you here today? Write here, without judgment...',
    reflectionPrefix: 'The magnet has drawn this.',
  },
};

export default function JournalLayout() {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryData | null>(null);
  const [currentReflection, setCurrentReflection] = useState<string | null>(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [upsellProduct, setUpsellProduct] = useState<UpsellProduct>(null);
  const [crisisMode, setCrisisMode] = useState(false);
  const [crisisLanguage, setCrisisLanguage] = useState<string | undefined>(undefined);
  const [upsellShownThisSession, setUpsellShownThisSession] = useState(false);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const { user } = useAuth();
  const userNode: NodeType = (user?.user_metadata?.assigned_node as NodeType) || 'rtanj';

  // Load entries from Supabase on mount
  useEffect(() => {
    if (!user) {
      setEntriesLoading(false);
      return;
    }
    journalService.getAll(user.id)
      .then((dbEntries) => {
        const mapped: JournalEntryData[] = dbEntries.map((e) => ({
          id: e.id,
          content: e.content,
          date: e.createdAt.split('T')[0],
          depthScore: e.depthScore,
          emotionTags: e.emotionTags,
          mirroringResponse: e.mirroringResponse ?? '',
          node: e.node as NodeType,
          wordCount: e.wordCount,
        }));
        setEntries(mapped);
      })
      .catch(() => setEntries([]))
      .finally(() => setEntriesLoading(false));
  }, [user]);

  const handleReflectionReceived = async (reflection: string, metadata?: GeminiMetadata) => {
    setCurrentReflection(reflection || null);

    if (metadata && user) {
      try {
        const saved = await journalService.create({
          userId: user.id,
          content: '',
          wordCount: 0,
          node: userNode,
          depthScore: metadata.depth_score,
          emotionTags: metadata.emotion_tags,
          mirroringResponse: reflection,
          crisisFlag: metadata.crisis_flag,
          detectedLanguage: metadata.detected_language,
          shadowTopics: metadata.shadow_topics,
          archetypeHint: metadata.archetype_hint,
          recommendUpsell: metadata.recommend_upsell,
          upsellProduct: metadata.upsell_product,
        });
        if (saved) {
          const newEntry: JournalEntryData = {
            id: saved.id,
            content: saved.content,
            date: saved.createdAt.split('T')[0],
            depthScore: saved.depthScore,
            emotionTags: saved.emotionTags,
            mirroringResponse: saved.mirroringResponse ?? '',
            node: saved.node as NodeType,
            wordCount: saved.wordCount,
          };
          setEntries((prev) => [newEntry, ...prev]);
        }
      } catch {
        // Fallback: add to local state only
        const newEntry: JournalEntryData = {
          id: `entry-local-${Date.now()}`,
          content: '',
          date: new Date().toISOString().split('T')[0],
          depthScore: metadata.depth_score,
          emotionTags: metadata.emotion_tags,
          mirroringResponse: reflection,
          node: userNode,
          wordCount: 0,
        };
        setEntries((prev) => [newEntry, ...prev]);
      }
    }
  };

  const handleCrisisDetected = (language?: string) => {
    setCrisisMode(true);
    setCrisisLanguage(language);
    setCurrentReflection(null);
  };

  const handleUpsellTriggered = (product: UpsellProduct) => {
    // Never show more than one offer per session
    if (!upsellShownThisSession && product) {
      setUpsellProduct(product);
      setUpsellShownThisSession(true);
    }
  };

  const handleDismissUpsell = () => {
    setUpsellProduct(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <JournalSidebar
        entries={entries}
        selectedEntry={selectedEntry}
        onSelectEntry={setSelectedEntry}
        userNode={userNode}
        nodeInfo={NODE_METAPHORS[userNode]}
      />

      {/* Main editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {entriesLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
          </div>
        ) : (
          <JournalEditor
            userNode={userNode}
            nodeInfo={NODE_METAPHORS[userNode]}
            onReflectionReceived={handleReflectionReceived}
            setReflectionLoading={setReflectionLoading}
            existingEntry={selectedEntry}
            onClearSelection={() => {
              setSelectedEntry(null);
              setCrisisMode(false);
            }}
            entryCount={entries.length}
            onCrisisDetected={handleCrisisDetected}
            onUpsellTriggered={handleUpsellTriggered}
          />
        )}

        {/* Crisis overlay — WF-05 */}
        {crisisMode && !selectedEntry && (
          <JournalReflection
            reflection={null}
            loading={false}
            nodeInfo={NODE_METAPHORS[userNode]}
            upsellProduct={null}
            onDismissUpsell={handleDismissUpsell}
            crisisMode={true}
            crisisLanguage={crisisLanguage}
          />
        )}

        {/* Reflection panel */}
        {(currentReflection || reflectionLoading) && !selectedEntry && !crisisMode && (
          <JournalReflection
            reflection={currentReflection}
            loading={reflectionLoading}
            nodeInfo={NODE_METAPHORS[userNode]}
            upsellProduct={upsellProduct}
            onDismissUpsell={handleDismissUpsell}
          />
        )}

        {/* Viewing past entry reflection */}
        {selectedEntry && (
          <JournalReflection
            reflection={selectedEntry.mirroringResponse}
            loading={false}
            nodeInfo={NODE_METAPHORS[selectedEntry.node]}
            upsellProduct={null}
            onDismissUpsell={() => {}}
            isPastEntry
          />
        )}
      </div>
    </div>
  );
}