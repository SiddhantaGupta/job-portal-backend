import { IsValueFromConfig } from '@libs/boat/validator';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
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
  @IsPhoneNumber()
  phoneNumber: string;
}
