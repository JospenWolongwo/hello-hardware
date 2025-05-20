import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChangeStockQuantityDto } from '../dto/change-stock-quantity.dto';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiChangeQuantity() {
  return applyDecorators(
    ApiParam({
      name: 'ChangeStockQuantityDto',
      required: true,
      description: 'It must be an existing stock.',
      type: ChangeStockQuantityDto,
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'The id of the product stock to edit.',
      type: String,
    }),
    ApiOperation({
      summary: 'Change the quantity of a product stock.',
    }),
    ApiOkResponse({
      type: SerializedStock,
      description: 'The product stock quantity was successfully changed.',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized, if you are not a store user to the product.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'You are not a store user of this product.',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Product stock not found.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'This product stock does not exist.',
        },
      },
    }),
    ApiForbiddenResponse({
      description: "Forbidden, if you don't have the required permissions",
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Forbidden resource',
        },
      },
    })
  );
}
