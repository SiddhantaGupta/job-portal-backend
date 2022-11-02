import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
