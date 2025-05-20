import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedCategory } from '../types/serializedCategory.class';

export function ApiFindAllManagedByUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all categories in stores managed by login user',
      description: 'Return all the login user categories, he manages',
    }),
    ApiOkResponse({
      description: 'Successful operation.',
      type: [SerializedCategory],
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          invalidToken: {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized access',
          },
          unauthorizedUser: {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'You are not an active store user to this store.',
          },
        },
      },
    })
  );
}
