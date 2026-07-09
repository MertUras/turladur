/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Üst dizindeki (/Users/merturas) package-lock.json yanlış workspace root seçimini önler
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      // picsum.photos görselleri CDN üzerinden fastly.picsum.photos'a yönlendirilir;
      // Next.js Image optimizer'ın bu redirect hedefini de whitelist'te tutması gerekir.
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        pathname: '/**',
      },
    ],
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'example.com',
      'avatar.vercel.sh'
    ],
  },
  webpack: (config, { isServer }) => {
    // Node modüllerini client-side transpilation'dan hariç tut
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
      };
    }
    
    // node: protokolü ile başlayan modüllerin yüklemesini es geç
    config.module.rules.push({
      test: /node:/,
      loader: 'ignore-loader',
    });
    
    return config;
  }
}

module.exports = nextConfig; 