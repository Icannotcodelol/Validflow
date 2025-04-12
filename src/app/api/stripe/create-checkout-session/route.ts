import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session: userSession } } = await supabase.auth.getSession();

    if (!userSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { priceId, type, userId, credits } = await req.json();

    // Verify that the userId matches the authenticated user
    if (userId !== userSession.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create Stripe customer
    let customerId: string;
    const { data: customers } = await stripe.customers.search({
      query: `metadata['supabase_user_id']:'${userSession.user.id}'`,
    });

    if (customers && customers.length > 0) {
      customerId = customers[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: userSession.user.email!,
        metadata: {
          supabase_user_id: userSession.user.id,
        },
      });
      customerId = customer.id;
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: type === 'unlimited' ? 'subscription' : 'payment',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        userId,
        type,
        ...(credits && { credits: credits.toString() }),
      },
      customer_email: userSession.user.email,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 