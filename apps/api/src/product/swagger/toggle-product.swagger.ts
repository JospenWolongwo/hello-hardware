import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ToggleProductDto } from '../dto/toggle-product.dto';

export function ApiToggle() {
  return applyDecorators(
    ApiOperation({
      summary: 'Activate or de-active products',
      description: 'Activate or de-active the products of a store',
    }),
    ApiParam({
      name: 'toggleProductDto',
      type: ToggleProductDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Successful operation',
      schema: {
        type: 'object',
        example: { message: 'Product(s) activated/de-activated successfully', statusCode: HttpStatus.OK },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access or user is not an active store user',
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
