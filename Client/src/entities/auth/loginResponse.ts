export interface LoginResponse {
  token: string | null;
  requires2fa: boolean | null;
}
