import type { NextConfig } from "next";

// Configuración base para demo local sin servicios externos.
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
