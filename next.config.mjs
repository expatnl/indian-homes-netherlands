import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exposes SENTRY_DSN to both server and client bundles without renaming it
  // to NEXT_PUBLIC_SENTRY_DSN, since PRD Section 13 specifies the var as SENTRY_DSN.
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});
