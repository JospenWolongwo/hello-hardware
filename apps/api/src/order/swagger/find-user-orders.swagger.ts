import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SerializedOrder } from '../types/serialized-order.class';

export function ApiFindByUser() {
  return applyDecorators(
    ApiOperation({
      summary: "Find user's orders",
      description: 'Return orders placed by a user.',
    }),
    ApiOkResponse({
      type: [SerializedOrder],
      description: 'Successful operation.',
    }),
    ApiForbiddenResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
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
