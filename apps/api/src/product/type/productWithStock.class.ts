import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { SerializedStock } from '../../stock/types/serialized-stock.class';
import type { UserReview } from '../../user-reviews/entity/user-review.entity';
import { SerializedUserReview } from '../../user-reviews/types/serialized-user-review.class';
import { Category } from '../../category/entities/category.entity';
import type { Stock } from '../../stock/entity/stock.entity';
import type { UserEntity } from '../../user-management/entities/user.entity';
import type { Product } from '../entity/product.entity';
import { AttributeObject } from './attributeObject.type';

export class ProductWithStock {
  @ApiProperty({
    example: 'pain au chocolat',
  })
  name: string;

  @ApiProperty({
    example: '1123778903',
  })
  code: string;

  @ApiProperty({
    example: 'Saker',
  })
  brand: string;

  @ApiProperty({
    example: 'Viennoiserie',
  })
  gallery: string[];

  @ApiProperty({
    example:
      'Pain au chocolat is a French viennoiserie roll made with a combination of rectangular, yeast-leavened dough and a few chocolate sticks or chocolate ganache.',
  })
  description: string;

  @Exclude()
  active: boolean;

  @ApiProperty({
    example: 0.2,
  })
  @Transform(({ value }) => parseInt(value))
  minPrice: number;

  @ApiProperty({
    example: 1,
  })
  @Transform(({ value }) => (value ? parseInt(value) : null))
  maxPrice: number;

  @ApiPropertyOptional({
    type: Object,
    description: 'The product extra attributes and possible values',
    example: {
      characteristics: ['type', 'weight', 'format', 'ingredients'],
      promotions: {
        discount: '0.5%',
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
    example: '2013-01-06T09:08:30.217Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2016-03-26T19:18:55.135Z',
  })
  updatedAt: Date;

  @ApiProperty({
    example: { id: 'c36f8e16-eca4-43e3-ae5f-e42108d92cd1', name: 'bread' },
  })
  @Transform(({ value }) => (value?.id ? { id: value.id, name: value.name } : null))
  category: Category;

  @ApiProperty({
    type: [SerializedStock],
  })
  @Transform(({ value }) => new SerializedStock(value))
  stocks: Stock[];

  @Exclude()
  likedBy: UserEntity[];

  @ApiProperty({
    type: [SerializedUserReview],
    description: 'List of user reviews',
  })
  @Transform(({ value }) => value.map((review: UserReview) => new SerializedUserReview(review)), { toPlainOnly: true })
  reviews: UserReview[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
