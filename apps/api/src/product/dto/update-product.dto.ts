import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

class ProductStatus {
  @ApiProperty({
    example: true,
    description: 'Active or Inactive product.',
  })
  status: boolean;
}

export class UpdateProductDto extends PartialType(IntersectionType(CreateProductDto, ProductStatus)) {}
