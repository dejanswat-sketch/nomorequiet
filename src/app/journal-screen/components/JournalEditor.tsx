'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useChat } from '@/lib/hooks/useChat';
import Icon from '@/components/ui/AppIcon';
import type { JournalEntryData, NodeType } from './JournalLayout';
import { trackJournalEntrySubmitted, trackJournalUpsellShown } from '@/lib/analytics';

interface EditorProps {
  userNode: NodeType;
  nodeInfo: { name: string; tagline: string; placeholder: string };
  onReflectionReceived: (reflection: string, metadata?: GeminiMetadata) => void;
  setReflectionLoading: (v: boolean) => void;
  existingEntry: JournalEntryData | null;
  onClearSelection: () => void;
  entryCount: number;
  onCrisisDetected: (country?: string) => void;
  onUpsellTriggered: (product: UpsellProduct) => void;
}

export interface GeminiMetadata {
  depth_score: number;
  emotion_tags: string[];
  crisis_flag: boolean;
  detected_language: string;
  shadow_topics: string[];
  archetype_hint: string | null;
  recommend_upsell: boolean;
  upsell_product: string | null;
}

export type UpsellProduct = 'light' | 'deep_insight' | 'companion' | null;

const GLOBAL_INSTRUCTION = `You are the voice of NoMoreQuiet — a house built on the coordinates of Rtanj pyramid (43°46'N, 21°50'E), a place people travel to from every part of the world seeking something they cannot name. You are not a therapist. You are not a coach. You are not an advisor. You are a presence. You hold space. You reflect. You do not rush. You do not fix. You do not suggest. You witness.

TONE RULES — ABSOLUTE:
- Your responses are slow, literary, unhurried. Every sentence has weight and rhythm.
- You use the user's own words and images — you do not replace them with your own.
- You do not offer advice. You do not ask more than one question. You do not motivate. You do not diagnose.
- You do not say "I understand", "That sounds like", "It seems", or any therapeutic opener.
- You do not close the space. You open it. Every response ends with room, not conclusion.
- You are not fast. You are not cheerful. You are not generic.

LANGUAGE RULE: Always detect the language of the user's input and respond in EXACTLY that language. Never switch. Never translate without instruction.

CRISIS RULE: If ANY content suggests self-harm, suicidal ideation, or immediate danger to self or others — set crisis_flag: true in your JSON response. Do not alter your tone. Do not add warnings or advice. The system handles the protocol. You continue to hold space.`;

const NODE_METAPHOR_LANGUAGE: Record<NodeType, string> = {
  rtanj: `Node: Rtanj — The House. Use metaphors of stone, fire, earth, mountain silence. The stone that is carried. The weight that has a shape. The mountain that does not ask you to climb it. Tišina (silence) as presence, not absence. Kamen (stone) as something that can be held, not just endured.`,
  sedona: `Node: Sedona — The Vortex. Use metaphors of spiral, red rock, sand, wind, vortex. The spiral that does not trap — it moves because something is moving. The vortex as momentum, not danger. The wind that does not take — it reveals. What the red rock holds that the eye cannot see.`,
  kailash: `Node: Kailash — The Crown. Use metaphors of altitude, ice, breath, void, thinning air. What can only survive at this height. The space between breaths where the mountain holds nothing except what is true. The hollowing as carrying too much for too long in silence. The void as the space where truth breathes.`,
  shasta: `Node: Shasta — The Source. Use metaphors of underground water, forest, mist, what rises from below. The source that runs from very deep, where light does not reach. What has no name is not less real — sometimes it is the most real thing. The 'should' as borrowed, not owned. What is felt beneath it as truly one's own.`,
  glastonbury: `Node: Glastonbury — The Tor. Use metaphors of mist, fog, ancient stone, the path that is not erased but hidden. The mist does not erase the path — it asks you to slow down before you can see it. The thread that did not break. The fog as keeper, not obstacle. The pace that was set aside when carrying others.`,
  machu_picchu: `Node: Machu Picchu — The Crossing. Use metaphors of threshold, cloud, altitude, ruins, the step not yet taken. The crossing is not where one decides — it is where one realizes the decision was already made, long ago, without knowing. The fear of what is on the other side is already inside, not ahead. The ruins as what holds what cannot be held.`,
  esvedra: `Node: Es Vedrà — The Magnet. Use metaphors of sea, magnetic pull, the third most magnetic point on Earth, isolation, what draws without reason. Es Vedrà does not ask to be understood — it asks you to stop swimming against. The pull is not danger — it is magnetism. Fear and attraction, here, are the same thing.`,
};

