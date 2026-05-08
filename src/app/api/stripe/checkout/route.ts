import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createLightCheckoutSession,
  createProductCheckoutSession,
  createCompanionCheckoutSession,
} from '@/lib/stripe/stripeService';
import type { StarMagnitude } from '@/lib/stripe/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { product, magnitude, fragment, nodeId, amountCents } = body;

    let session;

    if (product === 'light') {
      if (!magnitude) {
        return NextResponse.json({ error: 'magnitude is required for light purchases' }, { status: 400 });
      }

      // Validate amount range
      const validMagnitudes: StarMagnitude[] = ['iskra', 'svetlost', 'svemir'];
      if (!validMagnitudes.includes(magnitude as StarMagnitude)) {
        return NextResponse.json({ error: 'Invalid magnitude' }, { status: 400 });
      }

      const minAmounts: Record<StarMagnitude, number> = {
        iskra: 100,
        svetlost: 1000,
        svemir: 5000,
      };

      const finalAmount = amountCents || minAmounts[magnitude as StarMagnitude];

      session = await createLightCheckoutSession({
        userId: user.id,
        userEmail: user.email!,
        magnitude: magnitude as StarMagnitude,
        fragment: fragment || '',
        nodeId: nodeId || 'rtanj',
        amountCents: finalAmount,
      });
    } else if (product === 'deep_insight' || product === 'deep_read') {
      // Check Deep Read weekly limit before creating session
      if (product === 'deep_read') {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (serviceRoleKey && serviceRoleKey !== 'your-supabase-service-role-key-here') {
          const { createClient: createServiceClient } = await import('@supabase/supabase-js');
          const serviceSupabase = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey
          );
          const { data: weeklyCount } = await serviceSupabase.rpc('count_deep_read_this_week');
          if ((weeklyCount as number) >= 5) {
            return NextResponse.json({ error: 'Deep Read is sold out for this week. Check back next Monday.' }, { status: 409 });
          }
        }
      }

      session = await createProductCheckoutSession({
        userId: user.id,
        userEmail: user.email!,
        product,
      });
    } else if (product === 'companion') {
      session = await createCompanionCheckoutSession({
        userId: user.id,
        userEmail: user.email!,
      });
    } else {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Checkout session creation failed:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
