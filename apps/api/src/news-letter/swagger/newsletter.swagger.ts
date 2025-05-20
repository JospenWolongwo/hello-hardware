import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiAddSubscriber() {
  return applyDecorators(
    ApiTags('Newsletter'),
    ApiOperation({ summary: 'Add a new subscriber to the newsletter' }),
    ApiResponse({
      status: 201,
      description: 'Subscriber successfully added',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request. Validation failed.',
    })
  );
}
