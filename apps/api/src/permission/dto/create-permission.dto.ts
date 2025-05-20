import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Name has to match the regular expression: /(w:w)/.',
    example: 'product:create',
  })
  @IsNotEmpty()
  @Matches(/(\w:\w)/, {
    message: 'Name must respect the norm. ex : product:create .',
  })
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Describe the access a permission give to an user',
    example: 'Access to create a product.',
  })
  @IsOptional()
  @IsString()
  description: string;
}
