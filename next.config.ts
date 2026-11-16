import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Global & LAN development origins allowance
  // Note: Next.js matches against the hostname only (ports are stripped by Next.js)
  allowedDevOrigins: [
    // Global IPv4 wildcard - approves all local LAN, Wi-Fi, mobile hotspot, and network IPs
    "*.*.*.*",
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    // Localhost & loopback
    "localhost",
    "*.localhost",
    "127.0.0.1",
    // Explicit local IPs
    "192.168.1.35",
    "192.168.238.182",
    // Local hostnames & tunnels
    "*.local",
    "*.lan",
    "*.ngrok-free.app",
    "*.loca.lt",
  ],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
