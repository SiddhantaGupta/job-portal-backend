import { IsNotEmpty, IsString } from 'class-validator';

export class JobIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
