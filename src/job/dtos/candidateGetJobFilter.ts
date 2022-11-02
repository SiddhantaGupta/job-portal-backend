import { Transform } from 'class-transformer';

export class CandidateGetJobFilterDto {
  @Transform(({ value }) => value.toLowerCase())
  location: string;

  title: string;
}
