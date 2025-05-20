import { Injectable } from '@nestjs/common';
import { MailjetService } from 'nest-mailjet/dist/mailjet.service';
import {
  accountActivationTemplate,
  invitationToStoreTemplate,
  quoteConfirmationTemplate,
  resetEmailTemplate,
  resetPasswordTemplate,
} from '../templates';
import type { templateName, templates } from '../types/template.type';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailjetService) {}
  private templates: templates = {
    accountActivation: accountActivationTemplate,
    resetEmail: resetEmailTemplate,
    resetPassword: resetPasswordTemplate,
    invitationToStore: invitationToStoreTemplate,
    quoteConfirmationTemplate: quoteConfirmationTemplate,
  };

  // eslint-disable-next-line max-params
  async actionMail(email: string, token: string, templateName: templateName, redirect?: string) {
    const template = this.templates[templateName];
    await this.mailService.send({
      Messages: [
        {
          From: {
            Name: process.env.MAIL_SENDER_NAME,
            Email: <string>process.env.MAIL_SENDER,
          },
          To: [
            {
              Email: email,
            },
          ],
          TextPart: template.text(token, redirect),
          HTMLPart: template.html(token, redirect),
          TemplateLanguage: true,
          Subject: template.subject,
        },
      ],
    });
  }

  async sendQuoteConfirmation(email: string, quoteId: string, companyName?: string) {
    const template = this.templates.quoteConfirmationTemplate;
    await this.mailService.send({
      Messages: [
        {
          From: {
            Name: process.env.HERMES_MAIL_SENDER_NAME,
            Email: <string>process.env.MAIL_SENDER,
          },
          To: [
            {
              Email: email,
            },
          ],
          TextPart: template.text(quoteId, companyName),
          HTMLPart: template.html(quoteId, companyName),
          TemplateLanguage: true,
          Subject: template.subject,
        },
      ],
    });
  }
}
