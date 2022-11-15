import { IsEqualToProp } from '@libs/boat/validator';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import AuthModuleConstants from '../authModuleConstants';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(AuthModuleConstants.passwordLength)
  @IsEqualToProp('confirmNewPassword')
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(AuthModuleConstants.passwordLength)
  @IsEqualToProp('newPassword')
  confirmNewPassword: string;

  @IsNotEmpty()
  otp: number;
}
