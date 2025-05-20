import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateProductDto } from '../dto/create-product.dto';
import { SerializedProduct } from '../type/serializedProduct.class';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'createProductDto',
      required: true,
      description: 'It must be a new product to a store',
      type: CreateProductDto,
    }),
    ApiOperation({
      summary: "Add a new product to a user's store",
    }),
    ApiCreatedResponse({
      type: SerializedProduct,
      description: 'The product was successfully added.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
        },
      },
    })
  );
}
