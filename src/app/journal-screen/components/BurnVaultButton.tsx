'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

/**
 * WF-06: Burn the Vault (Hard Delete)
 * Requires 3 confirmation steps before executing.
 */
export default function BurnVaultButton() {
  const [confirmStep, setConfirmStep] = useState(0);
  const [burning, setBurning] = useState(false);

  const CONFIRM_MESSAGES = [
    'This will permanently delete all your entries, Portal records, and account.',
    'Your light on the map will remain — anonymized. Your words will be gone.',
    'This cannot be undone. The House will hold no record of you.',
  ];

  const handleBurnClick = () => {
    if (confirmStep < 3) {
      setConfirmStep((prev) => prev + 1);
    }
  };

  const handleConfirmBurn = async () => {
    setBurning(true);
    // In production: DELETE /api/user/burn-vault
    // 1. Delete all JournalEntry records
    // 2. Delete all Portal and PortalRound records
    // 3. Delete all DeepInsight and DeepRead records
    // 4. Anonymize Light records (user = null, light stays on map)
    // 5. Delete User record
    // 6. SendGrid: confirmation email
    await new Promise((r) => setTimeout(r, 2000));
    toast?.success('Your Vault has been burned. The House holds no record.');
    setBurning(false);
    setTimeout(() => { window.location.href = '/landing-page'; }, 1500);
  };

  const handleCancel = () => {
    setConfirmStep(0);
  };

  if (confirmStep === 0) {
    return (
      <button
        className="w-full nmq-label text-silence hover:text-ember transition-colors text-center py-1"
        style={{ fontSize: '0.45rem', letterSpacing: '0.15em' }}
        onClick={handleBurnClick}
        aria-label="Burn the Vault — delete all data"
      >
        BURN THE VAULT
      </button>
    );
  }

  return (
    <div
      className="p-3 border transition-all duration-300"
      style={{
        borderColor: confirmStep === 3 ? 'rgba(255,107,43,0.4)' : 'rgba(255,107,43,0.15)',
        background: confirmStep === 3 ? 'rgba(255,107,43,0.06)' : 'rgba(255,107,43,0.03)',
      }}
    >
      <div className="flex items-start gap-2 mb-3">
        <Icon name="FireIcon" size={12} className="text-ember flex-shrink-0 mt-0.5" />
        <p className="font-cormorant italic text-cream/70 text-xs leading-relaxed">
          {CONFIRM_MESSAGES?.[confirmStep - 1]}
        </p>
      </div>
      {confirmStep < 3 ? (
        <div className="flex gap-2">
          <button
            className="flex-1 nmq-label py-1.5 border border-silence/30 text-silence hover:text-mist transition-colors"
            style={{ fontSize: '0.4rem' }}
            onClick={handleCancel}
          >
            CANCEL
          </button>
          <button
            className="flex-1 nmq-label py-1.5 border border-ember/30 text-ember hover:border-ember/60 transition-colors"
            style={{ fontSize: '0.4rem' }}
            onClick={handleBurnClick}
          >
            CONTINUE ({3 - confirmStep} left)
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="flex-1 nmq-label py-1.5 border border-silence/30 text-silence hover:text-mist transition-colors"
            style={{ fontSize: '0.4rem' }}
            onClick={handleCancel}
            disabled={burning}
          >
            CANCEL
          </button>
          <button
            className="flex-1 nmq-label py-1.5 border border-ember/50 bg-ember/10 text-ember hover:bg-ember/20 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
            style={{ fontSize: '0.4rem' }}
            onClick={handleConfirmBurn}
            disabled={burning}
          >
            {burning ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
                <span>BURNING...</span>
              </>
            ) : (
              'BURN EVERYTHING'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
