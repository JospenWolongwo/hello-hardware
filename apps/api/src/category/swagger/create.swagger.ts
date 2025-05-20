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

export function ApiCreateCategory() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: 'The ID of the store to which the category is added',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'createCategoryDto',
      required: true,
      description: 'These are the required information to add a category to a store',
      type: CreateCategoryDto,
    }),
    ApiOperation({
      summary: 'Add a new category to a store',
    }),
    ApiCreatedResponse({
      type: SerializedCategory,
      description: 'The category was successfully created',
    }),
    ApiConflictResponse({
      description: 'The category to create already exist',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.CONFLICT,
          message: 'The category ${categoryName} already exist',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'The user that wants to create a category was not found',
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
