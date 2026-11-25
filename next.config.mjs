/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH ?? ""; // "/mapa-avd-dor" no GitHub Pages; vazio na Vercel/local

const nextConfig = {
  output: "export", // gera HTML estático na pasta out/
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
