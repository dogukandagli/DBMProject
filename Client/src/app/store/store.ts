import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../features/auth/store/AuthSlice";
import { neighborhoodsSlice } from "../../features/neighborhoods/store/neighborhoodSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    neighborhood: neighborhoodsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
