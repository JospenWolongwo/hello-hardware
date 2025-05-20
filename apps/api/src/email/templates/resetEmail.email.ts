import { MAIN_URL } from '../../common/utils/hbs.context';

export const resetEmailTemplate = {
  subject: `Hello Hardware: Reset Email address`,
  text: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `Greetings!
            You requested to change the email address associated to your account, please follow the link below to do so.

            ${MAIN_URL + '/confirm-new-email?token=' + token + redirectToken}
        `;
  },
  html: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `<p style="color:#1a1414;">
            Greetings!
            <br/>
            You requested to change the email address associated to your account, please follow the link below to do so.
            <br/>
            <br/>
            <a style="color:#012156; text-decoration:none;" href="${
              MAIN_URL + '/confirm-new-email?token=' + token + redirectToken
            }" target="_blank">Reset your email address</a>
            </p>
            <br/>
            <span style="font-size:10px;color:#969696;">Hello Hardware email service<span>`;
  },
};
