import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LoginResponse } from "../../../entities/auth/loginResponse";
import type { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { router } from "../../../app/router/router";
import Auth from "../api/AuthApi";

interface AuthState {
  token: string | null;
  requires2fa: boolean | null;
  status: string;
  emailOrUserName: string | null;
}
const initialState: AuthState = {
  token: null,
  requires2fa: null,
  status: "idle",
  emailOrUserName: null,
};
export const login = createAsyncThunk<LoginResponse, FieldValues>(
  "auth/login",
  async (data) => {
    const response = await Auth.login(data);
    const { token, requires2fa } = response.data;
    return { token, requires2fa } as unknown as LoginResponse;
  }
);
export const registerUser = createAsyncThunk<string, FieldValues>(
  "auth/registerUser",
  async (data) => {
    return await Auth.register(data);
  }
);
export const checkEmail = createAsyncThunk<boolean, FieldValues>(
  "auth/checkEmail",
  async (data) => {
    return await Auth.checkEmail(data);
  }
);
export const loginWithTFA = createAsyncThunk<LoginResponse, FieldValues>(
  "auth/loginWithTFA",
  async (data) => {
    const response = await Auth.loginWithTFA(data);
    const { token, requires2fa } = response.data;

    return { token, requires2fa } as unknown as LoginResponse;
  }
);
export const forgotPassword = createAsyncThunk<void, string>(
  "auth/forgotPassword",
  async (email) => {
    await Auth.forgotPassword(email);
  }
);
export const resetPassword = createAsyncThunk<void, FieldValues>(
  "auth/resetPassword",
  async (data) => {
    await Auth.resetPassword(data);
  }
);
export const confirmEmail = createAsyncThunk<void, FieldValues>(
  "auth/confirmEmail",
  async (data) => {
    await Auth.confirmEmail(data);
  }
);
export const refreshToken = createAsyncThunk<LoginResponse, void>(
  "auth/refreshToken",
  async () => {
    const response = await Auth.refreshToken();
    const { token, requires2fa } = response.data;
    return { token, requires2fa } as unknown as LoginResponse;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.status = "pendingLogin";
      state.emailOrUserName = action.meta.arg.emailOrUserName;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "idle";
      if (action.payload.requires2fa) {
        toast.warning("Çift Doğrulama Kodu Mail Adresinize Gönderilmiştir.");
        router.navigate("/twofactor");
      }
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(registerUser.pending, (state, action) => {
      state.status = "pendingRegister";
      state.emailOrUserName = action.meta.arg.emailOrUserName;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.status = "rejectedRegister";
    });
    builder.addCase(checkEmail.pending, (state) => {
      state.status = "pendingcheckEmail";
    });
    builder.addCase(checkEmail.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(checkEmail.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(loginWithTFA.pending, (state) => {
      state.status = "pendingloginWithTFA";
    });
    builder.addCase(loginWithTFA.fulfilled, (state, action) => {
      state.status = "idle";
      state.token = action.payload.token;
      toast.success("Doğrulama Kodu Doğru.");
    });
    builder.addCase(loginWithTFA.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.status = "pendingforgotPassword";
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.status = "pendingresetPassword";
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(confirmEmail.pending, (state) => {
      state.status = "pendingconfirmEmail";
    });
    builder.addCase(confirmEmail.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(confirmEmail.rejected, (state) => {
      state.status = "rejectedconfirmEmail";
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.token = null;
    });
  },
});
