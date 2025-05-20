import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { SerializedOrder } from '../types/serialized-order.class';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'createOrderDto',
      required: true,
      description: 'It must be a new order',
      type: CreateOrderDto,
    }),
    ApiOperation({
      summary: 'Create an order for a user.',
    }),
    ApiCreatedResponse({
      type: SerializedOrder,
      description: 'The order was successfully created.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        examples: [
          { statusCode: HttpStatus.BAD_REQUEST, message: 'items should have unique values' },
          { statusCode: HttpStatus.BAD_REQUEST, message: 'items should not be empty' },
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: [
              'items.index.quantity must be a positive number',
              'items.index.quantity must be an integer number',
              'items.index.quantity should not be empty',
            ],
            error: 'Bad Request',
          },
        ],
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
    })
  );
}
