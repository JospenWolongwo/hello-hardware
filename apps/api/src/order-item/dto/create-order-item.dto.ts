import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    type: String,
    description: 'Stock id.',
    example: 'ff6476ca-b272-4d0a-9a78-cf62c3d38f18',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  stockId: string;

  @ApiProperty({
    type: Number,
    description: 'Product ordered quantity.',
    example: 30,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Order product discount percentage.',
    example: 8,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discountPercentage: number;
}
