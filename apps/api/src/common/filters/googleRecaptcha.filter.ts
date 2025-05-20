import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { GoogleRecaptchaException } from '@nestlab/google-recaptcha';
import type { Response } from 'express';

@Catch(GoogleRecaptchaException)
export class GoogleRecaptchaFilter implements ExceptionFilter {
  catch(exception: GoogleRecaptchaException, host: ArgumentsHost): void {
    const res: Response = host.switchToHttp().getResponse();

    res.status(exception.getStatus()).send({
      type: 'GoogleRecaptchaError',
      message: exception.message,
    });
  }
}
