import { IsNotEmpty, IsString } from 'class-validator';
import { IPagination } from '../interfaces';

export class JobIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
