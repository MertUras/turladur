import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ESLint: still ignored during build (Faz 2 / ~146 errors). Typecheck is enforced.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      // Sprint 23.19 — Cloudflare CDN / R2 custom domain
      { protocol: 'https', hostname: 'media.turta.com' },
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      // Dev media proxy (Nest → R2) when r2.dev TLS is broken / no custom domain
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/api/v1/storage/media/**',
      },
      // Soft launch hosts (API media proxy as CDN)
      {
        protocol: 'https',
        hostname: '**.railway.app',
        pathname: '/api/v1/storage/media/**',
      },
      {
        protocol: 'https',
        hostname: '**.up.railway.app',
        pathname: '/api/v1/storage/media/**',
      },
      {
        protocol: 'https',
        hostname: '**.fly.dev',
        pathname: '/api/v1/storage/media/**',
      },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
