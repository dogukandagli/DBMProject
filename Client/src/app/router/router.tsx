import { createBrowserRouter } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import TwoFactorCodePage from "../../pages/TwoFactorCodePage/TwoFactorPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPassword from "../../pages/ResetPasswordPage/ResetPasswordPage";
import ConfirmEmailPage from "../../pages/ConfirmEmailPage/ConfirmEmailPage";
import CreateAccountPage from "../../pages/CreateAccountPage/Page";
import AuthPage from "../../pages/AuthPage/page";
import AuthGuard from "../Guard/AuthGuard";
import RootDecider from "../Guard/RootDecider";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootDecider />,
  },
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
  {
    path: "/ConfirmEmail/:userId/:mailToken",
    element: <ConfirmEmailPage />,
  },
  {
    path: "/create-account",
    element: <CreateAccountPage />,
  },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        path: "auth",
        element: <AuthPage />,
      },
    ],
  },
]);
