import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's active subscription
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (creditsError) {
      console.error('Error fetching user credits:', creditsError);
      return NextResponse.json(
        { error: 'Failed to fetch user subscription status' },
        { status: 500 }
      );
    }

    if (!userCredits.has_unlimited) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Find the customer in Stripe
    const { data: customers } = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${session.user.id}'`,
    });

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      );
    }

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customers[0].id,
      status: 'active',
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found in Stripe' },
        { status: 404 }
      );
    }

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    });

    // Send cancellation email
    const { data: userData } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', session.user.id)
      .single();

    if (userData?.email) {
      const { sendSubscriptionCancelledEmail } = await import('@/lib/email');
      await sendSubscriptionCancelledEmail({
        customerName: userData.full_name || 'Valued Customer',
        customerEmail: userData.email,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
      cancelAt: subscription.cancel_at,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 