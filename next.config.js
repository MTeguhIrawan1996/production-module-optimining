/* eslint-disable @typescript-eslint/no-var-requires */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { i18n } = require('./next-i18next.config.js');

const MAIN_MODULE_URL = process.env.MAIN_MODULE_URL;

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
  webpack(config, options) {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'production',
        filename: `static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`,
        exposes: {
          './features': './src/components/exposes/exposes.tsx',
        },
        remotes: {
          main: `main@${MAIN_MODULE_URL}/_next/static/${
            isServer ? 'ssr' : 'chunks'
          }/remoteEntry.js`,
        },
        shared: {},
      })
    );

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
