import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false

    config.resolve.alias.encoding = false

    return config
  },
  images: {
    // allow external images from placehold.co used for placeholders/logos
    domains: ['placehold.co']
  },
  async rewrites() {
    const apiUrl = process.env.API_URL ?? 'https://api.portal.bmuconnect.id'
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`
      }
    ]
  }
}

export default nextConfig
