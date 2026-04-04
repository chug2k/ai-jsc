import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('jsc_plan_limits')
    .select('plan, display_name, description, amount_cents, duration_months, price_label, price_sublabel, cta_text, featured, sessions_per_month, max_council_members, real_people_voices, custom_members, premium_models')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  return NextResponse.json(data || []);
}
