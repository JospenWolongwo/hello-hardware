import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  private readonly logger = new Logger(LocalStrategy.name);
  async validate(email: string, password: string) {
    try {
      return await this.authService.authenticate(email, password);
    } catch (error) {
      if (error?.status) {
        throw error;
      }
      this.logger.error(
        { [this.validate.name]: { input: { email, password } } },
        `An error occurred when trying to authenticate. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }
}
