import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // read-only in middleware
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the RPC function — it checks subscription status and increments usage atomically
    const { data, error } = await supabase.rpc('check_and_increment_portal_usage', {
      p_user_id: user.id,
      p_daily_limit: 1,
    });

    if (error) {
      console.error('Portal rate limit RPC error:', error);
      // On DB error, allow through (fail open) to avoid blocking legitimate users
      return NextResponse.json({ allowed: true, is_companion: false, sessions_today: 0 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Portal check-limit error:', err);
    // Fail open on unexpected errors
    return NextResponse.json({ allowed: true, is_companion: false, sessions_today: 0 });
  }
}
