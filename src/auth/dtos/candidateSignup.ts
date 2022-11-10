import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SignupDto } from './signUp';

export class CandidateSignupDto extends SignupDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  experienceDuration: number;

  @IsString()
  @IsNotEmpty()
  fieldOfWork: string;

  @IsString()
  @IsNotEmpty()
  skills: string;
}
