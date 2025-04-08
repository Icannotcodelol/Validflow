'use client';

import { StripeCheckout } from '@/components/StripeCheckout';
import { useEffect } from 'react';

export default function TestPaymentPage() {
  useEffect(() => {
    console.log('Test Payment Page Mounted');
    console.log('Environment Variables:', {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10) + '...',
      creditPriceId: process.env.NEXT_PUBLIC_STRIPE_CREDIT_PRICE_ID,
      unlimitedPriceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-lg border p-6">
          <h1 className="mb-4 text-2xl font-bold">Test Stripe Payments</h1>
          
          <div className="space-y-6">
            <div className="rounded-md bg-muted p-4">
              <h2 className="mb-2 text-lg font-semibold">Buy Credits</h2>
              <p className="mb-4 text-sm text-muted-foreground">100 credits for €9.99</p>
              <StripeCheckout
                priceId={process.env.NEXT_PUBLIC_STRIPE_CREDIT_PRICE_ID!}
                type="credits"
                userId="test-user-123"
                credits={100}
              />
            </div>

            <div className="rounded-md bg-muted p-4">
              <h2 className="mb-2 text-lg font-semibold">Unlimited Subscription</h2>
              <p className="mb-4 text-sm text-muted-foreground">€99.99/month for unlimited access</p>
              <StripeCheckout
                priceId={process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID!}
                type="unlimited"
                userId="test-user-123"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 