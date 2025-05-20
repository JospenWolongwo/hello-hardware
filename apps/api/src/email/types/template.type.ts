export type template = {
  subject: string;
  text: (...args: any[]) => string;
  html: (...args: any[]) => string;
};

export type templates = {
  accountActivation: template;
  resetEmail: template;
  resetPassword: template;
  invitationToStore: template;
  quoteConfirmationTemplate: template;
};

export type templateName =
  | 'accountActivation'
  | 'resetEmail'
  | 'resetPassword'
  | 'invitationToStore'
  | 'quoteConfirmationTemplate';
