import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { SerializedCartItem } from '../types/serializedCartItem.class';

export function ApiAddProduct() {
  return applyDecorators(
    ApiParam({
      name: 'addProductDto',
      required: true,
      description: 'The product stock Id and the quantity to be added to the cart.',
      type: CreateCartItemDto,
    }),
    ApiOperation({
      summary: 'Add a product to a login user cart, using the product stock Id and the quantity chosen',
    }),
    ApiCreatedResponse({
      type: [SerializedCartItem],
      description: "The product was successfully added as a user's cart item",
    }),
    ApiNotFoundResponse({
      description: 'The Product stock requested was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'The product stock does not exist.',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Quantity to add is more than in stock',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'The product ${productName} of SKU: ${keepingUnit} is out of stock.',
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
