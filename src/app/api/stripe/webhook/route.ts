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

// Helper function to safely get timestamp from Stripe Unix timestamps
const getDateFromUnixTimestamp = (timestamp: number) => new Date(timestamp * 1000).toISOString();

// Type guard for Stripe Subscription
function isSubscription(obj: any): obj is Stripe.Subscription {
  return obj && typeof obj === 'object' && 'current_period_end' in obj;
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
    ) as Stripe.Event;

    console.log('Processing webhook event:', event.type);

    const supabase = createRouteHandlerClient({ cookies });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
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
          const subscriptionData = await stripe.subscriptions.retrieve(session.subscription as string);
          if (isSubscription(subscriptionData)) {
            await supabase.from('user_credits').upsert({
              user_id: session.metadata.userId,
              has_unlimited: true,
              unlimited_until: getDateFromUnixTimestamp(subscriptionData.current_period_end),
              subscription_id: subscriptionData.id
            });
            console.log(`Activated unlimited subscription for user ${session.metadata.userId}`);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        if (isSubscription(subscription) && subscription.metadata?.userId) {
          await supabase.from('user_credits').upsert({
            user_id: subscription.metadata.userId,
            has_unlimited: true,
            unlimited_until: getDateFromUnixTimestamp(subscription.current_period_end),
            subscription_id: subscription.id
          });
          console.log(`Updated subscription for user ${subscription.metadata.userId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        if (isSubscription(subscription) && subscription.metadata?.userId) {
          await supabase.rpc('remove_unlimited_access', {
            p_user_id: subscription.metadata.userId
          });
          console.log(`Removed unlimited access for user ${subscription.metadata.userId}`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : invoice.subscription.id;
            
          const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
          if (isSubscription(subscriptionData) && subscriptionData.metadata?.userId) {
            await supabase.from('user_credits').upsert({
              user_id: subscriptionData.metadata.userId,
              has_unlimited: true,
              unlimited_until: getDateFromUnixTimestamp(subscriptionData.current_period_end),
              subscription_id: subscriptionData.id
            });
            console.log(`Updated subscription after payment for user ${subscriptionData.metadata.userId}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : invoice.subscription.id;
            
          const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
          if (isSubscription(subscriptionData)) {
            console.log(`Payment failed for subscription ${subscriptionData.id}, user ${subscriptionData.metadata?.userId}`);
          }
        }
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        if (isSubscription(subscription) && subscription.metadata?.userId) {
          console.log('Trial ending soon for subscription:', subscription.id, 'user:', subscription.metadata.userId);
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