import { Transform } from 'class-transformer';

export class CandidateGetJobFilterDto {
  @Transform(({ value }) => value.toLowerCase())
  search: string;
  page: number;
  perPage: number;
  isActive: boolean;
  userId: number;
  candidateId: number;
}
