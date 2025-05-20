import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedUserReview } from '../types/serialized-user-review.class';

export function ApiFindOneUserReview() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a user review by ID.',
      description: 'Return a single user review by ID',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: SerializedUserReview,
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
      description: 'User review not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User review not found',
        },
      },
    })
  );
}
