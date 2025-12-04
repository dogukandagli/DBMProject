import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { refreshToken } from "../../features/auth/store/AuthSlice";
import { Navigate, Outlet } from "react-router";

export default function GuestGuard() {
  const dispatch = useAppDispatch();
  const { token, refreshTried } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token && !refreshTried) {
      dispatch(refreshToken());
    }
  }, [token, refreshTried]);

  if (token) {
    return <Navigate to={"feed"} replace />;
  }

  return <Outlet />;
}
