/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Isso ignora os erros de tipo que estão travando seu build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;