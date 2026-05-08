'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useChat } from '@/lib/hooks/useChat';
import PortalCompanionFlow from './PortalCompanionFlow';
import { trackPortalRoundCompleted, trackPortalCompleted } from '@/lib/analytics';
import { createClient } from '@/lib/supabase/client';

type NodeType = 'rtanj' | 'sedona' | 'kailash' | 'shasta' | 'glastonbury' | 'machu_picchu' | 'esvedra';
type PortalStatus = 'active' | 'completed';

interface PortalRound {
  roundNumber: number;
  question: string;
  userInput: string;
  aiResponse: string;
  completedAt: string | null;
}

interface PortalDraft {
  currentRound: number;
  rounds: PortalRound[];
  currentInput: string;
  savedAt: string;
}

const DRAFT_KEY = 'portal_draft_v1';
const AUTOSAVE_DELAY = 1200; // ms

const GLOBAL_INSTRUCTION = `You are the voice of NoMoreQuiet — a house built on the coordinates of Rtanj pyramid (43°46'N, 21°50'E). You are a presence. You hold space. You reflect. You do not rush. You do not fix. You do not suggest. You witness.

TONE RULES — ABSOLUTE:
- Your responses are slow, literary, unhurried. Every sentence has weight and rhythm.
- You use the user's own words and images — you do not replace them with your own.
- You do not offer advice. You do not ask more than one question per round. You do not motivate. You do not diagnose.
- You do not say "I understand", "That sounds like", "It seems", or any therapeutic opener.
- You do not close the space. You open it. Every response ends with room, not conclusion.
- You are not fast. You are not cheerful. You are not generic.

LANGUAGE RULE: Always detect the language of the user's input and respond in EXACTLY that language. Never switch.`;

