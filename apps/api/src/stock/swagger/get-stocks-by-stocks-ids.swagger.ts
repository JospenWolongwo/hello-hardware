import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiGetStocksByStockIds() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get stocks by multiple stock IDs',
      description: 'Retrieves stocks for multiple stock IDs',
    }),
    ApiQuery({
      name: 'stockIds',
      type: String,
      isArray: true,
      required: true,
      description: 'Comma-separated list of stock IDs',
    }),
    ApiResponse({
      description: 'Returns stocks for the specified stock IDs.',
      type: [SerializedStock],
    }),
    ApiResponse({
      description: 'Invalid stock ID format.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid stock ID format.',
          error: 'Bad Request',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to fetch stocks for the stock IDs.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch stocks for the stock IDs.',
        },
      },
    })
  );
}
