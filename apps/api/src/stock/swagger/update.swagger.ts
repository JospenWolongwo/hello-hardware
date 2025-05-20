import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { SerializedStock } from '../types/serialized-stock.class';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a product stock',
      description: 'Update a product stock corresponding to the product id and stock unit.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'The id of the product stock to edit.',
      type: String,
    }),
    ApiParam({
      name: 'UpdateStockDto',
      required: true,
      description: 'Update the price or changes of a stock product.',
      type: UpdateStockDto,
    }),
    ApiOkResponse({
      description: 'The product stock was successfully updated.',
      type: SerializedStock,
    }),
    ApiConflictResponse({
      description: 'A product stock with the same unit already exist.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.CONFLICT,
          message: 'There is a product stock with the same unit.',
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
