import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
        <script
          defer={true}
          src="/cf/beacon.min.js"
          data-cf-beacon='{"token": "1e06ab5e7e58404aaedda90e02d05deb", "spa": false, "beacon": "/cf/beacon"}'
        ></script>
      </body>
    </Html>
  )
} 