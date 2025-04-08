'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe outside of the component to avoid recreating the instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  priceId: string;
  type: 'credits' | 'unlimited';
  userId: string;
  credits?: number;
}

export const StripeCheckout = ({ priceId, type, userId, credits }: StripeCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Log Stripe initialization
    console.log('Initializing Stripe with key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.slice(0, 8) + '...');
  }, []);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      console.log('Starting checkout process...');
      console.log('Price ID:', priceId);
      
      const stripe = await stripePromise;
      console.log('Stripe loaded:', !!stripe);
      
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create a Checkout Session
      console.log('Creating checkout session...');
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          type,
          userId,
          credits,
        }),
      });

      const data = await response.json();
      console.log('Checkout session created:', data);

      if (!data.sessionId) {
        throw new Error('No session ID returned');
      }

      const { sessionId } = data;
      
      // Redirect to Checkout
      console.log('Redirecting to checkout...');
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error in checkout process:', err);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      aria-label="Proceed to checkout"
    >
      {isLoading ? 'Loading...' : 'Purchase'}
    </button>
  );
}; 