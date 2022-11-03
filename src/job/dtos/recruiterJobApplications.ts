import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class RecruiterJobApplicationsDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @Transform(({ value }) => Number(value))
  items: number;

  @Transform(({ value }) => Number(value))
  page: number;
}
