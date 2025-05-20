import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SerializedProduct } from '../type/serializedProduct.class';

export function ApiFindOneByUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a product managed by a user',
      description: 'Return the product with the corresponding id or code bar.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID or Code bar of the product',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      type: SerializedProduct,
      description: 'Successful operation.',
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
