import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsent } from "@/components/CookieConsent"
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/analytics'

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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {GA_TRACKING_ID && (
          <>
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    transport_url: '/g/collect',
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
            <Script
              src={`/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
          </>
        )}
        <script
          defer
          data-website-id="68091cfa9b8fae4048125120"
          data-domain="validflow.io"
          src="/js/script.js"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}
