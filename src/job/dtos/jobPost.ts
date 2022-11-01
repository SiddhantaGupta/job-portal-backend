import { IsValueFromConfig } from '@libs/boat/validator';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JobPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @IsValueFromConfig({ key: 'settings.employmentType' })
  employmentType: number;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsNumber()
  salaryLowerLimit: number;

  @IsNotEmpty()
  @IsNumber()
  salaryUpperLimit: number;
}
