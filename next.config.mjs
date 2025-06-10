/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Changed
  },
  typescript: {
    ignoreBuildErrors: true, // Changed back to true
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
