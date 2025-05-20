import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  PartialType,
} from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { SerializedCategory } from '../types/serializedCategory.class';

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a store category',
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
    ApiParam({
      name: 'updateCategory',
      required: true,
      description: 'The values to update the category',
      type: PartialType(CreateCategoryDto),
    }),
    ApiOkResponse({
      description: 'The category was successfully updated',
      type: SerializedCategory,
    }),
    ApiNotFoundResponse({
      description: 'The user that wants to update a category or the category was not found',
      schema: {
        type: 'object',
        examples: {
          userNotFound: {
            message: 'User was not found',
          },
          categoryNotFound: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Category was not found',
          },
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
    ApiBadRequestResponse({
      description: 'Invalid input were provided',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'There was an internal error while updating a category',
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
