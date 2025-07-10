/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "lindway.vercel.app",
      },
      // {
      //   protocol: "http",
      //   hostname: "**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "**",
      // },
    ],
  },
};

export default nextConfig;
