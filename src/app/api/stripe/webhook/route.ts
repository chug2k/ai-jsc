import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getExpiryDate } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    console.error('Webhook sig failed:', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const plan = session.metadata?.plan;
    const jscUserId = session.metadata?.jsc_user_id;

    if (!plan || !jscUserId) {
      console.error('Missing metadata:', session.id);
      return NextResponse.json({ received: true });
    }

    const supabase = await createAdminClient();

    // Get plan config from DB
    const { data: planConfig } = await supabase
      .from('jsc_plan_limits')
      .select('display_name, duration_months')
      .eq('plan', plan)
      .single();

    if (!planConfig) {
      console.error('Unknown plan:', plan);
      return NextResponse.json({ received: true });
    }

    // Expire old subscriptions
    await supabase
      .from('jsc_subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', jscUserId)
      .eq('status', 'active');

    // Create new subscription
    await supabase.from('jsc_subscriptions').insert({
      user_id: jscUserId,
      plan,
      status: 'active',
      expires_at: getExpiryDate(planConfig.duration_months),
      stripe_customer_id: session.customer as string || null,
      stripe_subscription_id: session.id,
    });

    // Update user's plan
    await supabase.from('jsc_users').update({ plan }).eq('id', jscUserId);

    // Record payment
    await supabase.from('jsc_payments').insert({
      user_id: jscUserId,
      amount_cents: session.amount_total || 0,
      currency: 'usd',
      type: 'charge',
      stripe_payment_id: session.payment_intent as string || session.id,
      description: planConfig.display_name,
    });

    console.log(`Activated ${plan} for user ${jscUserId}`);
  }

  return NextResponse.json({ received: true });
}
