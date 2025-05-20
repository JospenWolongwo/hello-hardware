import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SerializedStoreEntity } from '../type/serialized-store-entity.class';

export function ApiFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all stores',
      description: 'Return all the stores',
    }),
    ApiOkResponse({
      description: 'Successful operation.',
      type: [SerializedStoreEntity],
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
