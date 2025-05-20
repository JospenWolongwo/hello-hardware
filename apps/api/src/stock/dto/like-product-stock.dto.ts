import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class LikeProductStockDto {
  @ApiProperty({
    example: true,
    description: 'A user can like or unlike a product stock',
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
