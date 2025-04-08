'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setMessage('No session ID found');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.type === 'credits' 
            ? `Successfully added ${data.credits} credits to your account!`
            : 'Successfully activated your unlimited subscription!');
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className={`rounded-lg border p-6 ${
          status === 'success' ? 'border-green-200 bg-green-50' :
          status === 'error' ? 'border-red-200 bg-red-50' :
          'border-gray-200 bg-gray-50'
        }`}>
          <h1 className={`mb-4 text-2xl font-bold ${
            status === 'success' ? 'text-green-800' :
            status === 'error' ? 'text-red-800' :
            'text-gray-800'
          }`}>
            {status === 'loading' ? 'Verifying Payment...' :
             status === 'success' ? 'Payment Successful!' :
             'Payment Error'}
          </h1>
          
          <p className={`mb-6 ${
            status === 'success' ? 'text-green-700' :
            status === 'error' ? 'text-red-700' :
            'text-gray-700'
          }`}>
            {message || 'Verifying your payment...'}
          </p>

          <Link
            href="/dashboard"
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              status === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
              status === 'error' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
              'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
            }`}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 