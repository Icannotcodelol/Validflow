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

    const latestInvoice = subscription.latest_invoice;

    // Type guard: check that latestInvoice is an object and has a payment_intent, 
    // and that payment_intent is also an object (not a string ID)
    if (
      !latestInvoice ||
      typeof latestInvoice === 'string' ||
      !('payment_intent' in latestInvoice) || // Check if key exists
      !latestInvoice.payment_intent || // Check if value exists
      typeof latestInvoice.payment_intent === 'string' // Check if value is not the expanded object
    ) {
      console.error('Error: Payment Intent not found or not expanded on the latest invoice.', {
        subscriptionId: subscription.id,
        latestInvoiceStatus: typeof latestInvoice === 'object' && latestInvoice !== null ? latestInvoice.status : 'N/A', // Safe status access
      });
      throw new Error('Subscription created, but initial payment details are missing. Please contact support.');
    }
    
    // Now TypeScript knows payment_intent is the expanded object within the Invoice
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    // Ensure client_secret exists on the PaymentIntent
    if (!paymentIntent.client_secret) {
      console.error('Error: Payment Intent client_secret is missing.', {
        paymentIntentId: paymentIntent.id,
        paymentIntentStatus: paymentIntent.status
      });
      throw new Error('Subscription created, but payment setup failed. Please contact support.');
    }

    // Create a pending payment record in our database
    await supabase.from('payments').insert({
      user_id: session.user.id,
      stripe_payment_intent_id: paymentIntent.id, 
      stripe_customer_id: customerId,
      amount: 9999, // TODO: Consider getting amount dynamically
      type: 'unlimited', // TODO: Consider getting type dynamically
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