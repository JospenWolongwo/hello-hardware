import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LikeProductStockDto } from '../dto';

export function ApiLikeProductStock() {
  return applyDecorators(
    ApiOperation({
      summary: 'Like or unlike a product stock',
      description: 'Like or unlike a product product stock',
    }),
    ApiParam({
      name: 'likeProductStockDto',
      type: LikeProductStockDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Successful operation',
    }),
    ApiNotFoundResponse({
      description: 'Stock or user was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Stock/User was not found.',
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
