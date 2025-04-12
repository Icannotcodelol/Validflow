import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  console.log('--- create-checkout-session API route START ---');
  try {
    const { priceId, type, userId, credits } = await req.json();
    console.log('Received data:', { priceId, type, userId, credits });

    if (!userId) {
      console.error('User ID is missing in the request body.');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    if (!priceId) {
      console.error('Price ID is missing in the request body.');
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to create Stripe session for user: ${userId}, price: ${priceId}`);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: type === 'unlimited' ? 'subscription' : 'payment',
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
      customer_email: undefined, // Will be set if user is logged in
    });

    console.log(`Successfully created Stripe session: ${session.id}`);
    console.log('--- create-checkout-session API route SUCCESS ---');
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) { // Explicitly type err as any to access properties
    console.error('--- create-checkout-session API route ERROR ---');
    console.error('Detailed Error:', err);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    // Log specific Stripe error properties if available
    if (err.type) console.error('Stripe Error Type:', err.type);
    if (err.code) console.error('Stripe Error Code:', err.code);
    if (err.param) console.error('Stripe Error Param:', err.param);

    return NextResponse.json(
      { error: 'Error creating checkout session', details: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 