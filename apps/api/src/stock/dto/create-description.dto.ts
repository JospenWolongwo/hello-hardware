import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDescriptionDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Short description of the product stock.',
    example: 'This is a short description.',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Long description of the product stock.',
    example: ['This is the first paragraph.', 'This is the second paragraph.'],
  })
  @IsOptional()
  @IsString({ each: true })
  longDescription?: string[];
}