const NODE_ROUND_QUESTIONS: Record<NodeType, string[]> = {
  rtanj: [
    'What is the stone you keep carrying?',
    'What does the stone guard inside you?',
    'What breaks if you put the stone down?',
    'One thing you know, even here, in this weight.',
    'CLOSING',
  ],
  sedona: [
    'What is the spiral you keep circling?',
    'What does the vortex keep from falling?',
    'What dissolves if the spiral stops?',
    'One thing the wind cannot take.',
    'CLOSING',
  ],
  kailash: [
    'What truth can only breathe at this altitude?',
    'What does the void protect in you?',
    'What melts if you descend?',
    'One thing that remains when breath is gone.',
    'CLOSING',
  ],
  shasta: [
    'What is rising from below?',
    'What does the underground water carry for you?',
    'What floods if the source is uncovered?',
    'One thing the mist has always known.',
    'CLOSING',
  ],
  glastonbury: [
    'What has the mist been keeping for you?',
    'What does the fog protect in you?',
    'What becomes visible if the mist clears?',
    'One thing the ancient stone remembers.',
    'CLOSING',
  ],
  machu_picchu: [
    'What do you carry to the crossing?',
    'What do the ruins hold that you cannot?',
    'What is left behind at the threshold?',
    'One thing that survives the altitude.',
    'CLOSING',
  ],
  esvedra: [
    'What pulled you here without reason?',
    'What does the magnetic pull protect in you?',
    'What drifts away if the pull releases?',
    'One thing the sea cannot reach.',
    'CLOSING',
  ],
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

const NODE_METAPHOR_LANGUAGE: Record<NodeType, string> = {
  rtanj: `Use metaphors of stone, fire, earth, mountain silence. The stone that is carried. The weight that has a shape. The mountain that does not ask you to climb it. Silence as presence, not absence. The stone as something that can be held, not just endured. A stone that has a voice is rare — stones carried for years usually go silent.`,
  sedona: `Use metaphors of spiral, red rock, sand, wind, vortex. The spiral that does not trap — it moves because something is moving. The vortex as momentum, not danger. The wind that does not take — it reveals. What the red rock holds that the eye cannot see.`,
  kailash: `Use metaphors of altitude, ice, breath, void, thinning air. What can only survive at this height. The space between breaths where the mountain holds nothing except what is true. The hollowing as carrying too much for too long in silence. The void as the space where truth breathes.`,
  shasta: `Use metaphors of underground water, forest, mist, what rises from below. The source that runs from very deep, where light does not reach. What has no name is not less real — sometimes it is the most real thing. What is felt beneath the 'should' as truly one's own.`,
  glastonbury: `Use metaphors of mist, fog, ancient stone, the path that is not erased but hidden. The mist does not erase the path — it asks you to slow down before you can see it. The thread that did not break. The fog as keeper, not obstacle. The pace that was set aside when carrying others.`,
  machu_picchu: `Use metaphors of threshold, cloud, altitude, ruins, the step not yet taken. The crossing is not where one decides — it is where one realizes the decision was already made, long ago, without knowing. The fear of what is on the other side is already inside, not ahead. The ruins as what holds what cannot be held.`,
  esvedra: `Use metaphors of sea, magnetic pull, the third most magnetic point on Earth, isolation, what draws without reason. Es Vedrà does not ask to be understood — it asks you to stop swimming against. The pull is not danger — it is magnetism. Fear and attraction, here, are the same thing.`,
};

export default function PortalScreen() {
  const router = useRouter();
  const userNode: NodeType = 'rtanj';
  const [status, setStatus] = useState<PortalStatus>('active');
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState<PortalRound[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [finalReflection, setFinalReflection] = useState('');
  const [responseVisible, setResponseVisible] = useState(false);
  const [hasUnsavedInput, setHasUnsavedInput] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [appearanceYear, setAppearanceYear] = useState<number | null>(null);

  // Rate limiting state
  const [rateLimitChecked, setRateLimitChecked] = useState(false);
  const [rateLimitBlocked, setRateLimitBlocked] = useState(false);
  const [isCompanion, setIsCompanion] = useState(false);
  const [previousSessionsContext, setPreviousSessionsContext] = useState<string>('');

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { response, isLoading, error, sendMessage } = useChat('GEMINI', 'gemini/gemini-2.5-flash', false);

  // ── Rate limit check on mount ──────────────────────────────────────────
  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        const res = await fetch('/api/portal/check-limit', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.allowed === false) {
            setRateLimitBlocked(true);
          }
        }
      } catch {
        // fail open — allow through on network error
      } finally {
        setRateLimitChecked(true);
      }
    };
    checkRateLimit();
  }, []);

  // ── Fetch user tier + AI memory for Companion users ────────────────────
  useEffect(() => {
    const fetchTierAndMemory = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('appearance_year, user_tier')
          .eq('id', user.id)
          .single();

        if (profile?.appearance_year) {
          setAppearanceYear(profile.appearance_year);
        }

        const companionActive = profile?.user_tier === 'companion';
        setIsCompanion(companionActive);

        // If Companion, fetch previous portal sessions for AI memory
        if (companionActive) {
          const { data: prevSessions } = await supabase
            .from('portal_rounds')
            .select('round_number, question, user_input, ai_response, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

          if (prevSessions && prevSessions.length > 0) {
            const memoryContext = prevSessions
              .slice(0, 10)
              .map((r: { round_number: number; question: string; user_input: string | null; ai_response: string | null; created_at: string }) =>
                `[${new Date(r.created_at).toLocaleDateString()}] Round ${r.round_number}: "${r.user_input?.substring(0, 200) || ''}"`
              )
              .join('\n');
            setPreviousSessionsContext(memoryContext);
          }
        }
      } catch {
        // non-critical
      }
    };
    fetchTierAndMemory();
  }, []);

  // ── Restore draft on mount ──────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft: PortalDraft = JSON.parse(raw);
      if (
        draft &&
        typeof draft.currentRound === 'number' &&
        Array.isArray(draft.rounds) &&
        draft.currentRound >= 1 &&
        draft.currentRound <= 5
      ) {
        setCurrentRound(draft.currentRound);
        setRounds(draft.rounds);
        if (draft.currentInput) {
          setCurrentInput(draft.currentInput);
          setWordCount(draft.currentInput.trim() ? draft.currentInput.trim().split(/\s+/).length : 0);
          setHasUnsavedInput(true);
        }
        if (draft.currentRound > 1 || draft.rounds.length > 0 || draft.currentInput) {
          setDraftRestored(true);
          toast('Draft restored — you can continue where you left off.', {
            duration: 4000,
          });
        }
      }
    } catch {
      // ignore corrupt drafts
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-save draft while typing ───────────────────────────────────────
  const saveDraft = useCallback(
    (input: string, round: number, completedRounds: PortalRound[]) => {
      try {
        const draft: PortalDraft = {
          currentRound: round,
          rounds: completedRounds,
          currentInput: input,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setHasUnsavedInput(false);
      } catch {
        // storage unavailable
      }
    },
    []
  );

  const scheduleSave = useCallback(
    (input: string, round: number, completedRounds: PortalRound[]) => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      setHasUnsavedInput(true);
      autosaveTimerRef.current = setTimeout(() => {
        saveDraft(input, round, completedRounds);
      }, AUTOSAVE_DELAY);
    },
    [saveDraft]
  );

  // ── Clear draft on completion ──────────────────────────────────────────
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setHasUnsavedInput(false);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error('The Portal could not respond. Please try again.');
      setSubmitting(false);
    }
  }, [error]);

  useEffect(() => {
    if (response && submitting && !isLoading) {
      handleGeminiResponse(response);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isLoading]);

  const handleGeminiResponse = (rawResponse: string) => {
    const isRound5 = currentRound === 5;

    if (isRound5) {
      const jsonStartIndex = rawResponse.lastIndexOf('{');
      const closingText = jsonStartIndex > 0
        ? rawResponse.substring(0, jsonStartIndex).trim()
        : rawResponse.trim();

      setFinalReflection(closingText);

      const newRound: PortalRound = {
        roundNumber: 5,
        question: NODE_ROUND_QUESTIONS[userNode][4],
        userInput: currentInput,
        aiResponse: closingText,
        completedAt: new Date().toISOString(),
      };

      setRounds((prev) => [...prev, newRound]);
      setStatus('completed');
      setSubmitting(false);
      setCurrentInput('');
      setWordCount(0);
      clearDraft();

      trackPortalRoundCompleted({ roundNumber: 5, node: userNode, wordCount });
      trackPortalCompleted(userNode);

      setTimeout(() => setShowCertificate(true), 1500);
      toast.success('The Portal is complete. The House remembers you were here.');
    } else {
      const newRound: PortalRound = {
        roundNumber: currentRound,
        question: NODE_ROUND_QUESTIONS[userNode][currentRound - 1],
        userInput: currentInput,
        aiResponse: rawResponse.trim(),
        completedAt: new Date().toISOString(),
      };

      const updatedRounds = [...rounds, newRound];
      setRounds(updatedRounds);
      trackPortalRoundCompleted({ roundNumber: currentRound, node: userNode, wordCount });
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setSubmitting(false);
      setCurrentInput('');
      setWordCount(0);

      // Save draft with new round completed and empty input for next round
      saveDraft('', nextRound, updatedRounds);
      setHasUnsavedInput(false);

      setTimeout(() => setResponseVisible(true), 200);
      toast.success(`Round ${currentRound} complete. The Portal holds your words.`);
    }
  };

  const handleSubmitRound = async () => {
    if (!currentInput.trim() || currentInput.trim().split(/\s+/).length < 5) {
      toast.error('Write at least a few words before continuing.');
      return;
    }

    setSubmitting(true);
    setResponseVisible(false);

    const isRound5 = currentRound === 5;
    const previousRoundsText = rounds.map((r) =>
      `Round ${r.roundNumber}:\nQuestion: ${r.question}\nUser: ${r.userInput}\nPortal: ${r.aiResponse}`
    ).join('\n\n---\n\n');

    // Build generational context string if available
    const currentYear = new Date().getFullYear();
    const ageContext = appearanceYear
      ? `\nUSER GENERATIONAL CONTEXT: Born in ${appearanceYear} (approximately ${currentYear - appearanceYear} years old). Calibrate the depth, vocabulary, and cultural references of your responses to this life stage — neither condescend nor overcomplicate. A person of ${currentYear - appearanceYear} carries specific textures of time.`
      : '';

    // Build AI memory context for Companion users
    const memoryContext = isCompanion && previousSessionsContext
      ? `\nCOMPANION MEMORY — Previous sessions (most recent first):\n${previousSessionsContext}\nUse this memory subtly — notice patterns, recurring images, or themes across sessions. Do not reference it directly unless it illuminates the present moment.`
      : '';

    let prompt: string;

    if (isRound5) {
      prompt = `${GLOBAL_INSTRUCTION}${ageContext}${memoryContext}

This user has completed all 5 rounds of the Portal.
Node: ${NODE_NAMES[userNode]}
${NODE_METAPHOR_LANGUAGE[userNode]}

Full journey:
---
${previousRoundsText}

Round 5 — Final input from user:
${currentInput}
---

Write a closing reflection of 300-400 words that:
- Honors the arc of their journey — name what you witnessed across all five rounds, not what it means
- Use the node's metaphorical language throughout — naturally, not forcefully
- Pick up specific words and images the user used across the rounds — transform them, do not replace them
- Do not offer conclusions, advice, interpretations, or "you have grown" - Do not say"you are ready" or "you have arrived" or "you have healed"
- The tone is slow, literary, warm — each sentence has weight
- End with exactly this sentence (translated to their language if not English): "The House remembers you were here."

After the reflection, return this JSON on a new line:
{
  "journey_arc": "[one sentence describing the emotional movement witnessed across the five rounds]",
  "portal_completed": true
}`;
    } else {
      prompt = `${GLOBAL_INSTRUCTION}${ageContext}${memoryContext}

You are guiding a user through the NoMoreQuiet Portal — Round ${currentRound} of 5.
Node: ${NODE_NAMES[userNode]}
${NODE_METAPHOR_LANGUAGE[userNode]}

${previousRoundsText ? `Full journey so far:\n---\n${previousRoundsText}\n---\n\n` : ''}Current round — user's response:
---
${currentInput}
---

Your response for Round ${currentRound} (maximum 120 words):
- Pick up ONE specific thing they wrote — one word, one image, one phrase. Not everything. One thing.
- Reflect it back in the node's metaphorical language — transform it, deepen it, do not analyze it
- Do not offer advice, conclusions, or "well done"
- Do not say "I understand"or any therapeutic opener - Then ask exactly ONE question — the next round's question:"${NODE_ROUND_QUESTIONS[userNode][currentRound]}"
- The question should feel like it arrives naturally from what you just reflected — not as a separate prompt
- Respond in the same language as the user's input`;
    }

    sendMessage(
      [{ role: 'user', content: prompt }],
      { temperature: 0.85, max_tokens: isRound5 ? 800 : 300 }
    );
  };

  const handleInputChange = (value: string) => {
    setCurrentInput(value);
    const wc = value.trim() ? value.trim().split(/\s+/).length : 0;
    setWordCount(wc);
    scheduleSave(value, currentRound, rounds);
  };

  const handleDownloadCertificate = () => {
    toast.success('Certificate will be emailed to you. Builder light granted on the pyramid.');
  };

  const handleReturnToVault = () => {
    router.push('/journal-screen');
  };

  const currentQuestion = NODE_ROUND_QUESTIONS[userNode][currentRound - 1];

  // ── Rate limit loading state ───────────────────────────────────────────
  if (!rateLimitChecked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0805',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#c8822a',
            boxShadow: '0 0 12px rgba(200,130,42,0.6)',
            animation: 'unsavedPulse 1.8s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  // ── Rate limit blocked gate ────────────────────────────────────────────
  if (rateLimitBlocked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0805',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: 'rgba(15,10,5,0.85)',
            border: '1px solid rgba(200,130,42,0.2)',
            borderRadius: '2px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Amber glow dot */}
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#c8822a',
              boxShadow: '0 0 16px rgba(200,130,42,0.5)',
              margin: '0 auto 2rem',
            }}
          />

          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.6rem',
              fontWeight: 300,
              color: 'rgba(232,220,200,0.9)',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
              lineHeight: 1.3,
            }}
          >
            The Portal rests until tomorrow.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'rgba(180,160,130,0.7)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Free access allows one journey per day. The mountain does not rush.
            Return tomorrow, or unlock unlimited sessions with NMQ Companion.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => router.push('/pricing')}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                background: 'linear-gradient(135deg, #c8822a, #a06020)',
                border: 'none',
                borderRadius: '2px',
                color: '#0a0805',
                fontFamily: 'var(--font-cormorant)',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Become a Companion — €4.99/mo
            </button>

            <button
              onClick={() => router.push('/journal-screen')}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                border: '1px solid rgba(200,130,42,0.25)',
                borderRadius: '2px',
                color: 'rgba(180,160,130,0.6)',
                fontFamily: 'var(--font-cormorant)',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              Return to the Vault
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PortalCompanionFlow
      nodeName={NODE_NAMES[userNode]}
      currentRound={currentRound}
      rounds={rounds}
      currentInput={currentInput}
      wordCount={wordCount}
      submitting={submitting}
      isLoading={isLoading}
      responseVisible={responseVisible}
      status={status}
      showCertificate={showCertificate}
      finalReflection={finalReflection}
      currentQuestion={currentQuestion}
      hasUnsavedInput={hasUnsavedInput}
      draftRestored={draftRestored}
      onInputChange={handleInputChange}
      onSubmit={handleSubmitRound}
      onDownloadCertificate={handleDownloadCertificate}
      onReturnToVault={handleReturnToVault}
    />
  );
}
