import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { refreshToken } from "../../features/auth/store/AuthSlice";
import { Navigate } from "react-router";
import HomePage from "../../pages/HomePage/page";

export default function RootDecider() {
  const dispatch = useAppDispatch();
  const { token, refreshTried, status } = useAppSelector((state) => state.auth);
  const isRefreshing = status === "pendingRefreshToken";

  useEffect(() => {
    if (!token && !refreshTried) {
      dispatch(refreshToken());
    }
  }, [token, refreshTried]);

  if (isRefreshing || (!token && !refreshTried)) {
    return <div>Naber...</div>;
  }

  if (token) {
    return <Navigate to={"feed"} replace />;
  }

  return <HomePage />;
}
