import { Module } from '@nestjs/common';
import { EventModule } from '@squareboat/nest-events';
import { UserModule } from './user';
import { BoatModule } from '@libs/boat';
import { ConsoleModule } from '@squareboat/nest-console';
import { ObjectionModule } from '@squareboat/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/module';
// import { CacheModule } from '@squareboat/nest-cache';
import { CacheModule } from '@libs/cache';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    // CacheModule.register({
    //   default: 'redis',
    //   stores: {
    //       redis: {
    //           driver: 'redis',
    //           host: process.env.REDIS_HOST,
    //           password: process.env.REDIS_PASSWORD,
    //           port: process.env.REDIS_PORT || 6379,
    //           database: process.env.REDIS_DB || 0,
    //           prefix: 'fp',
    //       },
    //     }
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('cache'),
      inject: [ConfigService],
    }),
    BoatModule,
    CacheModule,
    UserModule,
    EventModule,
    ConsoleModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
