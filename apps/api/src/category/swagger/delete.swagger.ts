import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a store category',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'The ID of the store',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'categoryId',
      required: true,
      description: 'The ID of the store category',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'The category was successfully deleted',
      schema: {
        type: 'object',
        example: { message: 'The category and its subcategories were deleted successfully', statusCode: HttpStatus.OK },
      },
    }),
    ApiNotFoundResponse({
      description: 'The user that wants to delete a category was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User was not found',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          invalidToken: {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized access',
          },
          unauthorizedUser: {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'You are not an active store user to this store.',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'There was an internal error while deleting a category',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal error',
        },
      },
    })
  );
}
