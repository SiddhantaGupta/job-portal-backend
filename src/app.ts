import { Module } from '@nestjs/common';
import { EventModule } from '@squareboat/nest-events';
import { UserModule } from './user';
import { BoatModule } from '@libs/boat';
import { ConsoleModule } from '@squareboat/nest-console';
import { ObjectionModule } from '@squareboat/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/module';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    BoatModule,
    UserModule,
    EventModule,
    ConsoleModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
