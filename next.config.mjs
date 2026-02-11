/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minotar.net',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  }
}

export default nextConfig
