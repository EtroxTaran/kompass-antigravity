export interface User {
  _id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  primaryRole: string;
  active: boolean;
}
