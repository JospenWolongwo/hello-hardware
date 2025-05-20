import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SerializedAddressEntity } from '../types/serializedAddressEntity.class';

export function ApiFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: "Find all user's addresses ",
      description: 'Return all the addresses',
    }),
    ApiOkResponse({
      description: 'Successful operation.',
      type: SerializedAddressEntity,
      isArray: true,
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
