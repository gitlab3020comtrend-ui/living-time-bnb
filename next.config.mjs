/** @type {import('next').NextConfig} */
const nextConfig = {
  // LOCAL_BASE_PATH=/bnb for local reverse proxy, empty for Vercel
  ...(process.env.LOCAL_BASE_PATH ? { basePath: process.env.LOCAL_BASE_PATH } : {}),
};
export default nextConfig;
