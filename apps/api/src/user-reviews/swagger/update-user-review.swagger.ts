import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SerializedUserReview } from '../types/serialized-user-review.class';

export function ApiUpdateUserReview() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update an existing user review.',
      description: 'Update and return the updated user review',
    }),
    ApiOkResponse({
      description: 'User review updated successfully',
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
