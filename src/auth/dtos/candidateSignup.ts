import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { SignupDto } from './signUp';

export class CandidateSignupDto extends SignupDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @MaxLength(2)
  experienceDuration: number;

  @IsString()
  @IsNotEmpty()
  fieldOfWork: string;

  @IsString()
  @IsNotEmpty()
  skills: string;
}
