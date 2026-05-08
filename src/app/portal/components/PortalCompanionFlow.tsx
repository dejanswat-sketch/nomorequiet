'use client';

import React, { useRef, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface PortalRound {
  roundNumber: number;
  question: string;
  userInput: string;
  aiResponse: string;
  completedAt: string | null;
}

interface PortalCompanionFlowProps {
  nodeName: string;
  currentRound: number;
  rounds: PortalRound[];
  currentInput: string;
  wordCount: number;
  submitting: boolean;
  isLoading: boolean;
  responseVisible: boolean;
  status: 'active' | 'completed';
  showCertificate: boolean;
  finalReflection: string;
  currentQuestion: string;
  hasUnsavedInput?: boolean;
  draftRestored?: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onDownloadCertificate: () => void;
  onReturnToVault: () => void;
}

const NODE_COLORS: Record<string, string> = {
  Rtanj: '#c8822a',
  Sedona: '#c0522a',
  Kailash: '#8a9ab5',
  Shasta: '#5a8a7a',
  Glastonbury: '#7a8a5a',
  'Machu Picchu': '#b5a05a',
  'Es Vedrà': '#5a7ab5',
};

function RoundProgressDots({
  currentRound,
  totalRounds,
  status,
  hasUnsavedInput,
}: {
  currentRound: number;
  totalRounds: number;
  status: 'active' | 'completed';
  hasUnsavedInput?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: totalRounds }, (_, i) => {
        const roundNum = i + 1;
        const isCompleted = roundNum < currentRound || status === 'completed';
        const isCurrent = roundNum === currentRound && status === 'active';
        const isFuture = roundNum > currentRound && status === 'active';
        const showUnsaved = isCurrent && hasUnsavedInput;

        return (
          <div key={roundNum} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div
                style={{
                  width: isCurrent ? '14px' : '10px',
                  height: isCurrent ? '14px' : '10px',
                  borderRadius: '50%',
                  border: `1.5px solid ${isCompleted ? '#c8822a' : isCurrent ? '#D4AF37' : '#3a3028'}`,
                  background: isCompleted
                    ? '#c8822a'
                    : isCurrent
                    ? 'rgba(212,175,55,0.2)'
                    : 'transparent',
                  boxShadow: isCurrent ? '0 0 8px rgba(212,175,55,0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                {isCompleted && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                      <path d="M1 3l1.5 1.5L5 1.5" stroke="#0a0805" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {/* Unsaved indicator — small amber pulse dot at top-right of current dot */}
                {showUnsaved && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#e8a020',
                      border: '1px solid #0a0805',
                      animation: 'unsavedPulse 1.8s ease-in-out infinite',
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: '0.4rem',
                  letterSpacing: '0.08em',
                  color: isCompleted ? '#c8822a' : isCurrent ? '#D4AF37' : '#3a3028',
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                }}
              >
                {roundNum}
              </span>
            </div>
            {roundNum < totalRounds && (
              <div
                style={{
                  width: '24px',
                  height: '1px',
                  background: roundNum < currentRound || status === 'completed' ?'linear-gradient(90deg, #c8822a, #c8822a88)' :'#2a2018',
                  transition: 'background 0.5s ease',
                  marginBottom: '14px',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PreviousRoundSummary({ round }: { round: PortalRound }) {
  return (
    <div
      className="relative pl-5"
      style={{
        borderLeft: '1px solid rgba(200,130,42,0.2)',
      }}
    >
      {/* Round marker */}
      <div
        style={{
          position: 'absolute',
          left: '-4px',
          top: '4px',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#c8822a',
          border: '1px solid #0a0805',
        }}
      />

      <div className="mb-1 flex items-center gap-2">
        <span
          style={{
            fontSize: '0.42rem',
            letterSpacing: '0.12em',
            color: '#5a4e40',
            fontFamily: 'var(--font-cormorant)',
            textTransform: 'uppercase',
          }}
        >
          Round {round.roundNumber}
        </span>
        {round.completedAt && (
          <span
            style={{
              fontSize: '0.38rem',
              color: '#3a3028',
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
            }}
          >
            ·{' '}
            {new Date(round.completedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        )}
      </div>

      <p
        className="font-cormorant italic mb-2"
        style={{ fontSize: '0.8rem', color: '#7a6a58', lineHeight: 1.5 }}
      >
        {round.question}
      </p>

      <p
        className="font-cormorant italic mb-2"
        style={{ fontSize: '0.85rem', color: 'rgba(232,220,200,0.6)', lineHeight: 1.6 }}
      >
        &ldquo;{round.userInput}&rdquo;
      </p>

      {round.aiResponse && round.roundNumber < 5 && (
        <p
          className="font-cormorant italic"
          style={{ fontSize: '0.85rem', color: 'rgba(200,130,42,0.75)', lineHeight: 1.6 }}
        >
          {round.aiResponse}
        </p>
      )}
    </div>
  );
}

export default function PortalCompanionFlow({
  nodeName,
  currentRound,
  rounds,
  currentInput,
  wordCount,
  submitting,
  isLoading,
  responseVisible,
  status,
  showCertificate,
  finalReflection,
  currentQuestion,
  hasUnsavedInput,
  draftRestored,
  onInputChange,
  onSubmit,
  onDownloadCertificate,
  onReturnToVault,
}: PortalCompanionFlowProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastRound = rounds[rounds.length - 1];
  const nodeColor = NODE_COLORS[nodeName] || '#c8822a';

  useEffect(() => {
    if (status === 'active' && !submitting && !isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentRound, status, submitting, isLoading]);

  return (
    <div className="min-h-screen" style={{ background: '#0a0805' }}>
      {/* ── Top bar ── */}
      <header
        style={{
          borderBottom: '1px solid rgba(200,130,42,0.1)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(10,8,5,0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Left: logo + node label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AppLogo src="/assets/images/ikona2-1777358983549.png" size={26} />
          <div>
            <p
              style={{
                fontSize: '0.42rem',
                letterSpacing: '0.18em',
                color: nodeColor,
                fontFamily: 'var(--font-cormorant)',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              THE PORTAL · {nodeName.toUpperCase()}
            </p>
            <p
              className="font-cormorant italic"
              style={{ fontSize: '0.65rem', color: '#5a4e40' }}
            >
              Companion · 5-round journey
            </p>
          </div>
        </div>

        {/* Right: progress dots + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <RoundProgressDots
            currentRound={currentRound}
            totalRounds={5}
            status={status}
            hasUnsavedInput={hasUnsavedInput}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span
              style={{
                fontSize: '0.42rem',
                letterSpacing: '0.12em',
                color: status === 'completed' ? '#D4AF37' : '#5a4e40',
                fontFamily: 'var(--font-cormorant)',
                textTransform: 'uppercase',
                minWidth: '70px',
                textAlign: 'right',
              }}
            >
              {status === 'completed' ? 'Complete' : `Round ${currentRound} of 5`}
            </span>
            {hasUnsavedInput && status === 'active' && (
              <span
                style={{
                  fontSize: '0.38rem',
                  letterSpacing: '0.08em',
                  color: '#e8a020',
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  textAlign: 'right',
                  opacity: 0.8,
                }}
              >
                saving…
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Draft restored banner ── */}
        {draftRestored && status === 'active' && (
          <div
            style={{
              marginBottom: '28px',
              padding: '10px 16px',
              border: '1px solid rgba(200,130,42,0.2)',
              background: 'rgba(200,130,42,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#c8822a',
                flexShrink: 0,
                display: 'inline-block',
              }}
            />
            <p
              className="font-cormorant italic"
              style={{ fontSize: '0.78rem', color: '#c8822a', lineHeight: 1.5 }}
            >
              Your journey continues — the Portal held your place.
            </p>
          </div>
        )}

        {/* ── Certificate ── */}
        {status === 'completed' && showCertificate && (
          <div
            style={{
              marginBottom: '48px',
              padding: '40px 32px',
              border: '1px solid rgba(212,175,55,0.3)',
              background: 'rgba(212,175,55,0.03)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <AppLogo src="/assets/images/ikona2-1777358983549.png" size={52} />
            </div>
            <p
              style={{
                fontSize: '0.45rem',
                letterSpacing: '0.2em',
                color: '#D4AF37',
                fontFamily: 'var(--font-cormorant)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Certificate of Passage
            </p>
            <p
              className="font-cormorant italic"
              style={{ fontSize: '1.5rem', color: '#e8dcc8', marginBottom: '8px', fontWeight: 300 }}
            >
              The Portal is complete.
            </p>
            <p
              className="font-cormorant italic"
              style={{ fontSize: '0.9rem', color: '#5a4e40', marginBottom: '20px' }}
            >
              {nodeName} · 5 rounds ·{' '}
              {new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p
              className="font-cormorant italic"
              style={{ fontSize: '1.05rem', color: '#D4AF37' }}
            >
              The House remembers you were here.
            </p>
            <div
              style={{
                marginTop: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <button
                className="amber-btn"
                style={{ padding: '10px 28px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={onDownloadCertificate}
              >
                <Icon name="DocumentArrowDownIcon" size={14} />
                Download Certificate
              </button>
              <button
                className="ghost-btn"
                style={{ padding: '10px 28px', fontSize: '0.8rem' }}
                onClick={onReturnToVault}
              >
                Return to the Vault
              </button>
            </div>
          </div>
        )}

        {/* ── Final reflection ── */}
        {status === 'completed' && finalReflection && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span
                className="light-dot light-dot-founding"
                style={{ width: '5px', height: '5px' }}
              />
              <p
                style={{
                  fontSize: '0.42rem',
                  letterSpacing: '0.18em',
                  color: '#D4AF37',
                  fontFamily: 'var(--font-cormorant)',
                  textTransform: 'uppercase',
                }}
              >
                The House Closes the Portal
              </p>
            </div>
            <p
              className="font-cormorant italic"
              style={{
                fontSize: '1.1rem',
                color: 'rgba(232,220,200,0.85)',
                lineHeight: 1.85,
                fontWeight: 300,
              }}
            >
              {finalReflection}
            </p>
          </div>
        )}

        {/* ── Previous rounds summary ── */}
        {rounds.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            {/* Section header */}
            {status === 'active' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'rgba(200,130,42,0.1)' }} />
                <p
                  style={{
                    fontSize: '0.4rem',
                    letterSpacing: '0.16em',
                    color: '#3a3028',
                    fontFamily: 'var(--font-cormorant)',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Journey so far
                </p>
                <div style={{ flex: 1, height: '1px', background: 'rgba(200,130,42,0.1)' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {rounds.map((round) => (
                <PreviousRoundSummary key={`summary-${round.roundNumber}`} round={round} />
              ))}
            </div>

            {/* Divider before current round */}
            {status === 'active' && (
              <div
                style={{
                  marginTop: '32px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(200,130,42,0.25), transparent)',
                }}
              />
            )}
          </div>
        )}

        {/* ── Active round ── */}
        {status === 'active' && (
          <div>
            {/* Portal response from previous round */}
            {lastRound?.aiResponse && responseVisible && (
              <div
                style={{
                  marginBottom: '32px',
                  padding: '20px 24px',
                  border: '1px solid rgba(200,130,42,0.15)',
                  background: 'rgba(17,14,10,0.7)',
                  animation: 'fadeIn 0.6s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span
                    className="light-dot pulse-slow"
                    style={{ width: '5px', height: '5px' }}
                  />
                  <p
                    style={{
                      fontSize: '0.4rem',
                      letterSpacing: '0.16em',
                      color: '#D4AF37',
                      fontFamily: 'var(--font-cormorant)',
                      textTransform: 'uppercase',
                    }}
                  >
                    The Portal Responds
                  </p>
                </div>
                <p
                  className="font-cormorant italic"
                  style={{ fontSize: '1rem', color: 'rgba(232,220,200,0.85)', lineHeight: 1.75 }}
                >
                  {lastRound.aiResponse}
                </p>
              </div>
            )}

            {/* Current question */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px',
                }}
              >
                {/* Round badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    border: `1px solid ${nodeColor}40`,
                    background: `${nodeColor}0d`,
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: nodeColor,
                      display: 'inline-block',
                      boxShadow: `0 0 6px ${nodeColor}80`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.42rem',
                      letterSpacing: '0.14em',
                      color: nodeColor,
                      fontFamily: 'var(--font-cormorant)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Round {currentRound} of 5
                  </span>
                </div>
              </div>

              <p
                className="font-cormorant italic"
                style={{
                  fontSize: '1.6rem',
                  color: '#e8dcc8',
                  lineHeight: 1.4,
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                }}
              >
                {currentQuestion}
              </p>
            </div>

            {/* Textarea */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <textarea
                ref={textareaRef}
                className="textarea-nmq w-full"
                style={{
                  minHeight: '180px',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  resize: 'vertical',
                  transition: 'border-color 0.2s ease',
                }}
                placeholder="Write here. Take your time. The Portal waits."
                value={currentInput}
                onChange={(e) => onInputChange(e.target.value)}
                disabled={submitting || isLoading}
                aria-label={`Round ${currentRound} response`}
              />

              {/* Word count inside textarea bottom-right */}
              {wordCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '14px',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    className="font-cormorant italic"
                    style={{ fontSize: '0.7rem', color: '#3a3028' }}
                  >
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                </div>
              )}
            </div>

            {/* Footer row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <p
                className="font-cormorant italic"
                style={{ fontSize: '0.75rem', color: '#3a3028' }}
              >
                {wordCount === 0
                  ? 'There is no rush. The Portal waits.'
                  : wordCount < 5
                  ? 'A few more words…' :''}
              </p>

              <button
                className="amber-btn"
                style={{
                  padding: '12px 32px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: submitting || isLoading || wordCount < 5 ? 0.45 : 1,
                  cursor: submitting || isLoading || wordCount < 5 ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onClick={onSubmit}
                disabled={submitting || isLoading || wordCount < 5}
              >
                {submitting || isLoading ? (
                  <>
                    <span
                      className="light-dot pulse-amber"
                      style={{ width: '5px', height: '5px' }}
                    />
                    <span>The Portal is listening…</span>
                  </>
                ) : currentRound === 5 ? (
                  <>
                    <Icon name="SparklesIcon" size={14} />
                    Complete the Portal
                  </>
                ) : (
                  <>
                    Continue the Journey
                    <Icon name="ArrowRightIcon" size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Hint */}
            <p
              className="font-cormorant italic"
              style={{
                fontSize: '0.7rem',
                color: '#2a2018',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              You can return to this round later. The Portal holds your place.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes unsavedPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
