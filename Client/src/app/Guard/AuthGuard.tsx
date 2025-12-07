import { Navigate, Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { refreshToken } from "../../features/auth/store/AuthSlice";
import { useEffect } from "react";

export default function AuthGuard() {
  const dispatch = useAppDispatch();
  const { token, refreshTried } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token && !refreshTried) {
      dispatch(refreshToken());
    }
  }, [token, refreshTried, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
