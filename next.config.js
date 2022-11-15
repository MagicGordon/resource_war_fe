/** @type {import('next').NextConfig} */
console.log(process.env.NODE_ENV, 11111111);
const assetPrefix = process.env.NODE_ENV === 'dev' ? '/' : '/resource_war_fe'
const nextConfig = {
  assetPrefix,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.arweave.net",
      },
    ],
    domains: [
      "ipfs.io",
      "ipfs.filebase.io",
      "ipfs.infura.io",
      "nftstorage.link",
      "aptoslabs.com",
      "miro.medium.com",
      "www.gitbook.com",
    ],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
