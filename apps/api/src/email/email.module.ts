import type { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MailjetModule } from 'nest-mailjet';
import { emailServerConfig } from '../common/config';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    MailjetModule.registerAsync({
      useFactory: async () => emailServerConfig(),
    }) as DynamicModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
