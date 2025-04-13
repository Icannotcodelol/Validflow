/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'validflow.io'],
    },
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            // CSP configuration includes required domains for:
            // - Google Analytics (*.google-analytics.com, *.analytics.google.com)
            // - Google Tag Manager (*.googletagmanager.com)
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.stripe.com https://*.stripe.network https://vercel.live https://va.vercel-scripts.com https://*.google-analytics.com https://*.googletagmanager.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https://*.stripe.com https://validflow.io https://*.google-analytics.com https://*.googletagmanager.com;
              frame-src 'self' https://*.stripe.com https://*.stripe.network https://hooks.stripe.com https://vercel.live;
              connect-src 'self' https://*.stripe.com https://*.stripe.network https://api.stripe.com wss://*.stripe.com https://*.supabase.co https://validflow.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
              font-src 'self' data:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
}

// Log environment variables for debugging (redacted for security)
console.log('Environment Variables Check:', {
  hasPerplexityKey: !!process.env.PERPLEXITY_API_KEY,
  perplexityKeyPrefix: process.env.PERPLEXITY_API_KEY?.substring(0, 8),
  hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
  anthropicKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 8),
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8),
  hasMongoDBUri: !!process.env.MONGODB_URI,
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

module.exports = nextConfig 