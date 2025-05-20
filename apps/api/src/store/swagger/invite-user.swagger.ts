import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SendInvitationDto } from '../dto/sendInvitation.dto';

export function ApiInviteUser() {
  return applyDecorators(
    ApiParam({
      name: 'sendInvitationDto',
      required: true,
      description: 'Contains the user email address and the name of the store to which he is invited.',
      type: SendInvitationDto,
    }),
    ApiOperation({
      summary: 'Send an email invitation to a user to a store.',
    }),
    ApiAcceptedResponse({
      description: 'Invitation successfully sent.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Invitation to the ${store} store was successfully send to: ${email}',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "The store with name: '${store}', belonging to you does not exist.",
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
    }),
    ApiConflictResponse({
      description: 'Conflict',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.CONFLICT,
          message: "The user with email: '${email}', is already assign to the store with name: ${store}",
        },
      },
    })
  );
}
