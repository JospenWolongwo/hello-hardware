import { MAIN_URL } from '../../common/utils/hbs.context';

export const resetPasswordTemplate = {
  subject: `Hello Hardware: Reset Password`,
  text: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `Greetings!
            You requested to change your password, please follow the link below to do so.

            ${MAIN_URL + '/reset-password?token=' + token + redirectToken}
        `;
  },
  html: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `<p style="color:#1a1414;">
            Greetings!
            <br/>
            You requested to change your password, please follow the link below to so so.
            <br/>
            <br/>
            <a style="color:#012156; text-decoration:none;" href="${
              MAIN_URL + '/reset-password?token=' + token + redirectToken
            }" target="_blank">Reset your password</a>
            </p>
            <br/>
            <span style="font-size:10px;color:#969696;">Hello Hardware email service<span>`;
  },
};
