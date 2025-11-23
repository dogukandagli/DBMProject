import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { refreshToken } from "../../features/auth/store/AuthSlice";
import { Navigate, Outlet } from "react-router";

export default function GuestGuard() {
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

  return <Outlet />;
}
