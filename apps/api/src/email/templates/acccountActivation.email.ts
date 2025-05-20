import { MAIN_URL } from '../../common/utils/hbs.context';

export const accountActivationTemplate = {
  subject: `Hello Hardware: Account Activation`,
  text: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `Thank you for signing up to our application.
            Use the link below to activate your account.

            ${MAIN_URL + '/confirm-email?token=' + token + redirectToken}
        `;
  },
  html: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `<p style="color:#1a1414;">
            Thank you for signing up to our application.
            <br/>
            Use the link below to activate your account
            <br/>
            <br/>
            <a style="color:#012156; text-decoration:none;" href="${
              MAIN_URL + '/confirm-email?token=' + token + redirectToken
            }" target="_blank">activate account</a>
            </p>
            <br/>
            <span style="font-size:10px;color:#969696;">Hello hardware email service<span>`;
  },
};
