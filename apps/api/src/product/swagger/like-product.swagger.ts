import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LikeProductDto } from '../dto/like-product.dto';

export function ApiLike() {
  return applyDecorators(
    ApiOperation({
      summary: 'Like or unlike product',
      description: 'Like or unlike a product',
    }),
    ApiParam({
      name: 'likeProductDto',
      type: LikeProductDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Successful operation',
    }),
    ApiNotFoundResponse({
      description: 'Product or user was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product/User was not found.',
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
