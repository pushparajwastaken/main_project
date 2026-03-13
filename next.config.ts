import type { NextConfig } from "next";
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
