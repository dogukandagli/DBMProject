import { createBrowserRouter } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import TwoFactorCodePage from "../../pages/TwoFactorCodePage/TwoFactorPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage/ForgotPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/twofactor", element: <TwoFactorCodePage /> },
  { path: "/forgotpassword", element: <ForgotPasswordPage /> },
]);
