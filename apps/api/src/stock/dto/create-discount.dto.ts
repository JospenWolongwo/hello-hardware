import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    type: Number,
    description: 'Discount percentage',
    example: 2,
  })
  @IsPositive()
  percentage: number;

  @ApiProperty({
    type: Number,
    description: 'Minimum amount to order to have the discount',
    example: 25,
  })
  @IsPositive()
  minQuantityToOrder: number;
}
