import type { NextConfig } from "next";
import { version as appVersion } from "./package.json";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
      "bluetooth=()",
      "hid=()",
      "serial=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()"
    ].join(", ")
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  }
];
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "sbom2notice";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  typedRoutes: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isPages ? `/${repo}` : "",
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  ...(isPages ? {} : {
    async headers(){
      return [{
        source: "/(.*)",
        headers: securityHeaders
      }]
    }
  }),
};

export default nextConfig;
