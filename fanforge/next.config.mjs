/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["rocketride", "ws", "bufferutil", "utf-8-validate"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.gmi-serving.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
