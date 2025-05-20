import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FindByStoreDto } from '../dto/find-by-store.dto';
import { SerializedStoreUser } from '../types/serialized-store-user';

export function ApiFindAllByStore() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all users working in your stores',
      description: 'Return the users to a particular store.',
    }),
    ApiParam({
      name: 'findByStoreDto',
      type: FindByStoreDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: [SerializedStoreUser],
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
