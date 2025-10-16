import { createBrowserRouter } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
