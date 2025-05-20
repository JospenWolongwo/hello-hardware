import { MAIN_URL } from '../../common/utils/hbs.context';

export const invitationToStoreTemplate = {
  subject: `Hello Hardware: Invitation to be a Store Staff.`,
  text: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `You are invited to join the staff members of a store.
            Follow the link below to proceed. 

            ${MAIN_URL + '/accept-store-invitation?token=' + token + redirectToken}

            This link will expire in ${(<string>process.env.INVITATION_TO_STORE_EXPIRATION).charAt(0)} days.
        `;
  },
  html: function (token: string, redirect?: string) {
    const redirectToken = redirect ? '&redirect=' + redirect : '';

    return `<p style="color:#1a1414;">
            You are invited to join the staff members of a store.
            <br/>
            Follow the link below to proceed.
            <br/>
            <br/>
            <a style="color:#32cd32; text-decoration:none; font-weight:bold;" href="${
              MAIN_URL + '/accept-store-invitation?token=' + token + redirectToken
            }" target="_blank">Accept Invitation</a>
            </p>
            <br/>
            <span style="font-size:10px;color:#1a1414;">
               This link will expire in 
               <span style="color:#32cd32;font-weight:bold;">
                ${(<string>process.env.INVITATION_TO_STORE_EXPIRATION).charAt(0)} days 
               </span> 
                .
            </span>
            <br/><br/>
            <span style="font-size:10px;color:#969696;">Hello Hardware email service<span>`;
  },
};
