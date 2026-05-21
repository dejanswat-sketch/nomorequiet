import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('lights')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ total: 0, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { total: count ?? 0 },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ total: 0, error: message }, { status: 500 });
  }
}
