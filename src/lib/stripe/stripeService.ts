import { stripe, NMQ_PRICES, type StarMagnitude } from './client';
import { createClient } from '@/lib/supabase/server';

export interface CreateLightCheckoutParams {
  userId: string;
  userEmail: string;
  magnitude: StarMagnitude;
  fragment?: string;
  nodeId?: string;
  amountCents: number;
}

export interface CreateProductCheckoutParams {
  userId: string;
  userEmail: string;
  product: 'deep_insight' | 'deep_read';
}

export interface CreateCompanionCheckoutParams {
  userId: string;
  userEmail: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nomorequie6253.builtwithrocket.new';

const PRODUCT_NAMES: Record<string, string> = {
  iskra: 'ISKRA — Spark Light',
  svetlost: 'SVETLOST — Radiant Light',
  svemir: 'SVEMIR — Universe Light',
  deep_insight: 'Deep Insight — Jungian Soul Analysis',
  deep_read: 'The Deep Read — Human Analysis',
  companion: 'NMQ Companion — Monthly Subscription',
};

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  iskra: 'A small, white light placed permanently on the NMQ pyramid. Quiet. Present. Yours.',
  svetlost: 'A larger amber presence. Visible from across the pyramid. It breathes.',
  svemir: 'A dominant gold star with halo. Seen from everywhere in the pyramid.',
  deep_insight: 'Instant 600–800 word Jungian AI Soul Analysis: archetypes, Shadow topics, and your inner landscape.',
  deep_read: 'A human reads your entries. Personal, unhurried, real. Delivered within 48–72 hours.',
  companion: 'Monthly access to AI memory, Personal Arc timeline, and full 5-round Portal.',
};

async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  await supabase.from('stripe_customers').insert({
    user_id: userId,
    stripe_customer_id: customer.id,
  });

  return customer.id;
}

export async function createLightCheckoutSession(params: CreateLightCheckoutParams) {
  const { userId, userEmail, magnitude, fragment, nodeId, amountCents } = params;

  const customerId = await getOrCreateStripeCustomer(userId, userEmail);
  const productName = PRODUCT_NAMES[magnitude];
  const description = PRODUCT_DESCRIPTIONS[magnitude];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&product=light&magnitude=${magnitude}&fragment=${encodeURIComponent(fragment || '')}`,
    cancel_url: `${SITE_URL}/pricing`,
    line_items: [
      {
        price_data: {
          currency: NMQ_PRICES[magnitude].currency,
          product_data: { name: productName, description },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      supabase_user_id: userId,
      product: 'light',
      magnitude,
      fragment: fragment || '',
      node_id: nodeId || 'rtanj',
    },
    payment_intent_data: {
      metadata: { supabase_user_id: userId, product: 'light', magnitude },
    },
  });

  return session;
}

export async function createProductCheckoutSession(params: CreateProductCheckoutParams) {
  const { userId, userEmail, product } = params;

  const customerId = await getOrCreateStripeCustomer(userId, userEmail);
  const amount = NMQ_PRICES[product].amount;
  const currency = NMQ_PRICES[product].currency;
  const productName = PRODUCT_NAMES[product];
  const description = PRODUCT_DESCRIPTIONS[product];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
    cancel_url: `${SITE_URL}/pricing`,
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: productName, description },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      supabase_user_id: userId,
      product,
    },
    payment_intent_data: {
      metadata: { supabase_user_id: userId, product },
    },
  });

  return session;
}

export async function createCompanionCheckoutSession(params: CreateCompanionCheckoutParams) {
  const { userId, userEmail } = params;

  const customerId = await getOrCreateStripeCustomer(userId, userEmail);
  const companionPriceId = process.env.STRIPE_COMPANION_PRICE_ID;

  const lineItem = companionPriceId
    ? { price: companionPriceId, quantity: 1 }
    : {
        price_data: {
          currency: 'eur',
          product_data: {
            name: PRODUCT_NAMES.companion,
            description: PRODUCT_DESCRIPTIONS.companion,
          },
          unit_amount: NMQ_PRICES.companion_monthly.amount,
          recurring: { interval: 'month' as const },
        },
        quantity: 1,
      };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&product=companion`,
    cancel_url: `${SITE_URL}/pricing`,
    line_items: [lineItem],
    metadata: {
      supabase_user_id: userId,
      product: 'companion',
    },
    subscription_data: {
      metadata: { supabase_user_id: userId },
    },
  });

  return session;
}
