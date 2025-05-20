import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiGetStocksByProductId() {
  return applyDecorators(
    ApiParam({
      name: 'productId',
      type: 'string',
      description: 'The unique identifier of the product.',
    }),
    ApiOperation({
      summary: 'Get all stocks for a specific product',
    }),
    ApiResponse({
      description: 'Returns all stocks for the specified product.',
      type: [SerializedStock],
    }),
    ApiNotFoundResponse({
      description: 'Product with the given ID was not found.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found with ID: ${productId}.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to fetch stocks for the product.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch stocks for the product.',
        },
      },
    })
  );
}
