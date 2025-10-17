import { createBrowserRouter } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import TwoFactorCodePage from "../../pages/TwoFactorCodePage/TwoFactorPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPassword from "../../pages/ResetPasswordPage/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/twofactor", element: <TwoFactorCodePage /> },
  { path: "/forgotpassword", element: <ForgotPasswordPage /> },
  {
    path: "/reset-password/:id/:forgotPasswordCode",
    element: <ResetPassword />,
  },
]);
