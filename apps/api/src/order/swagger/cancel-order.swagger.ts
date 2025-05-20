import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function ApiCancelOrder() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancel order',
      description: 'Cancel an order.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the order',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'The order status was successfully cancelled.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.OK,
          message: 'Order has being cancelled',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Order with id: '${order_id}' does not exist.",
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
    })
  );
}
