import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No session ID provided' }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription'],
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    const supabase = createClient();

    // Handle different payment types
    if (session.metadata?.type === 'credits') {
      const credits = parseInt(session.metadata.credits || '0');
      const userId = session.metadata.userId;

      // Update user credits in Supabase
      const { error: updateError } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_credits: credits
      });

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return NextResponse.json({ success: false, error: 'Failed to update credits' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        type: 'credits',
        credits,
      });
    } 
    else if (session.metadata?.type === 'unlimited') {
      const userId = session.metadata.userId;
      const subscription = session.subscription as Stripe.Subscription;

      if (!subscription) {
        return NextResponse.json({ success: false, error: 'No subscription found' }, { status: 400 });
      }

      // Get subscription details and ensure we have the correct type
      const subscriptionData = await stripe.subscriptions.retrieve(subscription.id);

      // Update user subscription status in Supabase
      const { error: updateError } = await supabase.rpc('update_subscription', {
        p_user_id: userId,
        p_subscription_id: subscription.id,
        p_current_period_end: new Date((subscriptionData as any).current_period_end * 1000).toISOString()
      });

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return NextResponse.json({ success: false, error: 'Failed to update subscription' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        type: 'unlimited',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid payment type' }, { status: 400 });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 