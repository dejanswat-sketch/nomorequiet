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
      .from('deep_read_queue')
      .select(`
        id,
        user_id,
        status,
        journal_entries,
        created_at,
        admin_notified_at,
        processed_at,
        user_profiles!inner(email, nickname, assigned_node)
      `)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Weekly count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { count: weeklyCount } = await supabase
      .from('deep_read_queue')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString());

    return NextResponse.json({ queue: data ?? [], weeklyCount: weeklyCount ?? 0 });
  } catch (err) {
    console.error('Deep read queue error:', err);
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

    const { id, status } = await req.json();
    const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'delivered') {
      updateData.processed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('deep_read_queue')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Deep read PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
