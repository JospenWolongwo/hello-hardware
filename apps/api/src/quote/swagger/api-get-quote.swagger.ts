import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SerializedQuote } from '../types/serialized-quote.class';

export function ApiGetQuoteById() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: 'Unique identifier for the quote.',
      type: String,
    }),
    ApiOperation({
      summary: 'Get a quote by ID.',
    }),
    ApiResponse({
      type: SerializedQuote,
      description: 'Quote retrieved successfully.',
    }),
    ApiNotFoundResponse({
      description: 'Quote not found.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Quote not found with the provided ID.',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized, if the user is not allowed to access this quote.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'You are not authorized to access this quote.',
        },
      },
    })
  );
}
