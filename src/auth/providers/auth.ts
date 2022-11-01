import { UserService } from '@app/user';
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BaseValidator, validate } from '@libs/boat/validator';
import {
  LoginDto,
  CandidateSignupDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto';
import { uuid } from 'uuidv4';
import { indexOf, pick } from 'lodash';
import { ValidationFailed } from '@libs/boat';
import { CacheStore } from '@libs/cache';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private config: ConfigService,
    private jwt: JwtService,
    private validator: BaseValidator,
  ) {}

  async signup(payload: any): Promise<any> {
    const userRoles = this.config.get('settings.roles');
    let validatedInputs = null;
    let userPayload = null;
    let resumePayload = null;
    if (payload.role === userRoles.candidate) {
      validatedInputs = await this.validator.fire(
        payload,
        CandidateSignupDto,
      );

      userPayload = pick(validatedInputs, [
        'firstName',
        'lastName',
        'email',
        'role',
        'password',
        'phoneNumber',
      ]);

      resumePayload = pick(validatedInputs, [
        'experienceDuration',
        'fieldOfWork',
        'skills',
      ]);

      console.log(resumePayload)

    } else {
      validatedInputs = await this.validator.fire(payload, SignupDto);

      userPayload = userPayload = pick(validatedInputs, [
        'firstName',
        'lastName',
        'email',
        'role',
        'password',
        'phoneNumber',
      ]);;
    }

    userPayload.password = await bcrypt.hash(userPayload.password, 10);

    const user = await this.userService.repo.create({
      uuid: uuid(),
      ...userPayload,
      is_active: true,
    });

    if (resumePayload) {
      const resume = await this.userService.resumeRepo.create({
        userId: user.id,
        ...resumePayload,
      });
      console.log(resume)
    }

    if (!user) {
      return {
        success: false,
        message: 'Signup failed',
      };
    }

    return await this.login({
      email: validatedInputs.email,
      password: validatedInputs.password,
    });
  }

  async login(payload: any): Promise<{ accessToken: string }> {
    const validatedInputs = await this.validator.fire(payload, LoginDto);

    const user = await this.userService.repo.firstWhere({
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

    return await this.signToken(user.uuid);
  }

  async signToken(uuid: string): Promise<{ accessToken: string }> {
    const payload = { uuid: uuid };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '120m',
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }

  async forgotPassword(payload: any): Promise<{
    success: boolean;
    message?: string;
    otp?: number;
  }> {
    const validatedInputs = await this.validator.fire(
      payload,
      ForgotPasswordDto,
    );

    const user = await this.userService.repo.query().findOne({
      email: validatedInputs.email,
    });     

    if (!user) {
      throw new ValidationFailed({
        'email': "Email does not exist"
      })
    }

    const otp = Math.floor(Math.random() * 10000000);

    await CacheStore().set(`${validatedInputs.email}_password_reset_otp`, `${otp}`, 120);

    return {
      success: true,
      otp,
    };

    // TODO: send reset password otp in to user.email
  }

  async resetPassword(payload: any): Promise<{
    success: boolean;
    message: string;
  }> {
    const validatedInputs = await this.validator.fire(
      payload,
      ResetPasswordDto,
    );

    let otpCheck = await CacheStore().has(`${validatedInputs.email}_password_reset_otp`)

    if (!otpCheck) {
      throw new ValidationFailed({
        'otp':'Incorrect OTP'
      })
    }

    if (validatedInputs.newPassword !== validatedInputs.confirmNewPassword) {
      throw new ValidationFailed({
        'newPassword': "New password does not match confirm password",
        'confirmNewPassword': "Confirm password does not match new password"
      })
    }

    let newHashedPassword = await bcrypt.hash(validatedInputs.newPassword, 10);

    const userUpdated = this.userService.repo
      .updateWhere({
        email: payload.email,
      }, {
        password: newHashedPassword
      })

    if (userUpdated) {
      return {
        success: true,
        message: 'Password has been updated',
      };
    } else {
      return {
        success: false,
        message: 'Something went wrong. Please try again later.',
      };
    }
  }
}
