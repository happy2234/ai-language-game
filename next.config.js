/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        // Add any other necessary fallbacks
      };
    }
    return config;
  },
  // Remove the experimental.esmExternals completely
  // Next.js now handles ESM packages better by default
};

module.exports = nextConfig;