import * as dotenv from 'dotenv';
import type { UserEntity } from '../../user-management/entities/user.entity';
dotenv.config();

export const MAIN_URL = process.env.SITE_DOMAIN + ':' + process.env.PORT;

export const loginContext = (redirect: string | undefined) => {
  const signInUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

  const googleAuthUrl =
    redirect === undefined ? `${MAIN_URL}/login/google` : `${MAIN_URL}/login/google?redirect=${redirect}`;

  const signUpUrl = redirect === undefined ? `${MAIN_URL}/signup` : `${MAIN_URL}/signup?redirect=${redirect}`;

  const forgotPasswordUrl =
    redirect === undefined ? `${MAIN_URL}/forgot-password` : `${MAIN_URL}/forgot-password?redirect=${redirect}`;

  return {
    title: 'Login',
    signInUrl: signInUrl,
    googleAuthUrl: googleAuthUrl,
    signUpUrl: signUpUrl,
    forgotPasswordUrl: forgotPasswordUrl,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const signupContext = (redirect: string | undefined) => {
  const signUpUrl = redirect === undefined ? `${MAIN_URL}/signup` : `${MAIN_URL}/signup?redirect=${redirect}`;

  const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

  return {
    title: 'Signup',
    signUpUrl: signUpUrl,
    loginUrl: loginUrl,
    key: process.env.RECAPTCHA_SITE_KEY,
  };
};

export const forgotPasswordContext = (redirect: string | undefined) => {
  const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

  const forgotPasswordUrl =
    redirect === undefined ? `${MAIN_URL}/forgot-password` : `${MAIN_URL}/forgot-password?redirect=${redirect}`;

  return {
    title: 'Forgot password',
    forgotPasswordUrl: forgotPasswordUrl,
    loginUrl: loginUrl,
  };
};

export const resetEmailContext = (redirect: string | undefined) => {
  const loginUrl = redirect === undefined ? `${MAIN_URL}/login` : `${MAIN_URL}/login?redirect=${redirect}`;

  const resetEmailUrl =
    redirect === undefined ? `${MAIN_URL}/reset-email` : `${MAIN_URL}/reset-email?redirect=${redirect}`;

  return {
    title: 'Reset Email',
    resetEmailUrl: resetEmailUrl,
    loginUrl: loginUrl,
  };
};

export const resetPasswordContext = (redirect: string | undefined) => {
  const resetPasswordUrl =
    redirect === undefined ? `${MAIN_URL}/reset-password` : `${MAIN_URL}/reset-password?redirect=${redirect}`;

  return {
    resetPasswordUrl: resetPasswordUrl,
  };
};

export const invitationToStoreContext = {
  registerToStoreUrl: `${MAIN_URL}/signup-store-user`,
  key: process.env.RECAPTCHA_SITE_KEY,
};

export const completeProfileContext = (redirect: string | undefined, user: UserEntity) => {
  const profileCompleteUrl =
    redirect === undefined ? `${MAIN_URL}/complete-profile` : `${MAIN_URL}/complete-profile?redirect=${redirect}`;

  return {
    title: 'Complete Profile',
    profileCompleteUrl: profileCompleteUrl,
    redirectUrl: redirect,
    user,
  };
};
