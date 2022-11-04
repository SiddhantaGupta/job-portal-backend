import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';
  
  export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value})=>value.toLowerCase())
    
    email: string;
}