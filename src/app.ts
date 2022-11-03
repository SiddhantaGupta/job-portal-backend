import { Module } from '@nestjs/common';
import { EventModule } from '@squareboat/nest-events';
import { UserModule } from './user';
import { BoatModule } from '@libs/boat';
import { ConsoleModule } from '@squareboat/nest-console';
import { ObjectionModule } from '@libs/sq-obj';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/module';
import { CacheModule } from '@libs/cache';
import { JobModule } from './job/module';
import { MailmanModule } from 'libs/nest-mailman/src';
import { QueueModule } from '@libs/sq-nest-queue';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('cache'),
      inject: [ConfigService],
    }),
    MailmanModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('mailman'),
      inject: [ConfigService],
    }),
    QueueModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('queue'),
      inject: [ConfigService],
    }),
    BoatModule,
    CacheModule,
    UserModule,
    EventModule,
    ConsoleModule,
    AuthModule,
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
