/* eslint-disable @typescript-eslint/no-var-requires */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const { i18n } = require('./next-i18next.config.js');

const moduleExports = {
  publicRuntimeConfig: {
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: [`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}`],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: false } }],
    });

    return config;
  },
  i18n,

  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
    autoInstrumentServerFunctions: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
