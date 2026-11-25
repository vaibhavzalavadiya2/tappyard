'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://mxbzlkyljcpydixrsuoz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_nGpJRsOkzH3G0oxrvfurhQ_gd7nYpaX';

export function isSupabaseConfigured(): boolean {
  return true;
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
