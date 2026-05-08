'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { StarMagnitude } from '@/lib/stripe/client';
import { trackCheckoutInitiated } from '@/lib/analytics';

export interface StripeCheckoutError {
  message: string;
  declineCode?: string;
  type: 'card_declined' | 'network' | 'auth' | 'generic';
  retryable: boolean;
}

interface UseStripeCheckoutOptions {
  onError?: (error: string) => void;
}

function parseStripeError(data: { error?: string; decline_code?: string; error_type?: string }): StripeCheckoutError {
  const raw = data.error || 'Checkout failed';
  const declineCode = data.decline_code;
  const errorType = data.error_type;

  // Card decline messages
  const declineMessages: Record<string, string> = {
    insufficient_funds: 'Your card has insufficient funds. Please use a different card.',
    card_declined: 'Your card was declined. Please try a different payment method.',
    expired_card: 'Your card has expired. Please update your card details.',
    incorrect_cvc: 'The security code (CVC) is incorrect. Please check and try again.',
    incorrect_number: 'The card number is incorrect. Please check and try again.',
    lost_card: 'This card has been reported lost. Please use a different card.',
    stolen_card: 'This card has been reported stolen. Please use a different card.',
    do_not_honor: 'Your bank declined this transaction. Please contact your bank or use a different card.',
    fraudulent: 'This transaction was flagged. Please contact your bank or use a different card.',
    generic_decline: 'Your card was declined. Please try a different payment method.',
  };

  if (declineCode && declineMessages[declineCode]) {
    return {
      message: declineMessages[declineCode],
      declineCode,
      type: 'card_declined',
      retryable: !['lost_card', 'stolen_card', 'fraudulent'].includes(declineCode),
    };
  }

  if (errorType === 'card_error' || raw.toLowerCase().includes('card')) {
    return {
      message: raw,
      declineCode,
      type: 'card_declined',
      retryable: true,
    };
  }

  if (raw.toLowerCase().includes('authenticated') || raw.toLowerCase().includes('login')) {
    return {
      message: 'Please sign in to complete your purchase.',
      type: 'auth',
      retryable: false,
    };
  }

  return {
    message: raw,
    type: 'generic',
    retryable: true,
  };
}

export function useStripeCheckout(options?: UseStripeCheckoutOptions) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StripeCheckoutError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const checkout = useCallback(
    async (params: {
      product: 'light' | 'deep_insight' | 'deep_read' | 'companion';
      magnitude?: StarMagnitude;
      fragment?: string;
      nodeId?: string;
      amountCents?: number;
    }) => {
      setLoading(true);
      setError(null);

      trackCheckoutInitiated({
        product: params.product,
        magnitude: params.magnitude,
        nodeId: params.nodeId,
        amountCents: params.amountCents,
      });

      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        const data = await res.json();

        if (!res.ok) {
          const parsed = parseStripeError(data);
          setError(parsed);
          options?.onError?.(parsed.message);
          return;
        }

        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error';
        const networkError: StripeCheckoutError = {
          message: 'Connection failed. Please check your internet and try again.',
          type: 'network',
          retryable: true,
        };
        setError(networkError);
        options?.onError?.(msg);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { checkout, loading, error, clearError };
}
