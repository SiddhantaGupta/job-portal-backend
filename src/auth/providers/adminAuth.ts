import { ResumeService, UserService } from '@app/user';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BaseValidator } from '@libs/boat/validator';
import { AdminLoginDto } from '../dto';
import { IUserModel } from '@app/user/interfaces';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly userService: UserService,
    private config: ConfigService,
    private jwt: JwtService,
    private validator: BaseValidator,
  ) {}

  // INSERT INTO users (email, password, role) VALUES ('admin@example.com', '$2a$12$hYZ83STMk38Rc3hU1ry6HeOGlwa3K64a5WswTFG7zjJ2lGd0kQmfa', 1);

  async login(payload: any): Promise<IUserModel> {
    const validatedInputs = await this.validator.fire(payload, AdminLoginDto);

    const user = await this.userService.repo.query().findOne({
      email: validatedInputs.email,
    });

    let passwordVerified;
    if (user) {
      passwordVerified = await bcrypt.compare(
        validatedInputs.password,
        user.password,
      );
    }

    if (!passwordVerified) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const userRoles = this.config.get('settings.roles');
    if (!(user.role === userRoles.admin)) {
      throw new ForbiddenException('Not an admin');
    }

    return await this.signToken(user.uuid);
  }

  async signToken(uuid: string): Promise<{ accessToken: string }> {
    const payload = {
      uuid: uuid,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '120m',
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }
}
