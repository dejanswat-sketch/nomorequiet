'use client';

import React from 'react';
import { toast } from 'sonner';
import type { RitualMode } from './AdminLayout';

interface RitualSwitchProps {
  currentMode: RitualMode;
  onModeChange: (mode: RitualMode) => void;
}

const RITUAL_MODES: {
  id: RitualMode;
  name: string;
  label: string;
  description: string;
  colorShift: string;
  when: string;
  preview: { bg: string; accent: string; text: string };
}[] = [
  {
    id: 'default',
    name: 'Default',
    label: 'AMBER / BLACK',
    description: 'The standard House atmosphere. Amber light, void black. Always available.',
    colorShift: 'Amber #c8822a · Gold #D4AF37 · Void #0a0806',
    when: 'Always',
    preview: { bg: '#0a0806', accent: '#c8822a', text: '#f0e8d8' },
  },
  {
    id: 'dawn',
    name: 'Dawn',
    label: 'WARM ROSE / GOLD',
    description: 'Spring equinox atmosphere. Warm rose and gold — the House waking up after winter.',
    colorShift: 'Amber shifts to #e8936a · Gold shifts to #f0c070',
    when: 'Spring equinox · March 20',
    preview: { bg: '#0d0a09', accent: '#e8936a', text: '#f5ece0' },
  },
  {
    id: 'solstice',
    name: 'Solstice',
    label: 'DEEP ORANGE / GOLD',
    description: 'Summer solstice. The pyramid illuminates from inside. The longest day.',
    colorShift: 'Amber shifts to #ff7a1a · Gold shifts to #ffb830',
    when: 'Summer solstice · June 21',
    preview: { bg: '#0a0704', accent: '#ff7a1a', text: '#f8ead8' },
  },
  {
    id: 'ember',
    name: 'Ember',
    label: 'DEEP RED / BLACK',
    description: 'Autumn equinox. Lights slow to ember pace. What are you leaving behind?',
    colorShift: 'Amber shifts to #cc3a1a · Gold shifts to #ff6b2b',
    when: 'Autumn equinox · September 22',
    preview: { bg: '#0a0604', accent: '#cc3a1a', text: '#f0e0d8' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    label: 'COLD BLUE / BLACK',
    description: 'Special occasions. Cold blue atmosphere — the House in its most silent mode.',
    colorShift: 'Amber shifts to #4a6aaa · Gold shifts to #6a8acc',
    when: 'Special occasions',
    preview: { bg: '#060810', accent: '#4a6aaa', text: '#dce4f0' },
  },
];

export default function AdminRitualSwitch({ currentMode, onModeChange }: RitualSwitchProps) {
  const handleModeChange = (mode: RitualMode) => {
    onModeChange(mode);
    const modeInfo = RITUAL_MODES.find((m) => m.id === mode);
    toast.success(`Ritual mode changed to ${modeInfo?.name}. All users see this immediately.`);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-8 max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
          RITUAL SWITCH · GLOBAL
        </p>
        <h1 className="nmq-heading text-3xl italic text-gold">
          Change the atmosphere.
        </h1>
        <p className="font-cormorant italic text-mist text-base mt-1">
          This change is instant and global. All users see the new atmosphere immediately. Reversible at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {RITUAL_MODES.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={`ritual-${mode.id}`}
              className={`text-left nmq-card p-5 transition-all duration-300 group ${
                isActive
                  ? 'border-amber/50 bg-amber/8 scale-[1.02]'
                  : 'hover:border-amber/25 hover:bg-amber/4'
              }`}
              onClick={() => handleModeChange(mode.id)}
            >
              {/* Preview swatch */}
              <div
                className="w-full h-16 mb-4 flex items-center justify-center relative overflow-hidden"
                style={{ background: mode.preview.bg }}
              >
                {/* Pyramid preview */}
                <svg viewBox="0 0 40 32" className="w-12 h-10" aria-hidden="true">
                  <polygon
                    points="20,4 4,28 36,28"
                    fill="none"
                    stroke={mode.preview.accent}
                    strokeWidth="0.8"
                    opacity="0.8"
                  />
                  <line x1="20" y1="4" x2="12" y2="28" stroke={mode.preview.accent} strokeWidth="0.3" opacity="0.3" />
                  <line x1="20" y1="4" x2="28" y2="28" stroke={mode.preview.accent} strokeWidth="0.3" opacity="0.3" />
                  <circle cx="20" cy="14" r="1.5" fill={mode.preview.accent} opacity="0.8" />
                  <circle cx="15" cy="22" r="1" fill={mode.preview.accent} opacity="0.6" />
                  <circle cx="25" cy="20" r="0.8" fill={mode.preview.accent} opacity="0.5" />
                </svg>
                {isActive && (
                  <div
                    className="absolute top-2 right-2 nmq-label"
                    style={{ fontSize: '0.4rem', color: mode.preview.accent, letterSpacing: '0.2em' }}
                  >
                    ACTIVE
                  </div>
                )}
              </div>

              <p className="nmq-label mb-0.5" style={{ fontSize: '0.5rem', color: mode.preview.accent }}>
                {mode.label}
              </p>
              <p className="font-cormorant font-light text-cream text-base mb-2">{mode.name}</p>
              <p className="font-cormorant italic text-mist text-xs leading-relaxed mb-3">
                {mode.description}
              </p>
              <p className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                {mode.when}
              </p>
              <p className="nmq-label mt-1" style={{ fontSize: '0.38rem', color: '#3a3028' }}>
                {mode.colorShift}
              </p>
            </button>
          );
        })}
      </div>

      {/* Current mode info */}
      <div className="mt-8 nmq-card p-5 flex items-center justify-between">
        <div>
          <p className="nmq-label mb-1" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            CURRENTLY ACTIVE
          </p>
          <p className="nmq-heading text-xl italic text-gold">
            {RITUAL_MODES.find((m) => m.id === currentMode)?.name} Mode
          </p>
          <p className="font-cormorant italic text-mist text-sm mt-1">
            {RITUAL_MODES.find((m) => m.id === currentMode)?.description}
          </p>
        </div>
        {currentMode !== 'default' && (
          <button
            className="ghost-btn px-6 py-3 text-xs"
            onClick={() => handleModeChange('default')}
          >
            Reset to Default
          </button>
        )}
      </div>
    </div>
  );
}