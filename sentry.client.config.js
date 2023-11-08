// This file configures the intialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { Replay } from '@sentry/nextjs';
import getConfig from 'next/config';

const SENTRY_DSN = getConfig().publicRuntimeConfig.dsn;

Sentry.init({
  dsn: SENTRY_DSN,
  sampleRate: 0.65,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Replay({
      blockAllMedia: true,
    }),
  ],
});
