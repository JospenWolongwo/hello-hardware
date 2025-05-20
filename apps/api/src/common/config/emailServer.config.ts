import type { MailjetModuleOptions } from 'nest-mailjet/dist/interfaces/mailjet-module-options.interface';

export const emailServerConfig = (): MailjetModuleOptions => ({
  apiKey: process.env.MAIL_API_KEY,
  apiSecret: process.env.MAIL_API_SECRET,
});
