import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedUserReview } from '../types/serialized-user-review.class';

export function ApiFindUsersReviews() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a review per user.',
      description: 'Return all reviews each review per user',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: SerializedUserReview,
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
