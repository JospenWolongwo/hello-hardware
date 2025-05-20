import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 'Cameroun',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  country: string;

  @ApiProperty({
    example: 'Douala',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  city: string;

  @ApiProperty({
    example: 'rue PO',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  street: string;

  @ApiProperty({
    example: '232',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  zipCode: string;

  @ApiPropertyOptional({
    example: 'Located near the bakery of ...',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  additionalDescription: string;
}
