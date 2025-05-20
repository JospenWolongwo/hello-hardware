import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from '../entity/product.entity';

export function ApiFindOneProductById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a product by its ID',
      description: 'Retrieve details of a specific product using its ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'The product has been successfully retrieved.',
      type: Product,
    }),
    ApiResponse({
      status: 404,
      description: 'Product not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    })
  );
}
