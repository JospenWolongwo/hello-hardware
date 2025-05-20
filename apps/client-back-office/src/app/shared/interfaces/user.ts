export interface User {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  gender: string | null;
  email: string;
  permissions: string[];
}
