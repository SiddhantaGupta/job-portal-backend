import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CandidateGetJobFilterDto {
  @Transform(({ value }) => value.toLowerCase())
  location: string;

  title: string;

  page: number;
  perPage: number;
  isActive: boolean;
  userId: number;
}
