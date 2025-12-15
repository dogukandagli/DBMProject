import { createBrowserRouter } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import TwoFactorCodePage from "../../pages/TwoFactorCodePage/TwoFactorPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPassword from "../../pages/ResetPasswordPage/ResetPasswordPage";
import ConfirmEmailPage from "../../pages/ConfirmEmailPage/ConfirmEmailPage";
import CreateAccountPage from "../../pages/CreateAccountPage/Page";
import AuthGuard from "../Guard/AuthGuard";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../../pages/HomePage/page";
import GuestGuard from "../Guard/GuestGuard";
import FeedPage from "../../pages/FeedPage/page";
import ProfilePage from "../../pages/ProfilePage/Page";
import EditProfile from "../../pages/EditProfilePage/Page";
import BorrowRequestPage from "../../pages/BorrowRequestPage/Page";
import { BorrowRequestDetailPage } from "../../pages/BorrowRequestDetailPage/Page";
import { mockBorrowRequest } from "../../entities/BorrowRequest/testdata";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <GuestGuard />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "create-account",
            element: <CreateAccountPage />,
          },
        ],
      },
      {
        path: "twofactor",
        element: <TwoFactorCodePage />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:id/:forgotPasswordCode",
        element: <ResetPassword />,
      },
      {
        path: "ConfirmEmail/:userId/:mailToken",
        element: <ConfirmEmailPage />,
      },

      {
        element: <AuthGuard />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "feed",
                element: <FeedPage />,
              },
              {
                path: "borrowRequests",
                element: <BorrowRequestPage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
              {
                path: "profile-edit",
                element: <EditProfile />,
              },
              {
                path: "borrow",
                element: <BorrowRequestDetailPage data={mockBorrowRequest} />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
