import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import type { AccountInfo, TokenPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(private readonly authService: AuthService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jsonWebTokenOptions: { maxAge: process.env.ACCESS_TOKEN_EXPIRATION },
    });
  }

  private readonly logger = new Logger(AccessTokenStrategy.name);

  async validate(payload: TokenPayload) {
    try {
      // get account information from cache store
      const storedAccountInfo = <AccountInfo>await this.cacheManager.get(payload.sub);

      // return the account information if it exist
      if (storedAccountInfo?.uid) {
        return storedAccountInfo;
      } else {
        // get the account information from the database, if nothing is found in the cache.
        const account = await this.authService.findByUserId(payload.sub);

        if (account?.id) {
          const accountInfo = <AccountInfo>{
            uid: account.user.id,
            createdAt: account.createdAt,
            lastLogin: account.lastLogin,
            permissions: account.user.permissions.permissions,
          };

          /* 
             The amount of time the account information is going to be keep in cache 
             in milliseconds based on the expiration time of the access token.
          */
          const expiration = payload.exp * 1000 - new Date().getTime();

          // Cache the account information for subsequent validation of the access token.
          await this.cacheManager.set(payload.sub, accountInfo, expiration);

          return accountInfo;
        }

        this.logger.error(
          { [this.validate.name]: { input: { payload } } },
          'Account with user_id: `%s` from payload does not exist',
          payload.sub
        );

        throw new BadRequestException();
      }
    } catch (error) {
      this.logger.error(
        { [this.validate.name]: { input: { payload }, error: error } },
        `An error occurred when trying to get user's information. Thrown Error : {${JSON.stringify(error)}}`
      );

      throw new UnauthorizedException('Unauthorized access');
    }
  }
}
