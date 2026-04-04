import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = await request.json();

  // Get plan config from DB
  const { data: planConfig } = await supabase
    .from('jsc_plan_limits')
    .select('display_name, amount_cents, duration_months, active')
    .eq('plan', plan)
    .single();

  if (!planConfig || !planConfig.active || planConfig.amount_cents === 0) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const { data: jscUser } = await supabase
    .from('jsc_users').select('id').eq('auth_user_id', user.id).single();

  const stripe = getStripe();
  const origin = request.headers.get('origin') || 'https://jobsearch.quest';

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email!,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: planConfig.display_name },
        unit_amount: planConfig.amount_cents,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${origin}/app?checkout=success&plan=${plan}`,
    cancel_url: `${origin}/#pricing`,
    metadata: {
      plan,
      jsc_user_id: jscUser?.id || '',
      supabase_user_id: user.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
