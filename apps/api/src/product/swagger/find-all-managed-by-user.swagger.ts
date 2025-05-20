import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedProduct } from '../type/serializedProduct.class';

export function ApiFindAllManagedByUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all products managed by a user',
      description: 'Return all the products in all the stores managed by a user',
    }),
    ApiOkResponse({
      type: [SerializedProduct],
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
