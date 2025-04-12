import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { sendPurchaseConfirmation, sendSubscriptionCancelledEmail, sendPaymentFailedEmail } from '@/lib/email';
import { SupabaseClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Stripe with proper typing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Type guard to check for string type
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

async function updateUserCredits(supabase: SupabaseClient, userId: string, credits: number) {
  const { error } = await supabase.rpc('add_user_credits', { user_id: userId, credits_to_add: credits });
  if (error) console.error(`Error calling add_user_credits RPC for user ${userId}:`, error);
}

async function updateUserSubscription(supabase: SupabaseClient, userId: string, endDate: Date | null) {
  const { error } = await supabase.from('user_credits').update({
    has_unlimited: endDate !== null,
    unlimited_until: endDate ? endDate.toISOString() : null,
  }).eq('user_id', userId);
  if (error) console.error(`Error updating user_credits for user ${userId}:`, error);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature || !webhookSecret) {
    console.error('Missing stripe-signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing required webhook configuration' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.DiscriminatedEvent;

    console.log('Processing webhook event:', event.type);

    const supabase = createRouteHandlerClient({ cookies });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        if (!session.metadata?.userId) {
          throw new Error('No userId in session metadata');
        }

        if (session.metadata.type === 'credits') {
          const credits = parseInt(session.metadata.credits || '1');
          await supabase.rpc('add_credits', {
            p_user_id: session.metadata.userId,
            p_credits: credits
          });
          console.log(`Added ${credits} credits for user ${session.metadata.userId}`);
        } 
        else if (session.metadata.type === 'unlimited' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          await supabase.from('user_credits').upsert({
            user_id: session.metadata.userId,
            has_unlimited: true,
            unlimited_until: new Date(subscription.current_period_end * 1000).toISOString(),
            subscription_id: subscription.id
          });
          console.log(`Activated unlimited subscription for user ${session.metadata.userId}`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        if (!subscription.metadata?.userId) {
          throw new Error('No userId in subscription metadata');
        }

        await supabase.from('user_credits').upsert({
          user_id: subscription.metadata.userId,
          has_unlimited: true,
          unlimited_until: new Date(subscription.current_period_end * 1000).toISOString(),
          subscription_id: subscription.id
        });
        console.log(`Updated subscription for user ${subscription.metadata.userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        if (!subscription.metadata?.userId) {
          throw new Error('No userId in subscription metadata');
        }

        await supabase.rpc('remove_unlimited_access', {
          p_user_id: subscription.metadata.userId
        });
        console.log(`Removed unlimited access for user ${subscription.metadata.userId}`);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        if (typeof invoice.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          if (!subscription.metadata?.userId) {
            throw new Error('No userId in subscription metadata');
          }

          await supabase.from('user_credits').upsert({
            user_id: subscription.metadata.userId,
            has_unlimited: true,
            unlimited_until: new Date(subscription.current_period_end * 1000).toISOString(),
            subscription_id: subscription.id
          });
          console.log(`Updated subscription after payment for user ${subscription.metadata.userId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (typeof invoice.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          console.log(`Payment failed for subscription ${subscription.id}, user ${subscription.metadata?.userId}`);
          // Here you might want to add notification logic
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          // You might want to notify the user that their trial is ending
          console.log('Trial ending soon for subscription:', subscription.id, 'user:', userId);
        }
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 400 }
    );
  }
} 