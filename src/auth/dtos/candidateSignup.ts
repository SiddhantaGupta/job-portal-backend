import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { SignupDto } from './signup';

export class CandidateSignupDto extends SignupDto {
    @IsNotEmpty()
    @IsNumber()
    experienceDuration: number;
  
    @IsString()
    @IsNotEmpty()
    fieldOfWork: string;

    @IsString()
    @IsNotEmpty()
    skills: string;
}