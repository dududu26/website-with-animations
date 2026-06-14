/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler for better performance
  experimental: {
    reactCompiler: true,
  },
  
  // Optimize images
  images: {
    unoptimized: true, // For Termux/self-hosted
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Performance optimization
  swcMinify: true,
  compress: true,
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    config.optimization.minimize = true
    return config
  },
}

module.exports = nextConfig
