import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Category } from '../../category/entities/category.entity';
import type { Product } from '../entity/product.entity';

/**
 * DTO for sending product data to the client that matches the frontend Product type
 */
export class ProductResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Lenovo ThinkPad T14 Gen 1 14"' })
  name: string;

  @ApiPropertyOptional({ example: 'Intel Core i5-10310U 16GB RAM 256GB SSD' })
  specs: string;

  @ApiProperty({ example: 362.0 })
  price: number;

  @ApiProperty({ example: 'XAF', default: 'XAF' })
  currency: string;

  @ApiProperty({ example: 'assets/images/products/lenovo-thinkpad.png' })
  imageUrl: string;

  @ApiPropertyOptional({ example: 'SALE' })
  label?: string;

  @ApiPropertyOptional({ example: '#2db224' })
  labelColor?: string;

  @ApiProperty({ example: true })
  inStock: boolean;

  @ApiPropertyOptional({ example: 'Premium performance laptop' })
  shortDescription?: string;

  @ApiPropertyOptional({ example: false })
  inWishlist?: boolean;

  @ApiPropertyOptional({ example: 'Lenovo' })
  brand?: string;

  @ApiPropertyOptional({ example: { id: '123', name: 'Laptops' } })
  category?: Partial<Category>;

  /**
   * Transform a Product entity to a ProductResponseDto
   * @param product The product entity from the database
   * @param userId Optional user ID to check if the product is in the user's wishlist
   * @returns ProductResponseDto formatted for the frontend
   */
  static fromEntity(product: Product, userId?: string): ProductResponseDto {
    const dto = new ProductResponseDto();

    dto.id = product.id;
    dto.name = product.name;
    dto.specs = product.specs;
    dto.price = product.price;
    dto.currency = product.currency || 'XAF';
    dto.imageUrl = product.imageUrl;
    dto.label = product.label;
    dto.labelColor = product.labelColor;
    dto.inStock = product.inStock;
    dto.shortDescription = product.shortDescription;
    dto.brand = product.brand;

    // Check if product is in user's wishlist
    if (userId && product.likedBy) {
      dto.inWishlist = product.likedBy.some((user) => user.id === userId);
    } else {
      dto.inWishlist = false;
    }

    // Include category if available
    if (product.category) {
      dto.category = {
        id: product.category.id,
        name: product.category.name,
      };
    }

    return dto;
  }
}
