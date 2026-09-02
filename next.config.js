/** @type {import('next').NextConfig} */
const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST;

const nextConfig = {
  images: {
    remotePatterns: imageHost
      ? [{ protocol: "https", hostname: imageHost }]
      : [],
  },
};

module.exports = nextConfig;
