import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiFind() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find product stocks managed by login user .',
      description: 'Return managed product stocks.',
    }),
    ApiParam({
      name: 'pname',
      required: false,
      description: 'Name of the product to filter stocks.',
      type: String,
    }),
    ApiParam({
      name: 'pid',
      required: false,
      description: 'ID of the product to filter stocks.',
      type: String,
    }),
    ApiOkResponse({
      type: [SerializedStock],
      description: 'Successful operation.',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized, if you are not a store user to the product.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'You are not a store user of this product.',
        },
      },
    }),
    ApiForbiddenResponse({
      description: "Forbidden, if you don't have the required permissions",
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden resource',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'An internal error occurred',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal service error',
        },
      },
    })
  );
}
