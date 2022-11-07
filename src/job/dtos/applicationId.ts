import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
