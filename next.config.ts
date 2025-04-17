/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here 
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",

      },
      {
        hostname: "randomuser.me",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "placehold.co",
      },

    ],
  },
};

export default nextConfig;

*/



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com", // BU SATIR GEREKLİ
      "picsum.photos", // Added for random placeholder images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
};

export default nextConfig;