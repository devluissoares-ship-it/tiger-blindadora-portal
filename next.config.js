/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isso desativa a checagem de tipos durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Isso desativa a checagem de erros de código (linting) durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;