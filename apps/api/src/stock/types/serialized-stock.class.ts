import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import type { UserEntity } from '../../user-management/entities/user.entity';
import { AttributeObject } from '../../product/type/attributeObject.type';
import { SerializedProduct } from '../../product/type/serializedProduct.class';
import type { UserReview } from '../../user-reviews/entity/user-review.entity';
import type { Stock } from '../entity/stock.entity';
import { StockAvailability } from '../enum/stock-availability.enum';
import type { Discount } from './discount.type';
import { TimeLapse } from './timeLapse.type';

export class SerializedStock {
  @ApiProperty({
    type: SerializedProduct,
  })
  @ApiProperty({
    example: 5,
  })
  quantity: number;

  @ApiPropertyOptional({
    example: [
      { percentage: 0.5, minQuantityToOrder: 100 },
      { percentage: 2, minQuantityToOrder: 200 },
      { percentage: 5, minQuantityToOrder: 800 },
    ],
  })
  discounts: Discount[];

  @ApiProperty({
    example: {
      type: 'french',
      weight: '20g',
      format: 'single',
      ingredients: ['flour', 'egg', 'chocolate'],
    },
  })
  characteristics: AttributeObject<Record<string, unknown>>;

  @ApiProperty({
    example: 'pai-sak-vie',
  })
  keepingUnit: string;

  @ApiProperty({
    example: 10,
  })
  price: number;

  @ApiProperty({
    example: 'f08c2518-8f7e-4d2c-9dfe-f1a102a7b3f8',
  })
  id: string;

  @ApiProperty({
    example: '11/10/2016, 11:49:36 AM',
  })
  createdAt: Date;

  @ApiProperty({
    example: '10/06/2018, 07:09:00 AM',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '[c6d3f9a6-9bbe-4dda-b41d-cdf9c0d293a4.png,721e3616-fd12-4324-8f01-8f5345c72f62.png]',
  })
  pictures: string[];

  @ApiProperty({
    example: 'In Stock',
    enum: StockAvailability,
  })
  availabilityStatus: StockAvailability;

  @ApiPropertyOptional({
    example: {
      duration: 12,
      unit: 'months',
    },
  })
  guarantee: TimeLapse;

  @ApiPropertyOptional({
    example: {
      duration: 7,
      unit: 'days',
    },
  })
  deliveryDuration: TimeLapse;

  @ApiProperty({
    example: {
      shortDescription: 'A short description',
      longDescription: ['Line 1 of description', 'Line 2 of description'],
    },
  })
  description: { shortDescription: string | null; longDescription: string[] | null };

  @ApiPropertyOptional()
  manualPdf: string | null;

  @Exclude()
  likedBy: UserEntity[];

  @ApiProperty({ example: true })
  liked: boolean;

  @Exclude()
  reviews: UserReview[];

  @ApiProperty({
    type: SerializedProduct,
  })
  product: SerializedProduct;

  constructor(stock: Stock) {
    Object.assign(this, stock);
    if (stock.product) {
      this.product = new SerializedProduct(stock.product);
    }
    if (stock.description) {
      this.description = {
        shortDescription: stock.description.shortDescription,
        longDescription: stock.description.longDescription,
      };
    }
  }
}
