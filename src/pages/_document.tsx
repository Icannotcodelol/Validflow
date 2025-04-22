import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L3N16KCJM7"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-L3N16KCJM7');
            `,
          }}
        />
      </Head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Main />
        <NextScript />
        <script
          defer={true}
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "1e06ab5e7e58404aaedda90e02d05deb"}'
        ></script>
      </body>
    </Html>
  )
} 