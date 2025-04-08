import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { sendPurchaseConfirmation, sendSubscriptionCancelledEmail, sendPaymentFailedEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function updateUserCredits(userId: string, credits: number) {
  const supabase = createClient();
  await supabase.rpc('add_user_credits', { user_id: userId, credits_to_add: credits });
}

async function updateUserSubscription(userId: string, endDate: Date) {
  const supabase = createClient();
  await supabase.from('user_credits').update({
    has_unlimited: true,
    unlimited_until: endDate.toISOString(),
  }).eq('user_id', userId);
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment status in our database
        await supabase.from('payments')
          .update({ status: 'succeeded' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        // If this was a credit purchase, add credits to user
        if (paymentIntent.metadata.type === 'credits') {
          await updateUserCredits(
            paymentIntent.metadata.userId,
            parseInt(paymentIntent.metadata.credits)
          );
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Update payment status
        if (invoice.payment_intent && typeof invoice.payment_intent === 'string') {
          await supabase.from('payments')
            .update({ status: 'succeeded' })
            .eq('stripe_payment_intent_id', invoice.payment_intent);
        }

        // Update user's subscription status
        const userId = subscription.metadata.userId;
        if (userId) {
          await updateUserSubscription(
            userId,
            new Date(subscription.current_period_end * 1000)
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;
        if (userId) {
          await supabase.from('user_credits').update({
            has_unlimited: false,
            unlimited_until: null,
          }).eq('user_id', userId);
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle credits purchase
        if (session.metadata?.type === 'credits' && session.payment_status === 'paid') {
          const credits = parseInt(session.metadata.credits || '0');
          const userId = session.metadata.userId;

          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', userId)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
          }

          const { error } = await supabase.rpc('add_credits', {
            p_user_id: userId,
            p_credits: credits
          });

          if (error) {
            console.error('Error adding credits:', error);
            return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
          }

          // Send purchase confirmation email
          await sendPurchaseConfirmation({
            customerName: userData.full_name || 'Valued Customer',
            customerEmail: userData.email,
            credits,
            amount: session.amount_total,
            isSubscription: false
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (userId) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', userId)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
          }

          const { error } = await supabase.rpc('update_subscription', {
            p_user_id: userId,
            p_subscription_id: subscription.id,
            p_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString()
          });

          if (error) {
            console.error('Error updating subscription:', error);
            return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
          }

          // Send subscription confirmation email for new subscriptions
          if (event.type === 'customer.subscription.created') {
            await sendPurchaseConfirmation({
              customerName: userData.full_name || 'Valued Customer',
              customerEmail: userData.email,
              subscriptionEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
              isSubscription: true
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.error('Payment failed for invoice:', invoice.id);
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const userId = subscription.metadata.userId;

          if (userId) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('email, full_name')
              .eq('id', userId)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
              return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
            }

            // Send payment failed email
            await sendPaymentFailedEmail({
              customerName: userData.full_name || 'Valued Customer',
              customerEmail: userData.email
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 