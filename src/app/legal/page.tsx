import Link from "next/link"

export default function LegalPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Legal Information</h1>
      <p>Welcome to ValidFlow's legal center. Here you can find all our policies and legal documents:</p>
      
      <div className="grid gap-6 mt-8">
        <Link href="/legal/privacy-policy" className="block p-6 border rounded-lg hover:bg-gray-50 no-underline">
          <h2 className="text-xl font-semibold mb-2">Privacy Policy</h2>
          <p className="text-gray-600 m-0">Learn how we collect, use, and protect your personal data</p>
        </Link>

        <Link href="/legal/terms-of-service" className="block p-6 border rounded-lg hover:bg-gray-50 no-underline">
          <h2 className="text-xl font-semibold mb-2">Terms of Service</h2>
          <p className="text-gray-600 m-0">Understand the rules and conditions for using ValidFlow</p>
        </Link>

        <Link href="/legal/cookie-policy" className="block p-6 border rounded-lg hover:bg-gray-50 no-underline">
          <h2 className="text-xl font-semibold mb-2">Cookie Policy</h2>
          <p className="text-gray-600 m-0">Information about how we use cookies and similar technologies</p>
        </Link>

        <Link href="/legal/refund-policy" className="block p-6 border rounded-lg hover:bg-gray-50 no-underline">
          <h2 className="text-xl font-semibold mb-2">Refund Policy</h2>
          <p className="text-gray-600 m-0">Details about our refund and cancellation processes</p>
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-500">Last updated: April 15, 2025</p>
    </div>
  )
} 