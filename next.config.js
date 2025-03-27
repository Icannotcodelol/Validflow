/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  env: {
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'mongodb-client-encryption': false,
        aws4: false,
        timers: require.resolve('timers-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        'timers/promises': false,
        crypto: require.resolve('crypto-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        events: require.resolve('events/'),
        process: require.resolve('process/browser')
      };

      // Add buffer to webpack 5 polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser'
        })
      );

      // Exclude mongodb from client bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        'mongodb-client-encryption': false,
        'mongodb': false
      };
    }

    return config;
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
  hasMongoDBUri: !!process.env.MONGODB_URI
});

module.exports = nextConfig 