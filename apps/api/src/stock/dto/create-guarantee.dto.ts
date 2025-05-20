import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsPositive } from 'class-validator';

export class CreateGuaranteeDto {
  @ApiProperty({
    type: Number,
    description: 'the amount of time unit of the guarantee',
    example: 2,
  })
  @IsPositive()
  amount: number;

  @ApiProperty({
    type: String,
    description: 'The time unit of the guarantee',
    example: 'day',
  })
  @IsIn(['day', 'week', 'month', 'year'])
  timeUnit: 'day' | 'week' | 'month' | 'year';
}
