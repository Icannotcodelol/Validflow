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

    // Get or create Stripe customer
    let customerId: string;
    const { data: customers } = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${session.user.id}'`,
    });

    if (customers && customers.length > 0) {
      customerId = customers[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          supabase_user_id: session.user.id,
        },
      });
      customerId = customer.id;
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID!,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },
      metadata: {
        userId: session.user.id,
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    // Create a pending payment record in our database
    await supabase.from('payments').insert({
      user_id: session.user.id,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: customerId,
      amount: 9999,
      type: 'unlimited',
      status: 'pending',
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 