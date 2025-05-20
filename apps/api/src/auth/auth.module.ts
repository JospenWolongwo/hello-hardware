import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { Auth } from '../auth/entities/auth.entity';
import { googleRecaptchaConfig } from '../common/config';
import { EmailModule } from '../email/email.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user-management/user.module';
import { UserPermissionsModule } from '../user-permissions/user-permissions.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AccessTokenStrategy, GoogleStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    PassportModule,
    GoogleRecaptchaModule.forRoot(googleRecaptchaConfig()),
    EmailModule,
    JwtModule.register({}),
    UserPermissionsModule,
    UserModule,
    StoreModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
