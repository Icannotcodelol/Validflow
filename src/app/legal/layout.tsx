import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="absolute top-8 left-8">
          <Button
            variant="ghost"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
        <div className="max-w-4xl mx-auto mt-16">
          {children}
        </div>
      </div>
    </div>
  )
} 