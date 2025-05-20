import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductWithStock } from '../type/productWithStock.class';

export function ApiFindAllInStore() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all products found in a store',
      description: 'Return all the products in a store',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the store',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      type: [ProductWithStock],
      description: 'Successful operation.',
    })
  );
}
