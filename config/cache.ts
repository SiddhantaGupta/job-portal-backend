import { registerAs } from '@nestjs/config';
import { CacheOptions } from '@libs/cache';

export default registerAs(
  'cache',
  () =>
    ({
      default: 'redis',
      stores: {
        redis: {
          driver: 'redis',
          host: process.env.REDIS_HOST || '127.0.0.1',
          password: process.env.REDIS_PASSWORD || undefined,
          port: +process.env.REDIS_PORT || 6379,
          database: +process.env.REDIS_DB || 0,
          prefix: 'nestjs_boilerplate',
        },
      },
    } as CacheOptions),
);