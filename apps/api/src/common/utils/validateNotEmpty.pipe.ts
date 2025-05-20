import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

Injectable();
export class ValidateNotEmptyPipe implements PipeTransform {
  private readonly logger = new Logger(ValidateNotEmptyPipe.name);
  transform(value: any): any {
    if (!Object.keys(value).length) {
      this.logger.error(`At least, one parameter should not be empty`);
      throw new BadRequestException('At least, one parameter should not be empty');
    }

    return value;
  }
}
