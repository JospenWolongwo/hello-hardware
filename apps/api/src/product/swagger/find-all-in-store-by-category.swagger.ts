import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { ProductWithStock } from '../type/productWithStock.class';

export function ApiFindAllInStoreByCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all products found in a store category',
      description: 'Return all the products in a store category',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the store',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'categoryId',
      required: true,
      description: 'ID of the store category',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      type: [ProductWithStock],
      description: 'Successful operation.',
    }),
    ApiNotFoundResponse({
      description: 'Category was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category was not found.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal service error',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Internal service error',
        },
      },
    })
  );
}
