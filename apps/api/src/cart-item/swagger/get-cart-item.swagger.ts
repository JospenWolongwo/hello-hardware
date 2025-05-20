import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SerializedCartItem } from '../types/serializedCartItem.class';

export function ApiGetCartItem() {
  return applyDecorators(
    ApiParam({
      name: 'stockId',
      required: true,
      description: 'The product stock ID of the cart item to get.',
      type: String,
      format: 'uuid',
    }),
    ApiOperation({
      summary: "Get a logged in user's cart item of a particular product stock id",
    }),
    ApiOkResponse({
      type: SerializedCartItem,
      description: "The user's cart item associated to the stock ID was successfully retrieved",
    }),
    ApiNotFoundResponse({
      description: 'The logged in user Cart Item associated to the stock ID was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'The cart item was not found.',
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
