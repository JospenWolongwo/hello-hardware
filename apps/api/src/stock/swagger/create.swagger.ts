import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateStockDto } from '../dto/create-stock.dto';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'createStockDto',
      required: true,
      description: 'It must be a new product stock.',
      type: CreateStockDto,
    }),
    ApiOperation({
      summary: 'create a product stock with unique Stock Keeping Unit(SKU).',
    }),
    ApiCreatedResponse({
      type: SerializedStock,
      description: 'The product stock was successfully created.',
    }),
    ApiConflictResponse({
      description: 'Product stock already exist.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.CONFLICT,
          message: "This stock already exist with id: '${stock_id}'.",
        },
      },
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
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Product was not found.',
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
