/* eslint-disable max-lines */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Csrf } from 'ncsrf';
import {
  completeProfileContext,
  forgotPasswordContext,
  invitationToStoreContext,
  loginContext,
  MAIN_URL,
  resetEmailContext,
  resetPasswordContext,
  signupContext,
} from '../../common/utils/hbs.context';
import { timeToMilliSeconds } from '../../common/utils/helpers.util';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { UpdateUserDto } from '../../user-management/dto';
import type { UserEntity } from '../../user-management/entities/user.entity';
import { UserService } from '../../user-management/service/user.service';
import { QueryRequired } from '../decorators/queryRequired.decorator';
import { ForgotPasswordDto, ResetEmailDto, ResetPasswordDto, SignUpDto, SignUpStoreUserDto } from '../dto';
import type { Auth } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';
import type { AccountInfo } from '../types';
import { Multer } from 'multer';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  private readonly logger = new Logger(AuthController.name);

  private redirectUrl(redirect: string) {
    const split = redirect.split(<string>process.env.CLIENT_DELIMITER);

    const clients: Record<string, string> = JSON.parse(<string>process.env.CLIENTS);

    if (split.length === 2) {
      if (split[0] in clients) {
        return clients[split[0]] + split[1];
      }
    }

    return null;
  }

  private setTokenCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    return res
      .cookie('BAL_ess', tokens.accessToken, {
        maxAge: timeToMilliSeconds(<string>process.env.ACCESS_TOKEN_EXPIRATION, 'd'),
      })
      .cookie('BAL_esh', tokens.refreshToken, {
        maxAge: timeToMilliSeconds(<string>process.env.REFRESH_TOKEN_EXPIRATION, 'd'),
      });
  }

  @Get('login')
  signInPage(
    @Query('redirect') redirect: string,
    @Req() req: Request & { csrfToken: () => string },
    @Res() res: Response
  ) {
    if (redirect !== undefined) {
      res = res.cookie('redirect', redirect);
    }

    return res
      .setHeader('csrf-token', req.csrfToken())
      .render('login', { ...loginContext(redirect), csrf: req.csrfToken() });
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // google authentication
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get('profile')
  getProfile(@Req() req: Request) {
    return <AccountInfo>req.user;
  }

  @UseGuards(AuthGuard('refreshToken'))
  @Get('refresh')
  async getRefreshToken(@Req() req: Request) {
    const refreshToken = <string>req.user;
    const accessToken = await this.authService.createAccessTokenFromRefreshToken(refreshToken);

    return { accessToken };
  }

  @Get('forgot-password')
  forgotPasswordPage(
    @Query('redirect') redirect: string,
    @Req() req: Request & { csrfToken: () => string },
    @Res() res: Response
  ) {
    if (redirect !== undefined) {
      res = res.cookie('redirect', redirect);
    }

    return res
      .setHeader('csrf-token', req.csrfToken())
      .render('forgotPassword', { ...forgotPasswordContext(redirect), csrf: req.csrfToken() });
  }

  @Get('login/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthenticationCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const tokens = await this.authService.login(<string>req.user);

      const redirect = <string>req.cookies['redirect'];

      if (redirect?.length) {
        const redirectUrl = this.redirectUrl(redirect);

        if (redirectUrl?.length) {
          res = this.setTokenCookies(res, tokens);

          res.clearCookie('redirect').redirect(redirectUrl);
        }
      }

      return res.status(HttpStatus.OK).send(tokens);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: 'googleAuthenticationCallback', input: { id: req.user }, method: 'GET' },
        `An error occurred when trying to login. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Get('signup')
  signUpPage(
    @Query('redirect') redirect: string,
    @Req() req: Request & { csrfToken: () => string },
    @Res() res: Response
  ) {
    if (redirect !== undefined) {
      res = res.cookie('redirect', redirect);
    }

    return res
      .setHeader('csrf-token', req.csrfToken())
      .render('signup', { ...signupContext(redirect), csrf: req.csrfToken() });
  }

  // eslint-disable-next-line max-params
  @Get('reset-email')
  async resetEmailPage(
    @QueryRequired('token') token: string,
    @Query('redirect') redirect: string,
    @Req() req: Request & { csrfToken: () => string },
    @Res() res: Response
  ) {
    try {
      const sub = await this.authService.verifyAccessToken(token);
      const { email } = <Auth>await this.authService.findByUserId(sub);

      if (redirect !== undefined) {
        res = res.cookie('redirect', redirect);
      }

      return res
        .setHeader('csrf-token', req.csrfToken())
        .render('resetEmail', { ...resetEmailContext(redirect), csrf: req.csrfToken(), subscription: email });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: 'resetEmailPage', input: { token: token }, method: 'GET' },
        `An error occurred when trying to reset email. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Get('confirm-email')
  async emailConfirmation(
    @QueryRequired('token') token: string,
    @Query('redirect') redirect: string,
    @Res() res: Response
  ) {
    try {
      await this.authService.activateAccount(token);

      const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

      if (redirect !== undefined) {
        res = res.cookie('redirect', redirect);
      }

      res.render('confirmation', {
        title: 'Account activation',
        message: 'Your account was successfully activated!',
        redirectUrl: loginUrl,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: 'emailConfirmation', input: { token: token }, method: 'GET' },
        `An error occurred when trying to send a confirmation email. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  // eslint-disable-next-line max-params
  @Get('reset-password')
  async resetPasswordPage(
    @QueryRequired('token') resetPasswordToken: string,
    @Query('redirect') redirect: string,
    @Req() req: Request & { csrfToken: () => string },
    @Res() res: Response
  ) {
    try {
      const payload = await this.authService.verifyResetPasswordToken(resetPasswordToken);

      if (redirect !== undefined) {
        res = res.cookie('redirect', redirect);
      }

      if (payload) {
        res.setHeader('csrf-token', req.csrfToken()).render('resetPassword', {
          csrf: req.csrfToken(),
          sub: payload.sub,
          ...resetPasswordContext(redirect),
        });
      } else {
        throw new UnprocessableEntityException('invalid token');
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('confirm-new-email')
  async confirmNewEmail(
    @QueryRequired('token') resetEmailToken: string,
    @Query('redirect') redirect: string,
    @Res() res: Response
  ) {
    try {
      const { sub, newEmail } = await this.authService.verifyResetEmailToken(resetEmailToken);

      await this.authService.resetEmail(sub, newEmail);

      const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

      if (redirect !== undefined) {
        res = res.cookie('redirect', redirect);
      }

      res.render('confirmation', {
        title: 'Account activation',
        message: 'Your account email was successfully reset!',
        redirectUrl: loginUrl,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('accept-store-invitation')
  async acceptStoreInvitation(
    @QueryRequired('token') invitationToStoreToken: string,
    @Req() req: Request & { csrfToken: () => string },
    @Res() res: Response
  ) {
    try {
      const { userEmail, storeName, exist } = await this.authService.verifyInvitationToStoreToken(
        invitationToStoreToken
      );

      if (exist) {
        res.render('confirmation', {
          title: 'Confirmation',
          message: `Welcome to the ${storeName.toUpperCase()} Store !`,
          redirectUrl: `${MAIN_URL}/login`,
        });
      } else {
        res.setHeader('csrf-token', req.csrfToken()).render('invitation', {
          title: 'Invitation to Store',
          email: userEmail,
          storeName: storeName,
          csrf: req.csrfToken(),
          token: invitationToStoreToken,
          ...invitationToStoreContext,
        });
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('complete-profile')
  async completeProfilePage(
    @Req() req: Request & { user: AccountInfo },
    @Query('redirect') redirect: string,
    @Res() res: Response
  ) {
    try {
      // Extract token from cookies
      const accessToken = req.cookies['BAL_ess'];
      if (!accessToken) {
        throw new UnauthorizedException('No access token found');
      }

      // Verify token
      const userId = await this.authService.verifyAccessToken(accessToken);
      if (!userId) {
        throw new UnauthorizedException('Invalid token');
      }

      // Fetch user from database
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Create the context for rendering the complete profile page
      const context = completeProfileContext(redirect, user);

      // Render the page
      return res.render('completeProfile', context);
    } catch (error) {
      this.logger.error('Error in completeProfilePage:', error);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error loading user profile');
    }
  }

  @Post('signup')
  @Csrf()
  async signup(@Query('redirect') redirect: string, @Body() signUpDto: SignUpDto, @Res() res: Response) {
    try {
      await this.authService.register({ email: signUpDto.email, password: signUpDto.password }, redirect);

      const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

      res.render('confirmation', {
        title: 'Confirmation',
        message: 'Your account was successfully created. Please check your email and activate your account.',
        redirectUrl: loginUrl,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: 'signup', input: { signUpDto }, method: 'POST' },
        `An error occurred when trying to register. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Post('signup-store-user')
  @Csrf()
  async signupStoreUser(@Body() signUpStoreUserDto: SignUpStoreUserDto, @Res() res: Response) {
    try {
      const invitationInfo = await this.authService.verifyInvitationToStoreToken(signUpStoreUserDto.token);
      await this.authService.registerStoreUser({
        userEmail: invitationInfo.userEmail,
        store: invitationInfo.store,
        inviter: invitationInfo.inviter,
        password: signUpStoreUserDto.password,
      });
      res.render('confirmation', {
        title: 'Confirmation',
        message: `Welcome to the ${invitationInfo.storeName.toUpperCase()} Store! <br/> Your account was successfully created.`,
        redirectUrl: `${MAIN_URL}/login`,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: 'signup', input: { signUpStoreUserDto }, method: 'POST' },
        `An error occurred when trying to register. Thrown Error : {${JSON.stringify(error)}}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Recaptcha()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @Csrf()
  async login(@Query('redirect') redirect: string, @Req() req: Request & { user: UserEntity }, @Res() res: Response) {
    try {
      const user = req.user;
      const tokens = await this.authService.login(user.id);
      // Check if profile is complete
      const isProfileComplete = this.userService.isProfileComplete(user);

      // Redirect to complete-profile page if profile is incomplete
      if (!isProfileComplete) {
        const completeProfileUrl = redirect
          ? `${MAIN_URL}/complete-profile?redirect=${encodeURIComponent(redirect)}`
          : `${MAIN_URL}/complete-profile`;

        // Set tokens in cookies before redirecting
        res = this.setTokenCookies(res, tokens);

        return res.redirect(completeProfileUrl);
      }

      // Normal redirect process if profile is complete
      if (redirect?.length) {
        const redirectUrl = this.redirectUrl(redirect);
        if (redirectUrl?.length) {
          res = this.setTokenCookies(res, tokens);

          return res.redirect(redirectUrl);
        }
      }

      // If no redirect, set cookies and return tokens
      res = this.setTokenCookies(res, tokens);

      return res.status(HttpStatus.OK).json(tokens);
    } catch (error) {
      this.logger.error(
        { function: 'login', input: { id: req.user?.id }, method: 'POST' },
        `An error occurred when trying to login. Thrown Error: ${JSON.stringify(error)}`
      );
      throw new InternalServerErrorException('internal error');
    }
  }

  @Post('reset-email')
  @Csrf()
  async resetEmail(@Query('redirect') redirect: string, @Body() resetEmailDto: ResetEmailDto, @Res() res: Response) {
    try {
      const { subscription, newEmail } = resetEmailDto;

      await this.authService.sendResetEmailEmail(subscription, newEmail, redirect);

      const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

      res.render('confirmation', {
        title: 'Confirmation',
        message: 'An email has been send to your new email address, confirm it through the mail.',
        redirectUrl: loginUrl,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
  @Post('forgot-password')
  @Csrf()
  async sendResetPassword(
    @Query('redirect') redirect: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response
  ) {
    try {
      const { email } = forgotPasswordDto;

      await this.authService.sendResetPasswordEmail(email, redirect);

      const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

      return res.render('confirmation', {
        title: 'Reset Password',
        message: 'Check your email address and reset your password.',
        redirectUrl: loginUrl,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('reset-password')
  @Csrf()
  async resetPassword(
    @Query('redirect') redirect: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response
  ) {
    try {
      const { password, subscription } = resetPasswordDto;

      await this.authService.resetPassword(subscription, password);

      const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

      res.render('confirmation', {
        title: 'Confirmation',
        message: 'Your account password was successfully reset.',
        redirectUrl: loginUrl,
      });
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // eslint-disable-next-line max-params
  @Patch('complete-profile/:id')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidateNotEmptyPipe()) updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('redirectUrl') redirectUrl: string,
    @UploadedFile() profilePicture?: Express.Multer['File']
  ) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check if the user from the token matches the requested user ID
      const accessToken = req.cookies['BAL_ess'];
      if (!accessToken) {
        throw new UnauthorizedException('No access token found');
      }

      const tokenUserId = await this.authService.verifyAccessToken(accessToken);
      if (tokenUserId !== id) {
        throw new HttpException('You cannot access this user', HttpStatus.UNAUTHORIZED);
      }

      // Update the user profile
      await this.userService.update(id, updateUserDto, profilePicture);

      const redirect = this.redirectUrl(redirectUrl);
      if (redirect?.length) {
        return res.redirect(redirect);
      }

      return { success: true };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        { function: 'update', input: { id, updateUserDto }, method: 'PATCH' },
        `An error occurred when updating user profile: ${JSON.stringify(error)}`
      );
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
