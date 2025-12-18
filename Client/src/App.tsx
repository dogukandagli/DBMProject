import { RouterProvider } from "react-router";
import { router } from "./app/router/router";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "./app/store/hooks";
import { useEffect } from "react";
import { me, refreshToken } from "./features/auth/store/AuthSlice";
import { PropagateLoader } from "react-spinners";
import { useNotification } from "./hooks/useNotification";

function App() {
  const dispatch = useAppDispatch();
  const { refreshTried, status } = useAppSelector((state) => state.auth);
  const pendingMe = status === "pendingMe";

  useEffect(() => {
    const init = async () => {
      const refreshResult = await dispatch(refreshToken()).unwrap();

      if (refreshResult.token) {
        dispatch(me());
      }
    };
    init();
  }, []);
  useNotification();

  if (!refreshTried || pendingMe) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PropagateLoader size={15} />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
