export interface ResetEmailPayload {
  sub: string;
  newEmail: string;
  iat: number;
  exp: number;
}
