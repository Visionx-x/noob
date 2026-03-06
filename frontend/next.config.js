/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['localhost', 'your-production-api.com'],
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : undefined,
  // NEXT_PUBLIC_API_URL: set in .env.local (dev: http://YOUR_PC_IP:8000/api, prod: https://api.yourdomain.com/api)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://10.39.44.173:8000/api'
  },
  eslint: { ignoreDuringBuilds: true },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig
