import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify caller is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: callerProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!callerProfile || callerProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, action } = await req.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
    }

    if (action === 'grant') {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          user_tier: 'companion',
          companion_assigned_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Companion tier granted.' });
    }

    if (action === 'revoke') {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          user_tier: 'free',
          companion_assigned_at: null,
        })
        .eq('id', userId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Companion tier revoked.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 });
  }
}
