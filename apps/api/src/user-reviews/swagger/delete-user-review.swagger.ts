import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiDeleteUserReview() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a user review by ID.',
      description: 'Delete a single user review by ID',
    }),
    ApiNoContentResponse({
      description: 'User review deleted successfully',
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
