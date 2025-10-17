import { queries } from "../../../shared/api/ApiClient";

const Auth = {
  login: (formData: any) => queries.post("auth/login", formData),
  loginWithTFA: (formData: any) => queries.post("auth/loginWithTFA", formData),
};

export default Auth;
