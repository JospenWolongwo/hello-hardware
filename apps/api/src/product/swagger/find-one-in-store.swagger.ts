import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductWithStock } from '../type/productWithStock.class';

export function ApiFindOneInStore() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find one product found in a store',
      description: 'Return the product in a store',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the store',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'pid',
      required: true,
      description: 'ID of the store product',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      type: ProductWithStock,
      description: 'Successful operation.',
    }),
    ApiNotFoundResponse({
      description: 'Product was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product was not found.',
        },
      },
    })
  );
}
