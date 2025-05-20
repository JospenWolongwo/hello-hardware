import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedUser } from '../types/serialized-user.class';

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get your information as a user.',
      description: 'Return your information',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: SerializedUser,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'UnauthorizedException',
        },
      },
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
    })
  );
}
