export type InvitationToStorePayload = {
  inviter: string;
  userEmail: string;
  store: string;
  iat: number;
  exp: number;
};
