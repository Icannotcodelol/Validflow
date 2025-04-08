import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Payment Cancelled</h1>
          <p className="mb-6 text-red-700">
            Your payment was cancelled. No charges have been made.
          </p>
          <Link
            href="/test-payment"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 