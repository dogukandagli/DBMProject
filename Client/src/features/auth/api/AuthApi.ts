import { queries } from "../../../shared/api/ApiClient";

const Auth = {
  login: (formData: any) => queries.post("auth/login", formData),
};

export default Auth;
