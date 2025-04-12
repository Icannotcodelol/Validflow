import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from "@/components/providers/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ValidFlow - AI-Powered Product Validation",
  description: "Validate your product ideas with AI-powered analysis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
