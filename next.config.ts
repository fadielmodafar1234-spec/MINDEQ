import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingExcludes: {
    "/api/development-assets/*": [
      "./.mindeq-development-assets/**/*",
    ],
  },
  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
