import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from '../../order-item/dto/create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'The items ordered.',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    type: String,
    description: 'Delivery address id.',
    example: 'ac6c9084-f7e6-46aa-9665-d5e6b5beb162',
  })
  @IsUUID()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  deliveryAddressId: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Additional information about the order.',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  remarks: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'The tax percentage to be paid for this order.',
    example: 0.07,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  taxPercentage: number;
}
