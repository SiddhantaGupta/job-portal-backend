import { ResumeService, UserService } from '@app/user';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BaseValidator } from '@libs/boat/validator';
import { AdminLoginDto } from '../dtos';
import { IUserModel } from '@app/user/interfaces';
import { ValidationFailed } from '@libs/boat';
import validateAdminRecaptcha from '@app/common/validateAdminRecaptcha';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly userService: UserService,
    private config: ConfigService,
    private jwt: JwtService,
    private validator: BaseValidator,
  ) {}

  async login(payload: AdminLoginDto): Promise<IUserModel> {
    const validatedInputs = await this.validator.fire(payload, AdminLoginDto);

    const reCaptchaToken = validatedInputs.reCaptchaToken;
    const result = await validateAdminRecaptcha(reCaptchaToken);

    const user = await this.userService.repo.firstWhere(
      {
        email: validatedInputs.email,
      },
      false,
    );

    if (!user) {
      throw new ValidationFailed({
        email: 'Incorrect Credentials',
        password: 'Incorrect Credentials',
      });
    }

    let passwordVerified;
    if (user) {
      passwordVerified = await bcrypt.compare(
        validatedInputs.password,
        user.password,
      );
    }

    if (!passwordVerified) {
      throw new ValidationFailed({
        email: 'Incorrect Credentials',
        password: 'Incorrect Credentials',
      });
    }

    const userRoles = this.config.get('settings.roles');
    if (!(user.role === userRoles.admin)) {
      throw new ValidationFailed({
        email: 'Incorrect Credentials',
        password: 'Incorrect Credentials',
      });
    }

    return {
      ...user,
      accessToken: (await this.signToken(user.uuid)).accessToken,
    };
  }

  async signToken(uuid: string): Promise<{ accessToken: string }> {
    const payload = {
      uuid: uuid,
    };
    const secret = this.config.get('JWT_SECRET');
    const expiry = this.config.get('JWT_EXPIRY');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiry,
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }
}
