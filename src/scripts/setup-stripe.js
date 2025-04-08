const Stripe = require('stripe');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY in .env.local');
  process.exit(1);
}

console.log('Using secret key:', process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createProducts() {
  try {
    // Create Single Analysis Credit Product
    const singleAnalysisProduct = await stripe.products.create({
      name: 'Single Analysis Credit',
      description: 'One-time credit for a single business analysis',
    });

    const singleAnalysisPrice = await stripe.prices.create({
      product: singleAnalysisProduct.id,
      unit_amount: 999, // 9.99 EUR in cents
      currency: 'eur',
    });

    // Create Unlimited Monthly Subscription Product
    const unlimitedProduct = await stripe.products.create({
      name: 'Unlimited Monthly Analysis',
      description: 'Unlimited business analyses per month',
    });

    const unlimitedPrice = await stripe.prices.create({
      product: unlimitedProduct.id,
      unit_amount: 9999, // 99.99 EUR in cents
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
    });

    console.log('Products and prices created successfully!');
    console.log('Single Analysis Price ID:', singleAnalysisPrice.id);
    console.log('Unlimited Subscription Price ID:', unlimitedPrice.id);
    console.log('\nAdd these IDs to your .env.local file:');
    console.log(`NEXT_PUBLIC_STRIPE_CREDIT_PRICE_ID=${singleAnalysisPrice.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID=${unlimitedPrice.id}`);

  } catch (error) {
    console.error('Error creating products:', error);
  }
}

createProducts(); 