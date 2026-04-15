import type { NextConfig } from "next";

// Configuración base para demo local sin servicios externos.
const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
