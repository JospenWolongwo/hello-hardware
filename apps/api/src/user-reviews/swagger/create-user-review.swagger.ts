import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedUserReview } from '../types/serialized-user-review.class';

export function ApiCreateUserReview() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user review.',
      description: 'Create and return the newly created user review',
    }),
    ApiCreatedResponse({
      description: 'User review created successfully',
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
    ApiBadRequestResponse({
      description: 'Invalid input',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input',
        },
      },
    })
  );
}
