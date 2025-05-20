import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class LikeProductDto {
  @ApiProperty({
    example: true,
    description: 'A user can like or unlike a product',
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
