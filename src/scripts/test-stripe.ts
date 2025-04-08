import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

async function testStripeSetup() {
  try {
    // 1. Test retrieving our products
    console.log('Testing product retrieval...');
    const creditProduct = await stripe.prices.retrieve(
      process.env.NEXT_PUBLIC_STRIPE_CREDIT_PRICE_ID!
    );
    const unlimitedProduct = await stripe.prices.retrieve(
      process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID!
    );
    
    console.log('Credit product price:', creditProduct.unit_amount! / 100, 'EUR');
    console.log('Unlimited product price:', unlimitedProduct.unit_amount! / 100, 'EUR');

    // 2. Test creating a payment intent
    console.log('\nTesting payment intent creation...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999,
      currency: 'eur',
      metadata: {
        userId: 'test-user',
        type: 'credits',
        credits: '1',
      },
    });
    console.log('Payment intent created:', paymentIntent.id);

    // 3. Test creating a customer
    console.log('\nTesting customer creation...');
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      metadata: {
        supabase_user_id: 'test-user',
      },
    });
    console.log('Customer created:', customer.id);

    // 4. Test creating a subscription
    console.log('\nTesting subscription creation...');
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID! }],
      payment_behavior: 'default_incomplete',
      metadata: {
        userId: 'test-user',
      },
      trial_period_days: 0,
    });
    console.log('Subscription created:', subscription.id);

    console.log('\nAll Stripe functionality tests passed!');
  } catch (error) {
    console.error('Error testing Stripe setup:', error);
  }
}

testStripeSetup(); 