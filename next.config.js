/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Configurazione corretta per Next.js 15
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // Ignora errori ESLint durante il build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignora errori TypeScript durante il build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Aggiorna configurazione per le immagini remote usando remotePatterns (raccomandato)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['mongodb'],
  webpack: (config) => {
    // Risolve il problema di moduli Node.js in MongoDb
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    
    // Gestisci i moduli Node.js che MongoDB tenta di usare
    config.resolve.fallback.child_process = false;
    config.resolve.fallback.fs = false;
    config.resolve.fallback.net = false;
    config.resolve.fallback.tls = false;
    config.resolve.fallback.dns = false;
    config.resolve.fallback['timers/promises'] = false;
    
    return config;
  },
}

module.exports = nextConfig 