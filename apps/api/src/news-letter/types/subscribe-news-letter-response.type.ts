export type SubscribeNewsletterResponse = {
  status: 'ok' | 'failed' | 'alreadyRegistered';
  message: string;
};
