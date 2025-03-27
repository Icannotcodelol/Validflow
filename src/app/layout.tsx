import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/providers/SessionProvider"
import "@/lib/server-config"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ValiNow - Validate Your Business Ideas",
  description: "Get comprehensive analysis and validation for your business ideas",
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
        <SessionProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
