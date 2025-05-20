import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FindByStoreDto {
  @ApiPropertyOptional({
    example: ['carrefour'],
  })
  @IsArray()
  @IsOptional()
  @ArrayUnique()
  @IsNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((store: string) => store.trim().toLocaleLowerCase()))
  store: string[];
}
