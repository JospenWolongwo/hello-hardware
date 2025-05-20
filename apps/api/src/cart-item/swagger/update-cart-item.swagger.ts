import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { SerializedCartItem } from '../types/serializedCartItem.class';

export function ApiUpdateCartItem() {
  return applyDecorators(
    ApiParam({
      name: 'stockId',
      required: true,
      description: 'The ID of the product stock to update in the cart.',
      schema: {
        type: 'string',
        format: 'uuid',
        example: '5f6b7c8a-d9a2-46d8-b9b9-e2fbc5b9b4d1',
      },
    }),
    ApiBody({
      description: 'The updated quantity of the cart item.',
      type: CreateCartItemDto,
    }),
    ApiOperation({
      summary: 'Update the quantity of an existing product in the user’s cart.',
    }),
    ApiOkResponse({
      type: SerializedCartItem,
      description: 'The cart item was successfully updated.',
    }),
    ApiNotFoundResponse({
      description: 'The product stock was not found in the user’s cart.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Cart item not found.',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'The quantity must be greater than zero or insufficient stock.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Quantity must be greater than zero or insufficient stock available.',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Unauthorized access.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access.',
        },
      },
    })
  );
}
