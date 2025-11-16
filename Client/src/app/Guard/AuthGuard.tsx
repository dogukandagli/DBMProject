import { Navigate, Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { refreshToken } from "../../features/auth/store/AuthSlice";
import { useEffect } from "react";

export default function AuthGuard() {
  const dispatch = useAppDispatch();
  const { token, status, refreshTried } = useAppSelector((state) => state.auth);
  const isRefreshing = status === "pendingRefreshToken";

  useEffect(() => {
    if (!token && !refreshTried) {
      dispatch(refreshToken());
    }
  }, [token, refreshTried, dispatch]);

  if (isRefreshing || (!token && !refreshTried)) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
