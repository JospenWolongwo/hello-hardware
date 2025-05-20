import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import type { TokenPayload } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refreshToken') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
      jsonWebTokenOptions: { maxAge: process.env.REFRESH_TOKEN_EXPIRATION },
    });
  }
  private readonly logger = new Logger(RefreshTokenStrategy.name);
  async validate(req: Request, payload: TokenPayload) {
    try {
      const account = await this.authService.findByUserId(payload.sub);
      if (account?.id) {
        const refreshToken = req.headers.authorization?.split(' ')[1].trim();

        return refreshToken;
      }
      this.logger.error(
        { [this.validate.name]: { input: { payload } } },
        'Account with user_id: `%s` from payload does not exist',
        payload.sub
      );
      throw new BadRequestException();
    } catch (error) {
      this.logger.error(
        { [this.validate.name]: { input: { payload } } },
        `An error occurred when trying to find an account with user_id: '${
          payload.sub
        }'. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }
}
