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

    // Create a payment intent for a single credit
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999, // 9.99 EUR in cents
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        type: 'credits',
        credits: '1',
      },
    });

    // Create a pending payment record in our database
    await supabase.from('payments').insert({
      user_id: session.user.id,
      stripe_payment_intent_id: paymentIntent.id,
      amount: 999,
      type: 'credits',
      credits_amount: 1,
      status: 'pending',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 