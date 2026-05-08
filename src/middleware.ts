import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware entirely for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({ request });
  }

  // Check if a Supabase session cookie exists before attempting auth refresh
  const projectRef = getProjectRef();
  const sessionCookieName = `sb-${projectRef}-auth-token`;
  const hasSession =
    request.cookies.has(sessionCookieName) ||
    request.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  // No session cookie — skip Supabase network call entirely
  if (!hasSession) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    await supabase.auth.getUser();
  } catch {
    // Network errors (fetch failed, timeout, etc.) should not crash the middleware
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
