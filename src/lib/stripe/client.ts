import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

// NMQ Product price map — EUR pricing
export const NMQ_PRICES = {
  // One-time light purchases (price_data used inline)
  iskra: { min: 100, max: 500, currency: 'eur' },       // €1–€5
  svetlost: { min: 1000, max: 2000, currency: 'eur' },  // €10–€20
  svemir: { min: 5000, currency: 'eur' },                // €50+

  // Deep Insight — one-time €10
  deep_insight: { amount: 1000, currency: 'eur' },

  // Deep Read — one-time €49
  deep_read: { amount: 4900, currency: 'eur' },

  // Companion — monthly subscription €4.99
  // Set STRIPE_COMPANION_PRICE_ID in .env after creating recurring price in Stripe dashboard
  companion_monthly: { amount: 499, currency: 'eur' },
} as const;

export type NMQProduct = 'light' | 'deep_insight' | 'deep_read' | 'companion';
export type StarMagnitude = 'iskra' | 'svetlost' | 'svemir';
