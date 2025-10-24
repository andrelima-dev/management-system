export interface AccessTokenPayload {
  sub: string;
  email: string;
  displayName: string;
  role: string;
  iat?: number;
  exp?: number;
}
