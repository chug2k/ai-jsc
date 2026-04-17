/**
 * Supabase I/O for the marketing agent. Uses the service role client so this
 * works from a cron route without a user session.
 */

import { createClient } from '@supabase/supabase-js';
import type { RoutineName } from './routines';

export interface MarketingOutput {
  id: string;
  routine: RoutineName;
  content: string;
  meta: Record<string, unknown>;
  created_at: string;
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function loadRecentOutputs(limit = 14): Promise<MarketingOutput[]> {
  const db = adminClient();
  const { data, error } = await db
    .from('jsc_marketing_outputs')
    .select('id, routine, content, meta, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(`loadRecentOutputs: ${error.message}`);
  return (data || []) as MarketingOutput[];
}

export async function saveOutput(
  routine: RoutineName,
  content: string,
  meta: Record<string, unknown>,
): Promise<MarketingOutput> {
  const db = adminClient();
  const { data, error } = await db
    .from('jsc_marketing_outputs')
    .insert({ routine, content, meta })
    .select('id, routine, content, meta, created_at')
    .single();
  if (error) throw new Error(`saveOutput: ${error.message}`);
  return data as MarketingOutput;
}
