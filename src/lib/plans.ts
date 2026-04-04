import { createServerClient } from '@supabase/ssr';

export interface PlanData {
  plan: string;
  display_name: string;
  description: string;
  amount_cents: number;
  duration_months: number;
  price_label: string;
  price_sublabel: string;
  cta_text: string;
  featured: boolean;
  sessions_per_month: number | null;
  max_council_members: number;
  real_people_voices: boolean;
  custom_members: boolean;
  premium_models: boolean;
}

/**
 * Fetch active plans directly from Supabase (no cookies needed).
 * Used at build time for static generation.
 */
export async function getPlans(): Promise<PlanData[]> {
  // Use service role key directly — no cookies needed for public data at build time
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { data } = await supabase
    .from('jsc_plan_limits')
    .select('plan, display_name, description, amount_cents, duration_months, price_label, price_sublabel, cta_text, featured, sessions_per_month, max_council_members, real_people_voices, custom_members, premium_models')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  return (data || []) as PlanData[];
}
