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
import NotificationsPage from "../../pages/NotificationsPage/Page";

import SettingsPage from "../../pages/SettingsPage/SettingsPage";
import AccountSettingsPage from "../../pages/SettingsPage/AccountSettingsPage";
import PrivacySettingsPage from "../../pages/SettingsPage/PrivacySettingsPage";
import NotificationSettingsPage from "../../pages/SettingsPage/NotificationsSettingsPage";
import NotificationPlaceholderPage from "../../pages/SettingsPage/NotificationPlaceHolderPage";
import NeighborhoodsSettingsPage from "../../pages/SettingsPage/NeighborhoodsSettingsPage";
import MemberAgreementPage from "../../pages/SettingsPage/MemberAgreementPage";
import PrivacyPolicyPage from "../../pages/SettingsPage/PrivacyPolicyPage";
import InboxList from "../../components/InboxList";

import EventPage from "../../pages/EventPage/Page";

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
                path: "borrowRequests/:id",
                element: <BorrowRequestDetailPage />,
              },
              {
                path: "notifications",
                element: <NotificationsPage />,
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
                path: "settings",
                element: <SettingsPage />,
              },
              {
                path: "settings/account",
                element: <AccountSettingsPage />,
              },
              {
                path: "settings/privacy",
                element: <PrivacySettingsPage />,
              },
              {
                path: "settings/notifications",
                element: <NotificationSettingsPage />,
              },
              {
                path: "settings/notifications/posts",
                element: <NotificationPlaceholderPage title="Posts" />,
              },
              {
                path: "settings/notifications/digests",
                element: <NotificationPlaceholderPage title="Digests" />,
              },
              {
                path: "settings/notifications/realtime",
                element: (
                  <NotificationPlaceholderPage title="Real-time alerts" />
                ),
              },
              {
                path: "settings/notifications/activity",
                element: <NotificationPlaceholderPage title="My activity" />,
              },
              {
                path: "settings/notifications/agencies",
                element: (
                  <NotificationPlaceholderPage title="Public agencies" />
                ),
              },
              {
                path: "settings/notifications/for-sale",
                element: (
                  <NotificationPlaceholderPage title="For Sale & Free" />
                ),
              },
              {
                path: "settings/notifications/groups",
                element: (
                  <NotificationPlaceholderPage title="Groups & Contacts" />
                ),
              },
              {
                path: "settings/notifications/promotions",
                element: (
                  <NotificationPlaceholderPage title="Komşu promotions" />
                ),
              },

              {
                path: "settings/neighborhoods",
                element: <NeighborhoodsSettingsPage />,
              },
              {
                path: "privacy",
                element: <PrivacyPolicyPage />,
              },
              {
                path: "member-agreement",
                element: <MemberAgreementPage />,
              },
              {
                path: "eventPage",
                element: <EventPage />,
              },
              {
                path: "inbox",
                element: <InboxList />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
