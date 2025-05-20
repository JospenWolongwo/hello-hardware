import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserPermissionDto } from '../dto/create-user-permission.dto';
import { SerializedUserPermissions } from '../types/serializedUserPermissions.class';

export function ApiAdd() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the user',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'AddUserPermissionDto',
      required: true,
      description: 'It is an array of unique permissions to add to a user.',
      type: CreateUserPermissionDto,
    }),
    ApiOperation({
      summary: 'Add permissions to a user',
    }),
    ApiCreatedResponse({
      description: 'The permissions were successfully added to the user',
      type: SerializedUserPermissions,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input.',
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
