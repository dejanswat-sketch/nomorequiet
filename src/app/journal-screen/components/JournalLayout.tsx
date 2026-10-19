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