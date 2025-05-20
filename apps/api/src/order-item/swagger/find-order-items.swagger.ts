import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SerializedOrderItem } from '../types/serialized-order-item.class';

export function ApiFindOrderItems() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find order items. Results can be filtered by store and product name',
      description: 'Return order items of orders to a user store, which can be filtered by store and product name.',
    }),
    ApiParam({
      name: 'store',
      required: false,
      description: 'Name of the store where an item was ordered',
      type: String,
    }),
    ApiParam({
      name: 'product',
      required: false,
      description: 'Name of product in the order.',
      type: String,
    }),
    ApiOkResponse({
      type: [SerializedOrderItem],
      description: 'Successful operation.',
    }),
    ApiUnauthorizedResponse({
      description: 'You are not a store user.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'You are not a user to a store user',
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
