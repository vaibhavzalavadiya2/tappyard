import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/';
  // Prevent open redirects by allowing only local relative paths
  const safeNext =
    rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const separator = safeNext.includes('?') ? '&' : '?';
        return NextResponse.redirect(`${origin}${safeNext}${separator}auth=success`);
      }
    }
  }

  const separator = safeNext.includes('?') ? '&' : '?';
  return NextResponse.redirect(`${origin}${safeNext}${separator}auth=error`);
}
