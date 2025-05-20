import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { SerializedCategory } from '../types/serializedCategory.class';

export function ApiCreateSubCategory() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: 'The ID of the store to which the sub-category is added',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'categoryId',
      required: true,
      description: 'The ID of the parent category to which we add a sub-category',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'createStoreDto',
      required: true,
      description: 'It must be new sub-category',
      type: CreateCategoryDto,
    }),
    ApiOperation({
      summary: 'Add a new sub-category to a parent-category of a store',
    }),
    ApiCreatedResponse({
      type: SerializedCategory,
      description: 'The sub-category was successfully created',
    }),
    ApiConflictResponse({
      description: 'The sub-category to create already exist',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.CONFLICT,
          message: 'The sub-category ${categoryName} already exist',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'The user that wants to create a category or the parent category was not found',
      schema: {
        type: 'object',
        examples: {
          userNotFound: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User was not found',
          },
          parentCategoryNotFound: {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'The parent category was not found',
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
      description: 'There was an internal error while creating a category',
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
