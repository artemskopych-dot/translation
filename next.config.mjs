/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // ← це вмикає статичний export у Next 14
  images: { unoptimized: true },
  trailingSlash: true
};
export default nextConfig;

