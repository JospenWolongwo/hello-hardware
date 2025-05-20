import type { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { GoogleRecaptchaNetwork } from '@nestlab/google-recaptcha';

export const googleRecaptchaConfig = (): GoogleRecaptchaModuleOptions => ({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  response: (req) => req.body['g-recaptcha-response'],
  network: GoogleRecaptchaNetwork.Recaptcha,
  debug: true,
});
