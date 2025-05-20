import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { UserReview } from '../entity/user-review.entity';

export class SerializedUserReview {
  @ApiProperty({
    example: {
      id: 'd9b1f1d9-6a4a-4f61-82aa-c4b1de9c3b39',
      profilePicture: 'https://example.com/profile.jpg',
      name: 'John Doe',
    },
    description: 'User details',
  })
  @Expose()
  get userDetails() {
    return {
      id: this.userId,
      profilePicture: this.profilePicture,
      name: this.userName,
    };
  }

  @ApiProperty({
    example: {
      id: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
      rating: 5,
      mainIdea: 'Highly recommend!',
      feedback: 'The product exceeded my expectations in every way.',
      productName: 'Sample Product',
      productId: 'p1',
      stockId: 's1',
    },
    description: 'Review details',
  })
  @Expose()
  get review() {
    return {
      id: this.stockId,
      rating: this.rating,
      mainIdea: this.feedbackSummary,
      feedback: this.feedbackDetails,
      productName: this.productName,
      productId: this.productId,
      stockId: this.stockId,
    };
  }

  @ApiProperty({
    example: 5,
    description: 'The rating given by the user',
  })
  @Exclude()
  rating: number;

  @ApiProperty({
    example: 'Highly recommend!',
    description: 'A summary or main idea of the review',
  })
  @Exclude()
  feedbackSummary: string | null;

  @ApiProperty({
    example: 'The product exceeded my expectations in every way.',
    description: 'Detailed feedback from the user',
  })
  @Exclude()
  feedbackDetails: string | null;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @Exclude()
  get userName(): string {
    return this.user?.firstName ?? 'Name not found';
  }

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'The profile picture of the user',
  })
  @Exclude()
  get profilePicture(): string {
    return this.user?.profilePicture ?? 'Profile picture not found';
  }

  @ApiProperty({
    example: 'Sample Product',
    description: 'The name of the reviewed product',
  })
  @Exclude()
  get productName(): string {
    return this.product?.name ?? 'Product not found';
  }

  @ApiProperty({
    example: 'd9b1f1d9-6a4a-4f61-82aa-c4b1de9c3b39',
    description: 'The unique identifier of the user',
  })
  @Exclude()
  userId: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'The unique identifier of the product',
  })
  @Exclude()
  productId: string;

  @Exclude()
  stockId: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The user details',
  })
  @Exclude()
  user: UserEntity;

  @ApiProperty({
    example: 'Sample Product',
    description: 'The product details',
  })
  @Exclude()
  product: Product;

  @ApiProperty({
    example: 'Sample Stock',
    description: 'The stock details',
  })
  @Exclude()
  stock: Stock;

  constructor(partial: Partial<UserReview>) {
    Object.assign(this, partial);
    this.userId = partial.user?.id ?? '';
    this.productId = partial.product?.id ?? '';
    this.stockId = partial.stock?.id ?? '';
  }
}
