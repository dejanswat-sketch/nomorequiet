import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nickname, appearance_year, shadow_mode, assigned_node')
      .eq('id', user.id)
      .single();

    // Get subscription info
    const { data: subscription } = await supabase
      .from('stripe_subscriptions')
      .select('status, stripe_price_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    // Get light tier (most recent purchase)
    const { data: purchase } = await supabase
      .from('purchases')
      .select('product')
      .eq('user_id', user.id)
      .eq('product', 'light')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get light magnitude
    const { data: light } = await supabase
      .from('lights')
      .select('star_magnitude')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      profile,
      subscription,
      lightMagnitude: light?.star_magnitude || null,
      hasCompanion: !!subscription,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { appearanceYear, shadowMode } = body;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (appearanceYear !== undefined) {
      if (appearanceYear !== null) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - appearanceYear;
        if (age < 18 || appearanceYear < 1900 || appearanceYear > currentYear) {
          return NextResponse.json({ error: 'Invalid appearance year. Must be 18+ years old.' }, { status: 400 });
        }
      }
      updates.appearance_year = appearanceYear;
    }

    if (shadowMode !== undefined) {
      updates.shadow_mode = shadowMode;
      // Also update all user's lights anonymity
      await supabase
        .from('lights')
        .update({ is_anonymous: shadowMode })
        .eq('user_id', user.id);
    }

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
