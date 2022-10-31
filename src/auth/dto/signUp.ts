import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';
  
export class SignupDto {

    @IsNotEmpty()
    role: Number;

    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phoneNumber: string;
    
}

