import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SerializedQuote } from '../types/serialized-quote.class';

export function ApiCreateQuote() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new quote.',
    }),
    ApiCreatedResponse({
      type: SerializedQuote,
      description: 'The quote was successfully created.',
    }),
    ApiConflictResponse({
      description: 'Quote already exists.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.CONFLICT,
          message: 'A quote with this ID already exists.',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized, if the user is not allowed to create quotes.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'You are not authorized to create a quote.',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid quote data provided.',
        },
      },
    }),
    ApiForbiddenResponse({
      description: "Forbidden, if you don't have the required permissions.",
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden resource.',
        },
      },
    })
  );
}
