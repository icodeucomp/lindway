/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // ✅ Include this if you're using the default Next.js dev server
      },
      {
        protocol: "https",
        hostname: "lindway.vercel.app",
      },
    ],
  },
};

export default nextConfig;
