/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',         // static export (no SSR)
  images: { unoptimized: true }, // required if you use <Image/>
};
export default nextConfig;
