import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';
import type { Stock } from '../../stock/entity/stock.entity';
import type { UserEntity } from '../../user-management/entities/user.entity';
import type { UserReview } from '../../user-reviews/entity/user-review.entity';
import { SerializedUserReview } from '../../user-reviews/types/serialized-user-review.class';
import type { Product } from '../entity/product.entity';
import { AttributeObject } from './attributeObject.type';

export class SerializedProduct {
  @ApiProperty({
    example: 'Samsung Galaxy S21',
  })
  name: string;

  @ApiProperty({
    example: 'Samsung',
  })
  brand: string;

  @ApiProperty({
    example: 'Snapdragon 888, 8GB RAM, 128GB Storage',
  })
  specs: string;

  @ApiProperty({
    example: 'Smartphones',
  })
  gallery: string;

  @ApiProperty({
    example: 'https://example.com/images/samsung-s21-front.jpg',
    description: 'url of product image',
  })
  imageUrl: string;

  @ApiProperty({
    example:
      'The Samsung Galaxy S21 features a stunning 6.2-inch Dynamic AMOLED display, powerful Snapdragon 888 processor, and a versatile triple camera system.',
  })
  description: string;

  @ApiProperty({
    example: 'Flagship smartphone with advanced camera system',
  })
  shortDescription: string;

  @ApiProperty({
    example: true,
    description: 'Active or Inactive product.',
  })
  active: boolean;

  @ApiProperty({
    example: 799.99,
  })
  @Transform(({ value }) => parseFloat(value))
  minPrice: number;

  @ApiProperty({
    example: 899.99,
  })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  maxPrice: number;

  @ApiProperty({
    example: 849.99,
  })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    example: 'EUR',
  })
  currency: string;

  @ApiProperty({
    example: 'NOUVEAU',
  })
  label: string;

  @ApiProperty({
    example: '#FF5733',
  })
  labelColor: string;

  @ApiProperty({
    example: true,
  })
  inStock: boolean;

  @ApiPropertyOptional({
    type: Object,
    description: 'The product extra attributes and possible values',
    example: {
      characteristics: ['color', 'weight', 'dimensions', 'battery'],
      promotions: {
        discount: '10%',
        startDate: 'Wed, 28 Jun 2024 10:33:41 GMT',
        endDate: 'Tue, 28 Aug 2024 10:39:31 GMT',
      },
    },
  })
  extraAttributes: AttributeObject<Record<string, unknown>>;

  @ApiProperty({
    example: 'd8379d3e-f461-4aae-91be-db7bda61e66b',
  })
  id: string;

  @ApiProperty({
    example: '2025-02-15T09:08:30.217Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-03-26T19:18:55.135Z',
  })
  updatedAt: Date;

  @ApiProperty({
    example: { id: 'c36f8e16-eca4-43e3-ae5f-e42108d92cd1', name: 'Smartphones' },
  })
  @Transform(({ value }) => (value?.id ? { id: value.id, name: value.name } : null))
  category: Category;

  @Exclude()
  stocks: Stock[];

  @Exclude()
  likedBy: UserEntity[];

  @ApiProperty({
    description: 'The user reviews of the product.',
    example: [
      {
        username: 'Jane',
        comment: 'Amazing phone, the camera quality is outstanding!',
        rating: 5,
      },
    ],
    type: [SerializedUserReview],
  })
  reviews: UserReview[];

  @ApiProperty({
    example: true,
  })
  liked: boolean;

  @ApiProperty({
    example: 4,
  })
  rating: number;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
    this.rating = this.calculateAverageRating();

    // Map store information from category if available
    if (partial.category?.store) {
      this.store = {
        id: partial.category.store.id,
        name: partial.category.store.name,
      };
    }
  }

  @ApiProperty({
    example: true,
  })
  inWishlist?: boolean;

  @ApiProperty({
    example: { id: 'store123', name: 'SuperStore' },
  })
  store: { id: string; name: string } | null;

  private calculateAverageRating(): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }

    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);

    return totalRating / this.reviews.length;
  }
}
