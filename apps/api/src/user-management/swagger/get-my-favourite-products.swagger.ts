import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedProduct } from '../../product/type/serializedProduct.class';

export function ApiGetMyFavouriteProducts() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get your favourite product list.',
      description: 'Return a list of products liked by you',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: [SerializedProduct],
    }),
    ApiNotFoundResponse({
      description: 'User was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User was not found',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
        },
      },
    })
  );
}
