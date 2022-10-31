import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { SignupDto } from './signup';

export class CandidateSignupDto extends SignupDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    experienceDuration: Number;
  
    @IsString()
    @IsNotEmpty()
    fieldOfWork: string;

    @IsString()
    @IsNotEmpty()
    skills: string;
}