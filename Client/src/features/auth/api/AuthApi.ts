import { queries } from "../../../shared/api/ApiClient";

const Auth = {
  login: (formData: any) => queries.post("auth/login", formData),
  register: (FormData: any) => queries.post("auth/register", FormData),
  loginWithTFA: (formData: any) => queries.post("auth/loginWithTFA", formData),
  forgotPassword: (formData: any) =>
    queries.post("auth/forgotPassword", formData),
  resetPassword: (formData: any) =>
    queries.post("auth/resetPassword", formData),
  confirmEmail: (formData: any) => queries.post("auth/confirmEmail", formData),
  refreshToken: () => queries.get("auth/refreshToken"),
  checkEmail: (formData: any) => queries.post("auth/checkEmail", formData),
};

export default Auth;
