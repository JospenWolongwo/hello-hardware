import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateAddressDto } from '../dto/create-address.dto';

export function ApiFindOne() {
  return applyDecorators(
    ApiOperation({
      summary: "Find a user's address",
      description: 'Return a single address',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the address',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: CreateAddressDto,
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
      description: 'UnauthorizedException',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'UnauthorizedException',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Address was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Address was not found',
        },
      },
    })
  );
}
