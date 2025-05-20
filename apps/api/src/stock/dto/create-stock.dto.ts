import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttributeObject } from '../../product/type/attributeObject.type';
import { StockAvailability } from '../enum/stock-availability.enum';
import { CreateDescriptionDto } from './create-description.dto';
import { CreateDiscountDto } from './create-discount.dto';
import { CreateGuaranteeDto } from './create-guarantee.dto';

export class CreateStockDto {
  @ApiProperty({
    type: String,
    example: '7c197e5d-40ee-4f6c-91d5-c160c694b9e0',
    description: 'The product ID associated with the stock.',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  productId: string;

  @ApiProperty({ type: String, description: 'Unique identifier for the stock (SKU).', example: 'SKU-12345' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  keepingUnit: string;

  @ApiProperty({ type: Number, example: 50, description: 'Quantity of the stock.' })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ type: Number, example: 1500, description: 'Price of the stock.' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ description: 'Discounts available for the stock.', type: [CreateDiscountDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateDiscountDto)
  @IsOptional()
  discounts?: CreateDiscountDto[];

  @ApiProperty({
    description: 'Characteristics of the stock.',
    example: { color: 'Blue', weight: '120kg', hardness: '4B', dimensions: '6.93 x 0.28 x 0.08 inches' },
  })
  @IsObject()
  @IsNotEmpty()
  characteristics: AttributeObject<Record<string, unknown>>;

  @ApiPropertyOptional({ description: 'Guarantee details.', type: CreateGuaranteeDto })
  @ValidateNested({ each: true })
  @Type(() => CreateGuaranteeDto)
  @IsOptional()
  guarantee?: CreateGuaranteeDto;

  @ApiProperty({ description: 'Pictures associated with the stock.', example: ['image1.png', 'image2.png'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  pictures: string[];

  @ApiPropertyOptional({ description: 'Manual PDF.', example: 'manual.pdf' })
  @IsString()
  @IsOptional()
  manualPdf?: string;

  @ApiPropertyOptional({
    description: 'Description of the stock.',
    example: { shortDescription: 'A durable steel door.', longDescription: ['Detail 1', 'Detail 2'] },
    type: CreateDescriptionDto,
  })
  @ValidateNested()
  @Type(() => CreateDescriptionDto)
  @IsOptional()
  description?: CreateDescriptionDto | null;

  @ApiProperty({ description: 'Availability status of the stock.', enum: StockAvailability })
  @IsEnum(StockAvailability)
  @IsNotEmpty()
  availabilityStatus: StockAvailability;

  @ApiPropertyOptional({ description: 'Delivery duration.', type: CreateGuaranteeDto })
  @ValidateNested()
  @Type(() => CreateGuaranteeDto)
  @IsOptional()
  deliveryDuration?: CreateGuaranteeDto;
}
