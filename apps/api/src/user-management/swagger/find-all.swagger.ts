import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedUser } from '../types/serialized-user.class';

export function ApiFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all users.',
      description: 'Return all users',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: SerializedUser,
      isArray: true,
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
