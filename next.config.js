/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Never cache the places search — always go directly to the network.
      // This prevents the SW's 24-hour API cache from serving stale
      // empty responses that were stored before the Foursquare fix.
      urlPattern: /\/api\/places\/search/,
      handler: 'NetworkOnly',
    },
  ],
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);
