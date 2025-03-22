/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['d2rjs92glrj91n.cloudfront.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2rjs92glrj91n.cloudfront.net',
        pathname: '/course/**',
      },
    ],
  },
}

module.exports = nextConfig 