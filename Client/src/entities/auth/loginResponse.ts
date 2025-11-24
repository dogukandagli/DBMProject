import type { User } from "./User";

export interface LoginResponse {
  token: string;
  userDto: User;
}
