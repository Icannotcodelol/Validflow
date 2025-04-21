'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/providers/SessionProvider';
import { StripeCheckout } from '@/components/StripeCheckout';
import type { User } from '@supabase/supabase-js';

export default function PricingPage() {
  const router = useRouter();
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="min-h-screen bg-white pt-36 pb-12">
      <div className="container mx-auto px-4">
        <div className="absolute top-8 left-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600">
              Get instant access to AI-powered business idea validation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Credits Package */}
            <div className="rounded-lg border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-4">Pay As You Go</h2>
              <p className="text-gray-600 mb-4">Perfect for testing a few ideas</p>
              <div className="text-4xl font-bold mb-6">€3.99<span className="text-lg text-gray-500 font-normal">/credit</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  1 comprehensive analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Detailed PDF report
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  No commitment
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => router.push('/signin')}
              >
                Get Started
              </Button>
            </div>

            {/* Unlimited Package */}
            <div className="rounded-lg border border-blue-200 shadow-sm p-8 bg-blue-50">
              <div className="absolute top-4 right-4">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Best Value</span>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Unlimited Access</h2>
              <p className="text-gray-600 mb-4">For serious entrepreneurs</p>
              <div className="text-4xl font-bold mb-6">€14.99<span className="text-lg text-gray-500 font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Unlimited analyses
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Priority processing
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Cancel anytime
                </li>
              </ul>
              <Button 
                className="w-full"
                onClick={() => router.push('/signin')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 