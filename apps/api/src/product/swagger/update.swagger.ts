import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SerializedProduct } from '../type/serializedProduct.class';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a product',
      description: 'Update the product with the corresponding id or code bar.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID or Code bar of the product',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'updateProductDto',
      required: true,
      description: 'It product fields to update.',
      type: UpdateProductDto,
    }),
    ApiOkResponse({
      description: 'The product was successfully updated.',
      type: SerializedProduct,
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
