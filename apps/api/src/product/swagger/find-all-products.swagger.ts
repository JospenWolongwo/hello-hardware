import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SerializedProduct } from '../type/serializedProduct.class';
export function ApiGetAllProducts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve a list of all products with optional pagination.',
    }),
    ApiQuery({
      name: 'limit',
      type: 'string',
      description: 'The maximum number of products to return. If not provided, all products will be returned.',
      required: false,
    }),
    ApiResponse({
      description: 'Returns a list of all products.',
      type: [SerializedProduct],
    }),
    ApiInternalServerErrorResponse({
      description: 'Failed to retrieve the list of products.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred when retrieving all products.',
        },
      },
    })
  );
}
