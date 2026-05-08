import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Check Deep Read weekly site-wide limit (max 5 per week)
export async function GET(_req: NextRequest) {
  try {
    const { createClient: createServiceClient } = await import('@supabase/supabase-js');
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.rpc('count_deep_read_this_week');
    if (error) throw error;

    const count = data as number;
    const limit = 5;
    const available = Math.max(0, limit - count);

    return NextResponse.json({ count, limit, available, soldOut: available === 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
