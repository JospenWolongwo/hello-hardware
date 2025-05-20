import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { SerializedOrder } from '../types/serialized-order.class';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change an order',
      description: 'Changes an order.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the order',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'updateOrderDto',
      required: true,
      description: 'It must a new order.',
      type: UpdateOrderDto,
    }),
    ApiOkResponse({
      description: 'The order was successfully changed.',
      type: SerializedOrder,
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
          { statusCode: HttpStatus.BAD_REQUEST, message: "Order with id: '${order_id}' does not exist." },
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
