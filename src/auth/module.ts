import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth';
import { AuthService } from './providers/auth';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt';
import { BaseValidator } from '@libs/boat/validator';
import { AdminAuthController } from './controllers/adminAuth';
import { AdminAuthService } from './providers/adminAuth';
import { NotificationService } from './queue/notificationService';
import { AuthModuleListener } from './listeners/authModuleListeners';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AuthService,
    AdminAuthService,
    JwtStrategy,
    BaseValidator,
    NotificationService,
    AuthModuleListener,
  ],
})
export class AuthModule {}
