import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SerializedCartItem } from '../types/serializedCartItem.class';

export function ApiGetCartItems() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all cart items belonging to a logged in user',
    }),
    ApiOkResponse({
      type: [SerializedCartItem],
      description: "All the user's cart items were successfully retrieved",
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
