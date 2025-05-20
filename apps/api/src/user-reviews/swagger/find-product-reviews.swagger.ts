import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedUserReview } from '../types/serialized-user-review.class';

export function ApiFindReviewsByProductId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve all reviews for a specific product by its ID.',
      description: 'Fetch and return all reviews associated with a particular product identified by its ID.',
    }),
    ApiOkResponse({
      description: 'Product reviews retrieved successfully',
      type: [SerializedUserReview],
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
      description: 'No reviews found for the product',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No reviews found for the product with the provided ID',
        },
      },
    })
  );
}
