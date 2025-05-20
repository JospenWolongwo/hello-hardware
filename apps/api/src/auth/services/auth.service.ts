/* eslint-disable max-lines */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { compareData, encodeData } from '../../common/utils/helpers.util';
import { EmailService } from '../../email/services/email.service';
import { StoreService } from '../../store/service/store.service';
import { UserService } from '../../user-management/service/user.service';
import type { RegisterDto, RegisterStoreUserDto } from '../dto';
import { Auth } from '../entities/auth.entity';
import type {
  AccountPayload,
  ActivationPayload,
  InvitationToStorePayload,
  ResetEmailPayload,
  TokenPayload,
} from '../types';

@Injectable()
export class AuthService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly storeService: StoreService
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async verifyAccessToken(token: string) {
    try {
      const tokenPayload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      })) as TokenPayload;

      return tokenPayload.sub;
    } catch (error) {
      this.logger.error(
        { [this.verifyAccessToken.name]: { input: { token: token } } },
        `Invalid token, Thrown Error: {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('Invalid token');
    }
  }

  async authenticate(email: string, password: string) {
    const accountExist = await this.authRepository.exist({ where: { email: email } });

    if (!accountExist) {
      this.logger.error(
        { [this.authenticate.name]: { input: { email: email, password: password } } },
        'Account with email:`%s` not found.',
        email
      );
      throw new UnauthorizedException('Access not granted');
    }

    const account = <Auth>(
      await this.authRepository.findOne({ where: { email: email, active: true }, relations: ['user'] })
    );

    if (account.active) {
      const validPassword = compareData(password, account.password);

      if (!validPassword) {
        this.logger.error(
          { [this.authenticate.name]: { input: { email: email, password: password } } },
          'Invalid password for account with id:`%s`.',
          account.id
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      return account.user;
    }
    this.logger.error(
      { [this.authenticate.name]: { input: { email: email, password: password } } },
      'Account with id:`%s` is not an active one.',
      account.id
    );
    throw new UnauthorizedException('Account not active');
  }

  async generateTokens(userId: string) {
    const accountExist = await this.authRepository.exist({ where: { user: { id: userId } } });
    if (!accountExist) {
      this.logger.error(
        { [this.generateTokens.name]: { input: { userId: userId } } },
        'Account with user_id:`%s`, does not exist.',
        userId
      );
      throw new BadRequestException('Invalid payload');
    }

    const signObject = { sub: userId };
    //generate the tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(signObject, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
      this.jwtService.signAsync(signObject, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }),
    ]);

    // save the refresh token and keep track of last_login time
    const hashedRefreshToken = encodeData(refreshToken);

    const account = await this.findByUserId(userId);

    await this.authRepository.update({ id: account?.id }, { refreshToken: hashedRefreshToken, lastLogin: new Date() });

    return { accessToken, refreshToken };
  }

  async login(userId: string) {
    try {
      const tokens = await this.generateTokens(userId);

      return tokens;
    } catch (error) {
      if (error?.status) {
        throw error;
      }
      this.logger.error(
        { [this.login.name]: { input: { userId: userId } } },
        `Internal error, was not able to generate tokens for the account with user_id: \`${userId}\`, Thrown Error: {${JSON.stringify(
          error
        )}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  async findByUserId(id: string) {
    return await this.authRepository.findOne({ where: { user: { id: id } } });
  }

  async findById(id: string) {
    return await this.authRepository.findOne({ where: { id: id } });
  }

  async findByEmail(email: string) {
    return await this.authRepository.findOne({ where: { email: email } });
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const tokenPayload = (await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })) as TokenPayload;

      const account = await this.findByUserId(tokenPayload.sub);

      if (account?.id) {
        if (account.refreshToken?.length) {
          const isRefreshTokenMatching = compareData(refreshToken, account.refreshToken);

          if (!isRefreshTokenMatching) {
            this.logger.error(
              { [this.createAccessTokenFromRefreshToken.name]: { input: { refreshToken: refreshToken } } },
              'The refreshToken provided does not match the one stored for the account with id: `%s`',
              account.id
            );
            throw new UnauthorizedException('Invalid Token');
          }

          const newAccessToken = await this.jwtService.signAsync(
            { sub: account.user.id },
            {
              secret: process.env.ACCESS_TOKEN_SECRET,
              expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
            }
          );

          return newAccessToken;
        }

        this.logger.error(
          { [this.createAccessTokenFromRefreshToken.name]: { input: { refreshToken: refreshToken } } },
          'The refresh token for the account with id:`%s` is not set.',
          account.id
        );
        throw new UnauthorizedException('Access Denied');
      }

      this.logger.error(
        { [this.createAccessTokenFromRefreshToken.name]: { input: { refreshToken: refreshToken } } },
        'The account with user_id:`%s`, gotten from the refresh token does not exist.',
        tokenPayload.sub
      );

      throw new NotFoundException('User does not exist');
    } catch {
      this.logger.error(
        { [this.createAccessTokenFromRefreshToken.name]: { input: { refreshToken: refreshToken } } },
        'Invalid refresh token provided.'
      );

      throw new UnauthorizedException('Invalid token');
    }
  }

  async register(registerDto: RegisterDto, redirect?: string) {
    const accountExist = await this.authRepository.exist({ where: { email: registerDto.email } });
    if (accountExist) {
      this.logger.error(
        { [this.register.name]: { input: { registerDto: registerDto } } },
        'Account with this email address, %s, already exist',
        registerDto.email
      );
      throw new ConflictException('Account with this email already exist');
    }
    const newAccount = this.authRepository.create({ ...registerDto });
    newAccount.user = await this.userService.create();

    await this.authRepository.save(newAccount);

    const activationToken = await this.jwtService.signAsync(
      { sub: newAccount.id },
      { secret: process.env.ACTIVATION_SECRET }
    );
    await this.emailService
      .actionMail(registerDto.email, activationToken, 'accountActivation', redirect)
      .catch((error) => {
        this.logger.error(
          { function: this.register.name, input: { registerDto: registerDto }, error: error },
          `Failed to send the account activation email.`
        );

        throw new InternalServerErrorException();
      });

    return newAccount;
  }

  async registerFromAccount(accountPayload: AccountPayload) {
    const accountExist = await this.authRepository.exist({ where: { email: accountPayload.email } });

    if (accountExist) {
      const account = <Auth>await this.authRepository.findOne({ where: { email: accountPayload.email } });

      if (!account.active) {
        await this.authRepository.update({ id: account.id }, { active: true });
      }

      return account.user.id;
    } else {
      const newAccount = this.authRepository.create({
        email: accountPayload.email,
        active: true,
      });

      const newUser = await this.userService.create();

      newUser.firstName = accountPayload.firstName;
      newUser.lastName = accountPayload.lastName;
      newAccount.user = newUser;

      const createdAccount = await this.authRepository.save(newAccount);

      return createdAccount.user.id;
    }
  }

  async registerStoreUser(registerStoreUserDto: RegisterStoreUserDto) {
    const accountExist = await this.authRepository.findOne({ where: { email: registerStoreUserDto.userEmail } });

    if (accountExist) {
      this.logger.error(
        { [this.registerStoreUser.name]: { input: { registerStoreUserDto: registerStoreUserDto } } },
        'Account with this email address, %s, already exist',
        registerStoreUserDto.userEmail
      );
      throw new ConflictException('Account with this email already exist');
    }

    const encodedPassword = encodeData(registerStoreUserDto.password);

    const newAccount = this.authRepository.create({
      email: registerStoreUserDto.userEmail,
      password: encodedPassword,
      active: true,
    });

    newAccount.user = await this.userService.create();

    await this.authRepository.save(newAccount);

    const inviter = await this.userService.findById(registerStoreUserDto.inviter);

    await this.storeService.assignUserToStore(newAccount.user, inviter, registerStoreUserDto.store);

    return newAccount;
  }

  async activateAccount(token: string) {
    const payload = <ActivationPayload>(
      await this.jwtService.verifyAsync(token, { secret: process.env.ACTIVATION_SECRET })
    );
    if (payload?.sub) {
      const accountExist = await this.authRepository.exist({ where: { id: payload.sub } });
      if (!accountExist) {
        this.logger.error(
          { [this.activateAccount.name]: { input: { token: token } } },
          'Account with id: `%s`, from the activation token payload does not exist.',
          payload.sub
        );
        throw new BadRequestException('Invalid token');
      }
      await this.authRepository.update({ id: payload.sub }, { active: true });
    } else {
      this.logger.error({ [this.activateAccount.name]: { input: { token: token } } }, 'Invalid activation token');
      throw new BadRequestException('Invalid token');
    }
  }

  async resetEmail(id: string, email: string) {
    const accountExist = await this.authRepository.exist({ where: { id: id, active: false, password: Not(IsNull()) } });
    if (accountExist) {
      await this.authRepository.update({ id: id }, { email: email, active: true });
    } else {
      this.logger.error(
        { [this.resetEmail.name]: { input: { id: id, email: email } } },
        `Inactive account with id:\`${id}\`, which does not use an authenticator, does not exist.`
      );
      throw new NotFoundException('Inactive account, using no authenticator does not exist');
    }
  }

  async sendResetEmailEmail(oldEmail: string, newEmail: string, redirect?: string) {
    const account = await this.authRepository.findOne({ where: { email: oldEmail, active: true } });

    if (account?.id) {
      if (account.password) {
        const resetEmailToken = await this.jwtService.signAsync(
          { sub: account.id, newEmail: newEmail },
          { secret: process.env.RESET_EMAIL_SECRET, expiresIn: process.env.RESET_EMAIL_EXPIRATION }
        );
        await this.authRepository.update({ id: account.id }, { active: false });
        await this.emailService.actionMail(newEmail, resetEmailToken, 'resetEmail', redirect).catch((error) => {
          this.logger.error(
            {
              function: this.sendResetEmailEmail.name,
              input: { newEmail: newEmail, oldEmail: oldEmail },
              error: error,
            },
            `Failed to send the reset email email.`
          );

          throw new InternalServerErrorException();
        });
      } else {
        this.logger.error(
          { [this.sendResetEmailEmail.name]: { input: { oldEmail: oldEmail, newEmail: newEmail } } },
          `Account with email:\`${oldEmail}\`, has used an authenticator, email can not be reset.`
        );
        throw new UnauthorizedException('Account using an authenticator');
      }
    } else {
      this.logger.error(
        { [this.sendResetEmailEmail.name]: { input: { oldEmail: oldEmail, newEmail: newEmail } } },
        `Account with email:\`${oldEmail}\`, does not exist.`
      );
      throw new NotFoundException('Active account, using no authenticator does not exist');
    }
  }

  async resetPassword(id: string, password: string) {
    const account = await this.authRepository.findOne({ where: { id: id, active: true, password: Not(IsNull()) } });
    if (account?.id) {
      const match = compareData(password, account.password);
      if (match) {
        this.logger.error(
          { [this.resetPassword.name]: { input: { id, password } } },
          `Active account with id:\`${id}\`, old password used to reset the password.`
        );
        throw new ConflictException('Same password was used');
      }
      const encodedPassword = encodeData(password);
      await this.authRepository.update({ id: id }, { password: encodedPassword });
    } else {
      this.logger.error(
        { [this.resetPassword.name]: { input: { id, password } } },
        `Active account with id:\`${id}\`, which does not use an authenticator, does not exist.`
      );
      throw new NotFoundException('Active account, using no authenticator does not exist');
    }
  }

  async sendResetPasswordEmail(email: string, redirect?: string) {
    const account = await this.authRepository.findOne({ where: { email: email, active: true } });

    if (account?.id) {
      if (account.password) {
        const resetPasswordToken = await this.jwtService.signAsync(
          { sub: account.id },
          { secret: process.env.RESET_PASSWORD_SECRET, expiresIn: process.env.RESET_PASSWORD_EXPIRATION }
        );

        await this.emailService.actionMail(email, resetPasswordToken, 'resetPassword', redirect).catch((error) => {
          this.logger.error(
            { function: this.sendResetPasswordEmail.name, input: { email: email }, error: error },
            `Failed to send the reset password email.`
          );

          throw new InternalServerErrorException();
        });
      } else {
        this.logger.error(
          { [this.sendResetPasswordEmail.name]: { input: { email } } },
          `Account with email:\`${email}\`, has used an authenticator, password can not be reset.`
        );
        throw new UnauthorizedException('Account using an authenticator');
      }
    } else {
      this.logger.error(
        { [this.sendResetPasswordEmail.name]: { input: { email } } },
        `Account with email:\`${email}\`, does not exist.`
      );
      throw new NotFoundException('Active account does not exist');
    }
  }

  async verifyResetEmailToken(token: string) {
    const payload = <ResetEmailPayload>(
      await this.jwtService.verifyAsync(token, { secret: process.env.RESET_EMAIL_SECRET })
    );

    if (payload?.sub) {
      const account = await this.authRepository.findOne({
        where: { id: payload.sub, active: false, password: Not(IsNull()) },
      });
      if (account?.id) {
        return payload;
      }
    }
    this.logger.error({ [this.verifyResetEmailToken.name]: { input: { token } } }, `Invalid reset password token`);
    throw new BadRequestException('Invalid token');
  }

  async verifyResetPasswordToken(token: string) {
    const payload = <TokenPayload>(
      await this.jwtService.verifyAsync(token, { secret: process.env.RESET_PASSWORD_SECRET })
    );

    if (payload?.sub) {
      const account = await this.authRepository.findOne({
        where: { id: payload.sub, password: Not(IsNull()) },
      });
      if (account?.id) {
        return payload;
      }
    }
    this.logger.error({ [this.verifyResetEmailToken.name]: { input: { token } } }, `Invalid reset password token`);
    throw new BadRequestException('Invalid token');
  }

  async verifyInvitationToStoreToken(token: string) {
    const payload = <InvitationToStorePayload>(
      await this.jwtService.verifyAsync(token, { secret: process.env.INVITATION_TO_STORE_SECRET })
    );

    if (payload.inviter) {
      const storeExist = await this.storeService.findOne(payload.inviter, payload.store);

      if (storeExist?.id) {
        const userExist = await this.userService.findByEmail(payload.userEmail);

        if (userExist?.id) {
          const inviter = await this.userService.findById(payload.inviter);

          await this.storeService.assignUserToStore(userExist, inviter, payload.store);

          return { ...payload, storeName: storeExist.name, exist: true };
        }

        return { ...payload, storeName: storeExist.name, exist: false };
      }
    }
    this.logger.error(
      { [this.verifyInvitationToStoreToken.name]: { input: { token } } },
      `Invalid invitation to store token`
    );
    throw new BadRequestException('Invalid token');
  }
}
