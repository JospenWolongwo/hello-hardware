import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  description: string;
}
