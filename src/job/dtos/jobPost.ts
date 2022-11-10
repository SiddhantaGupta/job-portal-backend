import { IsValueFromConfig } from '@libs/boat/validator';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value.toLowerCase())
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @IsValueFromConfig({ key: 'settings.employmentType' })
  @Transform(({ value }) => Number(value))
  employmentType: number;

  @IsNotEmpty()
  @IsString()
  companyName: string;
}
