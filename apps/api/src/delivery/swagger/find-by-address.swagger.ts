import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SerializedDelivery } from '../types/serialized-delivery.class';

export function ApiFindByAddress() {
  return applyDecorators(
    ApiOperation({
      summary: 'Gets all order items deliveries by address Id.',
    }),
    ApiParam({
      name: 'addressId',
      required: true,
      description: 'ID of the delivery address',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      type: [SerializedDelivery],
      description: 'The deliveries found.',
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
