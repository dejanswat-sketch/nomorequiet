import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekStartISO = weekStart.toISOString();

    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekStartISO = lastWeekStart.toISOString();

    // Run all queries in parallel
    const [
      entriesThisWeek,
      entriesLastWeek,
      newUsersThisWeek,
      newUsersLastWeek,
      lightsTotal,
      lightsThisWeek,
      deepReadQueue,
      crisisThisWeek,
      crisisUnreviewed,
      portalCompletionsThisWeek,
      revenueThisWeek,
      activeCompanions,
      avgDepthThisWeek,
      avgDepthLastWeek,
    ] = await Promise.all([
      // Entries this week
      supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStartISO),

      // Entries last week
      supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', lastWeekStartISO)
        .lt('created_at', weekStartISO),

      // New users this week
      supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStartISO),

      // New users last week
      supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', lastWeekStartISO)
        .lt('created_at', weekStartISO),

      // Total lights
      supabase
        .from('lights')
        .select('id', { count: 'exact', head: true }),

      // Lights this week
      supabase
        .from('lights')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStartISO),

      // Deep read queue (pending + in_progress)
      supabase
        .from('deep_read_queue')
        .select('id, status, created_at, user_id, journal_entries')
        .in('status', ['pending', 'in_progress'])
        .order('created_at', { ascending: true }),

      // Crisis flags this week
      supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('crisis_flag', true)
        .gte('created_at', weekStartISO),

      // Unreviewed crisis flags (all time, no reviewed_at column — use crisis_flag=true)
      supabase
        .from('journal_entries')
        .select('id, user_id, node, detected_language, created_at')
        .eq('crisis_flag', true)
        .order('created_at', { ascending: false })
        .limit(20),

      // Portal completions this week
      supabase
        .from('portal_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('created_at', weekStartISO),

      // Revenue this week (purchases)
      supabase
        .from('purchases')
        .select('product, amount_cents')
        .eq('stripe_status', 'completed')
        .gte('created_at', weekStartISO),

      // Active Companion subscribers
      supabase
        .from('stripe_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),

      // Avg depth score this week
      supabase
        .from('journal_entries')
        .select('depth_score')
        .gte('created_at', weekStartISO)
        .not('depth_score', 'is', null),

      // Avg depth score last week
      supabase
        .from('journal_entries')
        .select('depth_score')
        .gte('created_at', lastWeekStartISO)
        .lt('created_at', weekStartISO)
        .not('depth_score', 'is', null),
    ]);

    // Revenue breakdown by product
    const revenueByProduct: Record<string, number> = {};
    let totalRevenueCents = 0;
    if (revenueThisWeek.data) {
      for (const p of revenueThisWeek.data) {
        revenueByProduct[p.product] = (revenueByProduct[p.product] || 0) + p.amount_cents;
        totalRevenueCents += p.amount_cents;
      }
    }

    // Avg depth scores
    const calcAvg = (rows: { depth_score: number }[] | null) => {
      if (!rows || rows.length === 0) return 0;
      const sum = rows.reduce((acc, r) => acc + (r.depth_score || 0), 0);
      return Math.round((sum / rows.length) * 10) / 10;
    };
    const avgDepthNow = calcAvg(avgDepthThisWeek.data as { depth_score: number }[] | null);
    const avgDepthPrev = calcAvg(avgDepthLastWeek.data as { depth_score: number }[] | null);

    // Oldest deep read queue item
    const oldestDeepRead = deepReadQueue.data?.[0];
    let oldestHoursAgo = 0;
    if (oldestDeepRead) {
      oldestHoursAgo = Math.round(
        (Date.now() - new Date(oldestDeepRead.created_at).getTime()) / 3600000
      );
    }

    // Recent activity: combine journal entries, purchases, portal sessions, crisis flags
    const [recentEntries, recentPurchases, recentPortal] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('id, user_id, node, depth_score, emotion_tags, crisis_flag, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('purchases')
        .select('id, user_id, product, amount_cents, created_at')
        .eq('stripe_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('portal_sessions')
        .select('id, user_id, node, status, created_at, completed_at')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5),
    ]);

    // Merge and sort recent activity
    type ActivityItem = {
      id: string;
      type: string;
      userId: string;
      time: string;
      detail: string;
      color: string;
    };
    const activities: ActivityItem[] = [];

    recentEntries.data?.forEach((e) => {
      activities.push({
        id: `entry-${e.id}`,
        type: e.crisis_flag ? 'crisis' : 'entry',
        userId: e.user_id,
        time: e.created_at,
        detail: e.crisis_flag
          ? `Crisis flag raised · ${e.node}`
          : `Depth ${e.depth_score} · ${e.node}${e.emotion_tags?.length ? ' · ' + e.emotion_tags[0] : ''}`,
        color: e.crisis_flag ? '#ff6b2b' : '#c8822a',
      });
    });

    recentPurchases.data?.forEach((p) => {
      const amountEur = (p.amount_cents / 100).toFixed(2).replace('.00', '');
      activities.push({
        id: `purchase-${p.id}`,
        type: p.product === 'deep_read' ? 'deepread' : 'purchase',
        userId: p.user_id,
        time: p.created_at,
        detail: `${p.product.replace('_', ' ')} purchased · ${amountEur} €`,
        color: '#D4AF37',
      });
    });

    recentPortal.data?.forEach((s) => {
      activities.push({
        id: `portal-${s.id}`,
        type: 'portal',
        userId: s.user_id,
        time: s.completed_at || s.created_at,
        detail: `Portal completed · ${s.node} · Builder light granted`,
        color: '#D4AF37',
      });
    });

    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const recentActivity = activities.slice(0, 10);

    return NextResponse.json({
      kpis: {
        entriesThisWeek: entriesThisWeek.count ?? 0,
        entriesLastWeek: entriesLastWeek.count ?? 0,
        newUsersThisWeek: newUsersThisWeek.count ?? 0,
        newUsersLastWeek: newUsersLastWeek.count ?? 0,
        lightsTotal: lightsTotal.count ?? 0,
        lightsThisWeek: lightsThisWeek.count ?? 0,
        deepReadQueueCount: deepReadQueue.data?.length ?? 0,
        oldestDeepReadHoursAgo: oldestHoursAgo,
        crisisThisWeek: crisisThisWeek.count ?? 0,
        crisisFlags: crisisUnreviewed.data ?? [],
        portalCompletionsThisWeek: portalCompletionsThisWeek.count ?? 0,
        totalRevenueCents,
        revenueByProduct,
        activeCompanions: activeCompanions.count ?? 0,
        avgDepthScore: avgDepthNow,
        avgDepthScorePrev: avgDepthPrev,
      },
      deepReadQueue: deepReadQueue.data ?? [],
      recentActivity,
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
