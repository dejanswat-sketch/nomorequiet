import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, user_id, node, detected_language, created_at, crisis_flag')
      .eq('crisis_flag', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Group by user_id to get trigger counts
    const userMap: Record<string, { count: number; latest: string; node: string; language: string }> = {};
    for (const entry of data ?? []) {
      if (!userMap[entry.user_id]) {
        userMap[entry.user_id] = {
          count: 0,
          latest: entry.created_at,
          node: entry.node,
          language: entry.detected_language || 'Unknown',
        };
      }
      userMap[entry.user_id].count += 1;
    }

    const flags = Object.entries(userMap).map(([userId, info], idx) => ({
      id: `crisis-${userId.slice(0, 8)}`,
      userId,
      lightId: `User ${userId.slice(0, 6).toUpperCase()}`,
      node: info.node,
      language: info.language,
      flaggedAt: info.latest,
      triggerCount: info.count,
      status: 'unreviewed' as const,
    }));

    return NextResponse.json({ flags });
  } catch (err) {
    console.error('Crisis flags error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    // For now, just acknowledge — crisis flags are on journal_entries, no separate reviewed column
    return NextResponse.json({ success: true, id: body.id });
  } catch (err) {
    console.error('Crisis PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
