import { mongoConfig } from './mongo.config';
import { rabbitConfig } from './rabbit.config';
import { redisConfig } from './redis.config';
import { sentryConfig } from './sentry.config';

export default () => ({
  env: process.env.APP_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  secret_key: process.env.SECRET_KEY,
  sentry: sentryConfig,
  redis: redisConfig,
  mongo: mongoConfig,
  rabbitmq: rabbitConfig,
  access_token_exp: parseInt(process.env.ACCESS_TOKEN_EXP),
  refresh_token_exp: parseInt(process.env.REFRESH_TOKEN_EXP),
  api_secret_key: process.env.API_SECRET_KEY,
});