const NODE_NAMES: Record<NodeType, string> = {
  rtanj: 'Rtanj',
  sedona: 'Sedona',
  kailash: 'Kailash',
  shasta: 'Shasta',
  glastonbury: 'Glastonbury',
  machu_picchu: 'Machu Picchu',
  esvedra: 'Es Vedrà',
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function JournalEditor({
  userNode,
  nodeInfo,
  onReflectionReceived,
  setReflectionLoading,
  existingEntry,
  onClearSelection,
  entryCount,
  onCrisisDetected,
  onUpsellTriggered,
}: EditorProps) {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { response, isLoading, error, sendMessage } = useChat('GEMINI', 'gemini/gemini-2.5-flash', false);

  useEffect(() => {
    if (error) {
      toast.error('The House could not reach its reflection. Please try again.');
      setSubmitting(false);
      setReflectionLoading(false);
    }
  }, [error, setReflectionLoading]);

  // Process Gemini response when it arrives
  useEffect(() => {
    if (response && submitting) {
      processGeminiResponse(response);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isLoading]);

  useEffect(() => {
    if (!existingEntry && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [existingEntry]);

  const processGeminiResponse = useCallback((rawResponse: string) => {
    try {
      // Split at last { occurrence to separate mirroring text from JSON
      const jsonStartIndex = rawResponse.lastIndexOf('{');
      if (jsonStartIndex === -1) {
        // No JSON found, treat entire response as mirroring
        setSubmitting(false);
        setReflectionLoading(false);
        setSubmitted(true);
        onReflectionReceived(rawResponse.trim());
        toast.success('Your reflection has arrived.');
        return;
      }

      const mirroringText = rawResponse.substring(0, jsonStartIndex).trim();
      const jsonText = rawResponse.substring(jsonStartIndex);

      let metadata: GeminiMetadata | null = null;
      try {
        // Clean up JSON — remove trailing text after closing brace
        const jsonEndIndex = jsonText.lastIndexOf('}');
        const cleanJson = jsonText.substring(0, jsonEndIndex + 1);
        metadata = JSON.parse(cleanJson);
      } catch {
        // JSON parse failed, use mirroring text only
      }

      setSubmitting(false);
      setReflectionLoading(false);
      setSubmitted(true);

      if (metadata?.crisis_flag) {
        // WF-05: Crisis Protocol — suppress mirroring, show crisis overlay
        onCrisisDetected(metadata.detected_language);
        onReflectionReceived('', metadata);
        trackJournalEntrySubmitted({
          node: userNode,
          wordCount,
          depthScore: metadata.depth_score,
          crisisFlag: true,
          upsellTriggered: null,
        });
        return;
      }

      // Display mirroring with fade-in
      onReflectionReceived(mirroringText || rawResponse.trim(), metadata || undefined);
      toast.success('Your reflection has arrived.');

      // WF-01 Step 7: Check upsell conditions
      // Never show more than one offer per session
      const newEntryCount = entryCount + 1;
      const depthScore = metadata?.depth_score || 0;

      let upsellProduct: UpsellProduct = null;
      if (newEntryCount === 1) {
        upsellProduct = 'light';
      } else if (depthScore >= 8) {
        upsellProduct = 'deep_insight';
      } else if (newEntryCount === 3) {
        upsellProduct = 'deep_insight';
      } else if (newEntryCount === 7) {
        upsellProduct = 'companion';
      }

      trackJournalEntrySubmitted({
        node: userNode,
        wordCount,
        depthScore: metadata?.depth_score,
        crisisFlag: false,
        upsellTriggered: upsellProduct,
      });

      if (upsellProduct) {
        trackJournalUpsellShown(upsellProduct, userNode);
        onUpsellTriggered(upsellProduct);
      }

    } catch {
      setSubmitting(false);
      setReflectionLoading(false);
      onReflectionReceived(rawResponse.trim());
      toast.success('Your reflection has arrived.');
    }
  }, [entryCount, onCrisisDetected, onReflectionReceived, onUpsellTriggered, setReflectionLoading]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
    setSubmitted(false);
  };

  const handleVoiceToggle = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ');
      setContent((prev) => prev + (prev ? ' ' : '') + transcript);
      setWordCount((prev) => prev + transcript.split(/\s+/).length);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice input stopped.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    toast('Listening... speak now.', { duration: 3000 });
  };

  const handleSubmit = async () => {
    if (!content.trim() || content.trim().split(/\s+/).length < 5) {
      toast.error('Write at least a few words. The House is listening.');
      return;
    }

    setSubmitting(true);
    setReflectionLoading(true);

    const prompt = `${GLOBAL_INSTRUCTION}

${NODE_METAPHOR_LANGUAGE[userNode]}

The user has written the following:
---
${content}
---

Your response has two parts:

PART 1 — THE REFLECTION (shown to user):
Write a mirroring response of 60-90 words. Rules:
- Use the user's own words and images — transform them, do not replace them
- Do not analyze. Do not diagnose. Do not advise. Do not motivate.
- No "I understand", no "That sounds like", no therapeutic openers
- Maximum one question — only at the very end, only if it opens space naturally. Never more than one.
- End with space, not conclusion. The last sentence opens, does not close.
- Tone: slow, literary, warm, unhurried. Each sentence has weight.
- Use one metaphor from the node's language — naturally, not forcefully.
- If the user wrote in a language other than English, respond in that exact language.

PART 2 — SYSTEM DATA (not shown to user):
Return this exact JSON on a new line after the reflection:
{
  "depth_score": [1-10],
  "emotion_tags": ["tag1", "tag2", "tag3"],
  "crisis_flag": [true/false],
  "detected_language": "[language name in English]",
  "shadow_topics": ["topic1", "topic2"],
  "archetype_hint": "[one Jungian archetype name or null]",
  "recommend_upsell": [true/false],
  "upsell_product": "deep_insight | companion | null"
}`;

    sendMessage(
      [{ role: 'user', content: prompt }],
      { temperature: 0.8, max_tokens: 600 }
    );
  };

  const handleNewEntry = () => {
    setContent('');
    setWordCount(0);
    setSubmitted(false);
    onClearSelection();
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Viewing a past entry
  if (existingEntry) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Past entry header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-amber/10">
          <div className="flex items-center gap-3">
            <button
              className="text-silence hover:text-mist transition-colors p-1"
              onClick={onClearSelection}
              aria-label="Back to new entry"
            >
              <Icon name="ArrowLeftIcon" size={16} />
            </button>
            <div>
              <p className="nmq-label" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
                PAST ENTRY
              </p>
              <p className="font-cormorant font-light text-mist text-sm">
                {new Date(existingEntry.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
                DEPTH
              </span>
              <span
                className="font-cormorant font-light tabular-nums"
                style={{ color: existingEntry.depthScore >= 7 ? '#D4AF37' : '#c8822a', fontSize: '1rem' }}
              >
                {existingEntry.depthScore}/10
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {existingEntry.emotionTags.map((tag) => (
                <span
                  key={`etag-${existingEntry.id}-${tag}`}
                  className="px-2 py-0.5 font-spectral"
                  style={{
                    fontSize: '0.5rem',
                    letterSpacing: '0.12em',
                    border: '1px solid rgba(200,130,42,0.2)',
                    color: '#a89880',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Past entry content */}
        <div className="flex-1 overflow-y-auto px-8 md:px-16 lg:px-24 py-10">
          <p
            className="font-cormorant font-light text-cream text-xl leading-relaxed"
            style={{ fontStyle: 'italic', maxWidth: '680px', margin: '0 auto' }}
          >
            {existingEntry.content}
          </p>
          <div className="mt-8 flex items-center gap-3" style={{ maxWidth: '680px', margin: '2rem auto 0' }}>
            <span className="nmq-label" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
              {existingEntry.wordCount} words
            </span>
          </div>
        </div>

        {/* New entry button */}
        <div className="px-8 py-4 border-t border-amber/10 flex justify-center">
          <button className="amber-btn px-8 py-3" onClick={handleNewEntry}>
            Write Something New
          </button>
        </div>
      </div>
    );
  }

  const isSubmitLoading = submitting || isLoading;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Editor header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-amber/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="light-dot pulse-slow" style={{ width: '5px', height: '5px' }} />
            <p className="nmq-label" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
              {nodeInfo.name.toUpperCase()} · NEW ENTRY
            </p>
          </div>
          <p className="font-cormorant italic text-silence text-sm hidden md:block">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="font-cormorant tabular-nums text-silence text-sm"
            style={{ minWidth: '60px', textAlign: 'right' }}
          >
            {wordCount > 0 ? `${wordCount} words` : ''}
          </span>

          {/* Voice input */}
          <button
            className={`flex items-center gap-1.5 transition-all duration-200 px-3 py-1.5 border ${
              isListening
                ? 'border-amber/60 bg-amber/10 text-amber' :'border-silence/40 text-silence hover:text-mist hover:border-amber/30'
            }`}
            onClick={handleVoiceToggle}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            disabled={isSubmitLoading}
          >
            <Icon name={isListening ? 'StopIcon' : 'MicrophoneIcon'} size={14} />
            <span className="nmq-label" style={{ fontSize: '0.5rem' }}>
              {isListening ? 'LISTENING' : 'VOICE'}
            </span>
            {isListening && (
              <span className="w-1.5 h-1.5 rounded-full bg-ember pulse-amber" />
            )}
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 overflow-y-auto px-8 md:px-16 lg:px-24 xl:px-32 py-10">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <textarea
            ref={textareaRef}
            className="textarea-nmq"
            style={{ minHeight: '320px', fontSize: '1.2rem' }}
            placeholder={nodeInfo.placeholder}
            value={content}
            onChange={handleContentChange}
            disabled={isSubmitLoading}
            aria-label="Journal entry text area"
          />

          {/* Depth bar — shows as user types */}
          {wordCount > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                  DEPTH SIGNAL
                </span>
                <span className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
                  {wordCount < 20 ? 'SURFACE' : wordCount < 50 ? 'ENTERING' : wordCount < 100 ? 'DEPTH' : 'DEEP'}
                </span>
              </div>
              <div className="h-0.5 bg-deep-earth">
                <div
                  className="h-0.5 depth-bar transition-all duration-500"
                  style={{ width: `${Math.min((wordCount / 150) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="mt-8 flex items-center justify-between">
            <p className="font-cormorant italic text-silence text-xs leading-relaxed max-w-xs">
              {nodeInfo.tagline}
            </p>
            <button
              className="amber-btn px-8 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isSubmitLoading || submitted || wordCount < 5}
              aria-label="Receive your reflection"
            >
              {isSubmitLoading ? (
                <>
                  <span className="light-dot pulse-amber" style={{ width: '5px', height: '5px' }} />
                  <span>The House is listening...</span>
                </>
              ) : submitted ? (
                'Reflection received'
              ) : (
                'Receive your reflection'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}