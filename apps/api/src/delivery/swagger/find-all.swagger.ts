import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SerializedDelivery } from '../types/serialized-delivery.class';

export function ApiFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Gets all order items deliveries.',
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
