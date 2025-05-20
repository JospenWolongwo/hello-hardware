import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SerializedOrder } from '../types/serialized-order.class';

export function ApiFindOneByUser() {
  return applyDecorators(
    ApiOperation({
      summary: "Find a user's order",
      description: 'Return an order placed by a user.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the order',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      type: SerializedOrder,
      description: 'Successful operation.',
    }),
    ApiNotFoundResponse({
      description: 'Order not found.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order was not found',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal service error',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Internal service error',
        },
      },
    })
  );
}
