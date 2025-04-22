import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/CookieConsent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ValidFlow - AI-Powered Product Validation",
  description: "Validate your product ideas with AI-powered analysis",
  openGraph: {
    title: "ValidFlow - AI-Powered Product Validation",
    description: "Validate your product ideas with AI-powered analysis",
    url: "https://validflow.io",
    siteName: "ValidFlow",
    images: [
      {
        url: "/og-image.png", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "ValidFlow - AI-Powered Product Validation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ValidFlow - AI-Powered Product Validation",
    description: "Validate your product ideas with AI-powered analysis",
    creator: "@validflow",  // Replace with your Twitter handle
    images: ["/og-image.png"], // Same image as OpenGraph
  },
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
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "94d32b230f474fac92a2d3eff990318e"}'
        />
        {/* End Cloudflare Web Analytics */}
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
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}
