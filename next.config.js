/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Garante que o jspdf não tente rodar no servidor (o que causa o erro de importação)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'jspdf': 'jspdf/dist/jspdf.es.min.js',
      };
    }
    return config;
  },
};

module.exports = nextConfig;