import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty()
  //   @IsNumberString()
  @Transform(({ value }) => Number(value))
  items: number;

  @IsNotEmpty()
  //   @IsNumberString()
  @Transform(({ value }) => Number(value))
  page: number;
}
