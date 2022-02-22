import { LogLevel } from '@sentry/types';

export const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  debug: false,
  environment: process.env.APP_ENV,
  release: null,
  logLevel: LogLevel.Error,
};
