import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { AttributeObject } from '../type/attributeObject.type';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    description: 'Name of the product.',
    example: 'Lenovo ThinkPad T14 Gen 1 14"',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  name: string;

  @ApiProperty({
    type: String,
    description: 'The brand name of the product.',
    example: 'Lenovo',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  brand: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Technical specifications of the product.',
    example: 'Intel Core i5-10310U 16GB RAM 256GB SSD',
  })
  @IsOptional()
  @IsString()
  specs: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Details about the product.',
    example: 'Professional laptop with powerful performance and security features',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  description: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Brief description of the product.',
    example: 'Premium performance laptop',
  })
  @IsOptional()
  @IsString()
  shortDescription: string;

  @ApiProperty({
    type: Number,
    description: 'The current price of the product.',
    example: 362.0,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    type: String,
    description: 'The currency for the product price.',
    example: 'XAF',
    default: 'XAF',
  })
  @IsOptional()
  @IsString()
  currency: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Main image URL for the product.',
    example: 'assets/images/products/lenovo-thinkpad.png',
  })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Product label (e.g., SALE, NOUVEAU, -25% OFF)',
    example: 'SALE',
  })
  @IsOptional()
  @IsString()
  label: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Color code for the product label.',
    example: '#2db224',
  })
  @IsOptional()
  @IsString()
  labelColor: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the product is in stock.',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  inStock: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Whether the product is active.',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional({
    description: 'The product extra attributes',
    example: {
      material: 'aluminum',
    },
  })
  @IsOptional()
  @IsObject()
  extraAttributes: AttributeObject<Record<string, unknown>>;

  @ApiPropertyOptional({
    type: String,
    description: 'The id of the category to which the product belongs.',
    example: 'a1fce808-3192-42a6-8d8f-03a98348e6fe',
  })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  category: string;
}
