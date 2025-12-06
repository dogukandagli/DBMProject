import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";

export default function AdminGuard() {
  const { user, token } = useAppSelector((state) => state.auth);
  if (token && !user) {
    return (
       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
         <h3>Yetki kontrolü yapılıyor...</h3>
       </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if ((user as any).role !== "Admin") { 
    console.warn("Yetkisiz Giriş: Admin değilsin!", user);
    return <Navigate to="/feed" replace />;
}
  return <Outlet />;
}