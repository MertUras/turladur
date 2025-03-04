import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
