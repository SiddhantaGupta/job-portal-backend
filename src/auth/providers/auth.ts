import { UserService } from '@app/user';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BaseValidator } from '@libs/boat/validator';
import {
  LoginDto,
  CandidateSignupDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos';
import { uuid } from 'uuidv4';
import { pick } from 'lodash';
import { GenericException, ValidationFailed } from '@libs/boat';
import { CacheStore } from '@libs/cache';
import { EmitEvent } from '@squareboat/nest-events';
import { UserRequestedOtp } from '../events/userRequestedOtp';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private config: ConfigService,
    private jwt: JwtService,
    private validator: BaseValidator,
  ) {}

  async signup(
    payload: SignupDto | CandidateSignupDto,
  ): Promise<{ accessToken: string }> {
    const userRoles = this.config.get('settings.roles');
    let validatedInputs = null;
    let userPayload = null;
    let resumePayload = null;
    if (payload.role === userRoles.candidate) {
      validatedInputs = await this.validator.fire(payload, CandidateSignupDto);

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
    } else {
      validatedInputs = await this.validator.fire(payload, SignupDto);

      userPayload = userPayload = pick(validatedInputs, [
        'firstName',
        'lastName',
        'email',
        'role',
        'password',
        'phoneNumber',
      ]);
    }

    const userExists = await this.userService.repo.exists({
      email: userPayload.email,
    });

    if (userExists) {
      throw new ValidationFailed({
        email: 'user already exists',
      });
    }

    userPayload.password = await bcrypt.hash(userPayload.password, 10);

    const user = await this.userService.repo.create({
      uuid: uuid(),
      ...userPayload,
      isActive: true,
    });

    if (resumePayload) {
      const resume = await this.userService.resumeRepo.create({
        userId: user.id,
        ...resumePayload,
      });
    }

    if (!user) {
      throw new GenericException();
    }

    return await this.login({
      email: validatedInputs.email,
      password: validatedInputs.password,
    });
  }

  async login(payload: LoginDto): Promise<{ accessToken: string }> {
    const validatedInputs = await this.validator.fire(payload, LoginDto);

    const user = await this.userService.repo.firstWhere({
      email: validatedInputs.email,
    });

    if (!user.isActive) {
      throw new ForbiddenException('User has been blocked');
    }

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
      expiresIn: '120d',
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<{
    message: string;
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
        email: 'Email does not exist',
      });
    }

    const otp = Math.floor(Math.random() * 10000000);

    await CacheStore().set(
      `${validatedInputs.email}_password_reset_otp`,
      `${otp}`,
      120,
    );

    // emit event
    EmitEvent(
      new UserRequestedOtp({
        email: validatedInputs.email,
        subject: 'Password reset OTP',
        message: `Your password reset OTP is ${otp}`,
      }),
    );

    return {
      message: 'Your password reset OTP has been sent on your registered email',
    };
  }

  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    const validatedInputs = await this.validator.fire(
      payload,
      ResetPasswordDto,
    );

    let otpCheck = await CacheStore().has(
      `${validatedInputs.email}_password_reset_otp`,
    );

    if (!otpCheck) {
      throw new ValidationFailed({
        otp: 'Incorrect OTP',
      });
    }

    let newHashedPassword = await bcrypt.hash(validatedInputs.newPassword, 10);

    let passwordUpdated = await this.userService.repo.updateWhere(
      {
        email: payload.email,
      },
      {
        password: newHashedPassword,
      },
    );

    return { message: 'Password updated successfully' };
  }
}
