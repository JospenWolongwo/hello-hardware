import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }
  private readonly logger = new Logger(GoogleStrategy.name);

  // eslint-disable-next-line max-params
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    const { name, emails, photos } = profile;

    if (!emails?.length) {
      throw new Error('Google profile is missing email information');
    }

    const googlePayload = {
      email: emails[0].value,
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
      picture: photos?.[0]?.value ?? '',
    };

    try {
      const user = await this.authService.registerFromAccount(googlePayload);
      done(null, user);
    } catch (error) {
      this.logger.error(
        { [this.validate.name]: { input: { googlePayload } } },
        `An error occurred when trying to register an account using Google authenticator'. Thrown Error : {${JSON.stringify(
          error
        )}}`
      );
      done(new InternalServerErrorException('internal error'), false);
    }
  }
}
