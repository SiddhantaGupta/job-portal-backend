import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';
  
  export class AdminLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value})=>value.toLowerCase())
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    reCaptchaToken: string;
}