import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Use service role client for admin operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Delete in dependency order (children first)
    await adminClient.from('portal_rounds').delete().eq('user_id', userId);
    await adminClient.from('portal_sessions').delete().eq('user_id', userId);
    await adminClient.from('journal_entries').delete().eq('user_id', userId);
    await adminClient.from('purchases').delete().eq('user_id', userId);
    await adminClient.from('lights').delete().eq('user_id', userId);
    await adminClient.from('stripe_subscriptions').delete().eq('user_id', userId);
    await adminClient.from('stripe_customers').delete().eq('user_id', userId);
    await adminClient.from('user_profiles').delete().eq('id', userId);

    // Delete auth user (cascades remaining)
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('Auth user deletion failed:', deleteAuthError.message);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Account deletion failed:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
