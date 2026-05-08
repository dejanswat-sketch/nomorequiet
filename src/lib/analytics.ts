'use client';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function isEnabled(): boolean {
  return typeof window !== 'undefined' && !!GA_ID && !!window.gtag;
}

// ─── Page View ───────────────────────────────────────────────────────────────

export function trackPageView(url: string): void {
  if (!isEnabled()) return;
  window.gtag('config', GA_ID as string, { page_path: url });
}

// ─── Generic Event ────────────────────────────────────────────────────────────

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {}
): void {
  if (!isEnabled()) return;
  window.gtag('event', eventName, params);
}

// ─── Journal Events ───────────────────────────────────────────────────────────

/** Fired when user submits a journal entry and receives a reflection */
export function trackJournalEntrySubmitted(params: {
  node: string;
  wordCount: number;
  depthScore?: number;
  crisisFlag?: boolean;
  upsellTriggered?: string | null;
}): void {
  trackEvent('journal_entry_submitted', {
    node: params.node,
    word_count: params.wordCount,
    depth_score: params.depthScore ?? 0,
    crisis_flag: params.crisisFlag ?? false,
    upsell_triggered: params.upsellTriggered ?? 'none',
  });
}

/** Fired when an upsell modal is shown after a journal entry */
export function trackJournalUpsellShown(product: string, node: string): void {
  trackEvent('journal_upsell_shown', { product, node });
}

// ─── Light / Map Events ───────────────────────────────────────────────────────

/** Fired when a user views a node detail on the Map of Lights */
export function trackMapNodeViewed(nodeId: string): void {
  trackEvent('map_node_viewed', { node_id: nodeId });
}

/** Fired when a light is successfully created after payment */
export function trackLightCreated(params: {
  magnitude: string;
  nodeId: string;
  sessionId?: string;
}): void {
  trackEvent('light_created', {
    magnitude: params.magnitude,
    node_id: params.nodeId,
    session_id: params.sessionId ?? '',
  });
}

// ─── Portal Events ────────────────────────────────────────────────────────────

/** Fired when a Portal round is completed */
export function trackPortalRoundCompleted(params: {
  roundNumber: number;
  node: string;
  wordCount: number;
}): void {
  trackEvent('portal_round_completed', {
    round_number: params.roundNumber,
    node: params.node,
    word_count: params.wordCount,
  });
}

/** Fired when the full Portal journey (5 rounds) is completed */
export function trackPortalCompleted(node: string): void {
  trackEvent('portal_completed', { node });
}

// ─── Payment Funnel Events ────────────────────────────────────────────────────

/** Fired when a user initiates Stripe checkout */
export function trackCheckoutInitiated(params: {
  product: string;
  magnitude?: string;
  nodeId?: string;
  amountCents?: number;
}): void {
  trackEvent('checkout_initiated', {
    product: params.product,
    magnitude: params.magnitude ?? '',
    node_id: params.nodeId ?? '',
    amount_cents: params.amountCents ?? 0,
  });
}

/** Fired on the payment success page when a purchase is confirmed */
export function trackPurchaseSuccess(params: {
  product: string;
  magnitude?: string;
  sessionId?: string;
}): void {
  trackEvent('purchase_success', {
    product: params.product,
    magnitude: params.magnitude ?? '',
    session_id: params.sessionId ?? '',
  });
}
