import { IsNotEmpty, IsString } from 'class-validator';

export class GetOneJobDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
