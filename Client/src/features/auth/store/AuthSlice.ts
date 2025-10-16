import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LoginResponse } from "../../../entities/auth/loginResponse";
import type { FieldValues } from "react-hook-form";
import Auth from "../api/AuthApi";

interface AuthState {
  accessToken: string | null;
  requires2fa: boolean | null;
  status: string;
}
const initialState: AuthState = {
  accessToken: null,
  requires2fa: null,
  status: "idle",
};
export const login = createAsyncThunk<LoginResponse, FieldValues>(
  "auth/login",
  async (data) => {
    const response = await Auth.login(data);
    const { accessToken, requires2fa } = response.data;

    return { accessToken, requires2fa } as unknown as LoginResponse;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "pendingLogin";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "idle";
      if (action.payload.requires2fa) {
        // burda twofactor dogrulamaya gidicek router.navigate("");
      }
      state.accessToken = action.payload.token;
    });
    builder.addCase(login.rejected, (state) => {
      state.status = "idle";
    });
  },
});
