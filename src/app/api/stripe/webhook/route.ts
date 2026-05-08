import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

export const config = {
  api: { bodyParser: false },
};

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof import('@supabase/supabase-js').createClient>
) {
  const userId = session.metadata?.supabase_user_id;
  const product = session.metadata?.product;

  if (!userId || !product) return;

  if (product === 'light') {
    const magnitude = (session.metadata?.magnitude || 'iskra') as string;
    const fragment = session.metadata?.fragment || '';
    const nodeId = session.metadata?.node_id || 'rtanj';
    const amountCents = session.amount_total || 0;
    const paymentIntent =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || null;

    const seed = session.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const mapX = 20 + ((seed * 7) % 60);
    const mapY = 20 + ((seed * 13) % 60);

    const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
      'create_light_with_purchase',
      {
        p_user_id: userId,
        p_node_id: nodeId,
        p_fragment: fragment,
        p_star_magnitude: magnitude,
        p_map_x: mapX,
        p_map_y: mapY,
        p_amount_cents: amountCents,
        p_payment_intent: paymentIntent,
        p_checkout_session: session.id,
      }
    );

    if (rpcError) {
      console.error('create_light_with_purchase RPC error:', rpcError);
      throw new Error(rpcError.message);
    }

    const lightId = (rpcData as { light_id: string; already_exists: boolean })?.light_id;
    const alreadyExists = (rpcData as { light_id: string; already_exists: boolean })?.already_exists;

    if (!alreadyExists && lightId) {
      await (supabase as any)
        .channel('nmq_light_created')
        .send({
          type: 'broadcast',
          event: 'light_placed',
          payload: {
            light_id: lightId,
            user_id: userId,
            fragment,
            star_magnitude: magnitude,
            node_id: nodeId,
            checkout_session: session.id,
          },
        });
    }

    // Update user_tier for light purchase
    await (supabase as any).rpc('update_user_tier_for_product', {
      p_user_id: userId,
      p_product: 'light',
    });

  } else if (product === 'deep_insight') {
    // Record purchase
    await (supabase as any).from('purchases').insert({
      user_id: userId,
      product: 'deep_insight',
      amount_cents: session.amount_total || 0,
      stripe_payment_intent:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
      stripe_checkout_session: session.id,
      stripe_status: 'paid',
    });

    // Update user_tier
    await (supabase as any).rpc('update_user_tier_for_product', {
      p_user_id: userId,
      p_product: 'deep_insight',
    });

    // Trigger Deep Insight AI report generation
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nomorequie6253.builtwithrocket.new';
      await fetch(`${siteUrl}/api/deep-insight/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-secret': process.env.STRIPE_WEBHOOK_SECRET || '' },
        body: JSON.stringify({ userId, checkoutSession: session.id }),
      });
    } catch (e) {
      console.error('Deep Insight generation trigger failed:', e);
      // Non-fatal — report can be regenerated
    }

  } else if (product === 'deep_read') {
    // Record purchase with correct product type
    await (supabase as any).from('purchases').insert({
      user_id: userId,
      product: 'deep_read',
      amount_cents: session.amount_total || 0,
      stripe_payment_intent:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
      stripe_checkout_session: session.id,
      stripe_status: 'paid',
    });

    // Fetch user's recent journal entries for admin context
    let journalEntries: unknown[] = [];
    try {
      const { data: entries } = await (supabase as any)
        .from('journal_entries')
        .select('content, created_at, depth_score, emotion_tags, shadow_topics, archetype_hint')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      journalEntries = entries || [];
    } catch {
      // non-fatal
    }

    // Add to deep_read_queue
    await (supabase as any).from('deep_read_queue').insert({
      user_id: userId,
      stripe_checkout_session: session.id,
      status: 'pending',
      journal_entries: journalEntries,
    });

    // Update user_tier
    await (supabase as any).rpc('update_user_tier_for_product', {
      p_user_id: userId,
      p_product: 'deep_read',
    });

    // Notify admin
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nomorequie6253.builtwithrocket.new';
      await fetch(`${siteUrl}/api/deep-read/notify-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-secret': process.env.STRIPE_WEBHOOK_SECRET || '' },
        body: JSON.stringify({ userId, checkoutSession: session.id, journalEntries }),
      });
    } catch (e) {
      console.error('Deep Read admin notification failed:', e);
    }

  } else if (product === 'companion') {
    await (supabase as any).from('purchases').insert({
      user_id: userId,
      product: 'companion',
      amount_cents: session.amount_total || 0,
      stripe_checkout_session: session.id,
      stripe_status: 'paid',
    });
    // Tier updated via subscription webhook below
  }
}

async function handleSubscriptionUpserted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof import('@supabase/supabase-js').createClient>
) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price?.id || null;
  const periodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : null;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  await (supabase as any).from('stripe_subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id:
        typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id,
      status: subscription.status,
      price_id: priceId,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: 'stripe_subscription_id' }
  );

  // Update user_tier based on subscription status
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await (supabase as any).rpc('update_user_tier_for_product', {
      p_user_id: userId,
      p_product: 'companion',
    });
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    await (supabase as any).rpc('downgrade_companion_tier', { p_user_id: userId });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  const { createClient: createServiceClient } = await import('@supabase/supabase-js');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey === 'your-supabase-service-role-key-here') {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    return NextResponse.json({ error: 'Server configuration error: missing service role key' }, { status: 500 });
  }
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session, supabase as any);
        break;
      }
      case 'customer.subscription.created': case'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpserted(subscription, supabase as any);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        await supabase
          .from('stripe_subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);
        if (userId) {
          await (supabase as any).rpc('downgrade_companion_tier', { p_user_id: userId });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subId =
            typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await handleSubscriptionUpserted(sub, supabase as any);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subId =
            typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription.id;
          await supabase
            .from('stripe_subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subId);
        }
        break;
      }
      default:
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error handling webhook event ${event.type}:`, message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
