import { IsValueFromConfig } from '@libs/boat/validator';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import AuthModuleConstants from '../authModuleConstants';

export class SignupDto {
  @IsNotEmpty()
  @IsValueFromConfig({ key: 'settings.roles' })
  role: number;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(AuthModuleConstants.passwordLength)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsMobilePhone('en-IN', {}, { message: 'Invalid phone number' })
  phoneNumber: string;
}
