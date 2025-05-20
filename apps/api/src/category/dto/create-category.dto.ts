import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    examples: {
      createCategory: { value: 'men' },
      createSubCategory: { value: 'blazer' },
    },
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  name: string;

  @ApiPropertyOptional({
    examples: {
      createCategory: { value: 'cloths for men' },
      createSubCategory: { value: "men's blazer" },
    },
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  description: string;
}
