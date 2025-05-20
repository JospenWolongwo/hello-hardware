import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserReviewDTO {
  @ApiProperty({
    example: 5,
    description: 'The rating given by the user',
  })
  @IsInt()
  @IsNotEmpty()
  rating: number;

  @ApiPropertyOptional({
    example: 'Highly recommend!',
    description: 'A summary or main idea of the review',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  feedbackSummary: string;

  @ApiPropertyOptional({
    example: 'The product exceeded my expectations in every way.',
    description: 'Detailed feedback from the user',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  feedbackDetails: string;

  @ApiProperty({
    example: 'b1f1d9b1-6a4a-4f61-82aa-c4b1de9c3b39',
    description: 'The unique identifier of the user who wrote the review',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'a9b1c9b1-7c4a-4f71-92aa-d4b1de9d3a39',
    description: 'The unique identifier of the reviewed product',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'a9b1c9b1-7c4a-4f71-92aa-d4b1de9d3a39',
    description: 'The unique identifier of the reviewed product stock',
  })
  @IsString()
  @IsOptional()
  stockId: string;
}
