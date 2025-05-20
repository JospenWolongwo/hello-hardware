import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { SerializedUser } from '../types/serialized-user.class';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update your information as a user',
    }),
    ApiParam({
      name: 'updateUser',
      required: true,
      description: 'it must be at least one attribute.',
      type: UpdateUserDto,
    }),
    ApiOkResponse({
      description: 'The user was successfully updated',
      type: SerializedUser,
    }),
    ApiNotFoundResponse({
      description: 'Not found.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: "User with the Id: '${id}' not found.",
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
