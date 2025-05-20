import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../dto/permission.dto';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'createPermissionDto',
      required: true,
      description: 'It must be a new permission',
      type: CreatePermissionDto,
    }),
    ApiOperation({
      summary: 'Add a new permission',
    }),
    ApiCreatedResponse({
      type: Permission,
      description: 'The permission have been successfully created',
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
    ApiForbiddenResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
        },
      },
    })
  );
}
