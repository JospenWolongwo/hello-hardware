import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive, IsUUID } from 'class-validator';

export class CreateCartItemDto {
  @ApiPropertyOptional({
    type: String,
    description: 'The Product Stock Id of the cart item.',
  })
  @IsUUID()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  stockId: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'The cart item quantity.',
  })
  @IsPositive()
  quantity: number;
}
