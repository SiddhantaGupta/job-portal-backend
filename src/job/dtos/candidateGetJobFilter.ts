import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CandidateGetJobFilterDto {
  @Transform(({ value }) => value.toLowerCase())
  location: string;

  title: string;

  @Transform(({ value }) => Number(value))
  items: number;

  @Transform(({ value }) => Number(value))
  page: number;
}
