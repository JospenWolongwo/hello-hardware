import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiGetStocksByProductIds() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get stocks by multiple product IDs',
      description: 'Retrieves stocks for multiple products based on their IDs',
    }),
    ApiQuery({
      name: 'productIds',
      type: String,
      isArray: true,
      required: true,
      description: 'Comma-separated list of product IDs',
    }),
    ApiResponse({
      description: 'Returns stocks for the specified products.',
      type: [SerializedStock],
    }),
    ApiResponse({
      description: 'Invalid product ID format.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid product ID format.',
          error: 'Bad Request',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to fetch stocks for the products.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch stocks for the products.',
        },
      },
    })
  );
}
