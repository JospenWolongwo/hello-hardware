import type { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const redisConfig = (): CacheModuleAsyncOptions => ({
  useFactory: async () => ({
    store: await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: +(<string>process.env.REDIS_PORT),
      },
    }),
  }),
  isGlobal: true,
});
