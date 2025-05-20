import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateAddressDto } from '../dto/update-address.dto';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: "Update a user's address",
    }),
    ApiParam({
      name: 'uid',
      required: true,
      description: 'The ID of the user',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'The ID of the address',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'updateAddress',
      required: true,
      description: 'The new address object',
      type: UpdateAddressDto,
    }),
    ApiOkResponse({
      description: 'The address was successfully updated',
      type: UpdateAddressDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid Input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Input.',
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
