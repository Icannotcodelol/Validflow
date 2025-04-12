import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { sendPurchaseConfirmation, sendSubscriptionCancelledEmail, sendPaymentFailedEmail } from '@/lib/email';
import { SupabaseClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.error('Webhook Error: Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    if (!webhookSecret) {
      console.error('Webhook Error: Missing STRIPE_WEBHOOK_SECRET env var');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err: any) { // Catch specific Stripe signature error if possible
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    const supabase = createClient();

    // Event Handling

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment status in our database
        await supabase.from('payments')
          .update({ status: 'succeeded' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        // If this was a credit purchase, add credits to user (using metadata)
        const userId = paymentIntent.metadata?.userId;
        const creditsStr = paymentIntent.metadata?.credits;
        if (paymentIntent.metadata?.type === 'credits' && isString(userId) && isString(creditsStr)) {
          const credits = parseInt(creditsStr);
          if (!isNaN(credits)) {
            await updateUserCredits(supabase, userId, credits);
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;

        // Type guard: make sure it's a string subscription ID
        if (!isString(invoice.subscription)) {
          console.warn(`Invoice ${invoice.id} missing valid subscription ID.`);
          break;
        }

        const subscriptionId = invoice.subscription;

        let subscription: any;
        try {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        } catch (err) {
          console.error(`Failed to retrieve subscription ${subscriptionId}:`, err);
          break;
        }

        // Handle payment_intent (string or expanded object ID)
        const paymentIntentId =
          isString(invoice.payment_intent)
            ? invoice.payment_intent
            : invoice.payment_intent?.id;

        if (paymentIntentId) {
          await supabase
            .from('payments')
            .update({ status: 'succeeded' })
            .eq('stripe_payment_intent_id', paymentIntentId);
        }

        const userId = subscription.metadata?.userId;
        const currentPeriodEnd = subscription.current_period_end;

        // Ensure userId is string and currentPeriodEnd is number before using
        if (isString(userId) && typeof currentPeriodEnd === 'number') {
          await updateUserSubscription(supabase, userId, new Date(currentPeriodEnd * 1000));
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;
        if (isString(userId)) {
          // Pass client instance to helper
          await updateUserSubscription(supabase, userId, null);
          // Optionally send cancellation email
          // const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          // if (customer.email) { await sendSubscriptionCancelledEmail({ customerEmail: customer.email }); }
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle credits purchase successful payment
        if (session.metadata?.type === 'credits' && session.payment_status === 'paid') {
          const creditsStr = session.metadata.credits;
          const userId = session.metadata.userId;
          const amountTotal = session.amount_total ?? 0; // Handle null case

          if (!isString(userId) || !isString(creditsStr)) {
            console.error('Checkout session completed for credits without valid userId/credits in metadata:', session.id);
            break;
          }

          const credits = parseInt(creditsStr);
          if (isNaN(credits)) {
             console.error('Checkout session completed for credits with invalid credits number in metadata:', session.id);
             break;
          }
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', userId)
            .single();

          if (userError) {
            console.error(`Error fetching user data for userId ${userId}:`, userError);
            break;
          }

          // Add credits via RPC function
          const { error: rpcError } = await supabase.rpc('add_credits', {
            p_user_id: userId,
            p_credits: credits
          });

          if (rpcError) {
            console.error(`Error calling add_credits RPC for userId ${userId}:`, rpcError);
            break;
          }

          // Send purchase confirmation email
          if (userData?.email) {
            try {
              await sendPurchaseConfirmation({
                customerName: userData.full_name || 'Valued Customer',
                customerEmail: userData.email,
                credits,
                amount: amountTotal,
                isSubscription: false
              });
            } catch(emailError) {
              console.error('Failed to send purchase confirmation email:', emailError);
            }
          } else {
             console.warn('Cannot send purchase confirmation email, user email not found for userId:', userId);
          }
        }
        // Handle subscription checkout successful payment (might be handled by invoice.paid/customer.subscription.created)
        else if (session.mode === 'subscription' && session.payment_status === 'paid') {
           console.log(`Checkout session ${session.id} completed for subscription.`);
           // Usually handled by invoice.paid or customer.subscription.created events
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;
        const currentPeriodEnd = subscription.current_period_end;

        if (isString(userId) && typeof currentPeriodEnd === 'number') {
          // Update Supabase user_credits table
          await updateUserSubscription(supabase, userId, new Date(currentPeriodEnd * 1000));

          // Send confirmation email ONLY on creation (or maybe first payment success via invoice.paid?)
          if (event.type === 'customer.subscription.created') {
             const { data: userData, error: userError } = await supabase
               .from('users')
               .select('email, full_name')
               .eq('id', userId)
               .single();

             if (!userError && userData?.email) {
                try {
                  await sendPurchaseConfirmation({
                    customerName: userData.full_name || 'Valued Customer',
                    customerEmail: userData.email,
                    subscriptionEnd: new Date(currentPeriodEnd * 1000).toISOString(),
                    isSubscription: true
                  });
                } catch (emailError) {
                  console.error('Failed to send subscription confirmation email:', emailError);
                }
             } else {
                console.error(`Error fetching user data for subscription confirmation email or email missing for userId ${userId}:`, userError);
             }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        console.warn('Payment failed for invoice:', invoice.id, '- Customer:', invoice.customer);
        
        // Check if subscription ID exists and is a string
        if (isString(invoice.subscription)) {
          const subscriptionId = invoice.subscription;
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
            const userId = subscription.metadata?.userId;

            if (isString(userId)) {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('email, full_name')
                .eq('id', userId)
                .single();

              if (!userError && userData?.email) {
                 await sendPaymentFailedEmail({
                   customerName: userData.full_name || 'Valued Customer',
                   customerEmail: userData.email
                 });
              } else {
                 console.error(`Error fetching user data for payment failed email or email missing for userId ${userId}:`, userError);
              }
            }
          } catch (subError) {
            console.error(`Failed to retrieve subscription ${subscriptionId} for payment failed event:`, subError);
          }
        } else {
           console.warn(`invoice.payment_failed event for invoice ${invoice.id} did not have a valid subscription ID.`);
        }
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) { // Catch any error type
    console.error('Error handling webhook:', error.message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 