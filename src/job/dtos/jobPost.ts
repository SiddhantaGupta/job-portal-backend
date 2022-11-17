import { IsValueFromConfig } from '@libs/boat/validator';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class JobPostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @MinLength(2)
  @MaxLength(16)
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @IsValueFromConfig({ key: 'settings.employmentType' })
  @Transform(({ value }) => Number(value))
  employmentType: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  companyName: string;
}
