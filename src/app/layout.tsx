import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SupabaseProvider from "@/components/providers/SessionProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ValiNow - Validate Your Business Ideas",
  description: "AI-powered business idea validation platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <SupabaseProvider>
          <div className="min-h-screen bg-background">
            {children}
            <Toaster />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}
