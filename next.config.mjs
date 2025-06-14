/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages configuration
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Webpack configuration for edge compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'better-auth': 'commonjs better-auth',
        '@prisma/client': 'commonjs @prisma/client',
      });
    }
    return config;
  },
}

export default nextConfig
