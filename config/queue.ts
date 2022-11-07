import { registerAs } from '@nestjs/config';
import { QueueOptions } from '@libs/sq-nest-queue';
import { RedisQueueDriver } from '@libs/nest-queue-redis';

export default registerAs('queue', () => {
  return {
    default: 'notifications',
    connections: {
      notifications: {
        driver: RedisQueueDriver,
        queue: process.env.QUEUE_NAME,
        host: process.env.QUEUE_HOST,
        port: +process.env.QUEUE_PORT,
        database: +process.env.QUEUE_DB,
      },
    },
  } as QueueOptions;
});
