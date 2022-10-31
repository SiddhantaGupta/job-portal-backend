import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ResumeDto {
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