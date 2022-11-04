import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';
  
  export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value})=>value.toLowerCase())
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
}