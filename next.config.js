/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sqlite3']
};

export default nextConfig;
