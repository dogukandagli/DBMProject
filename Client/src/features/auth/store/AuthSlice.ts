import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { LoginResponse } from "../../../entities/auth/loginResponse";
import type { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { router } from "../../../app/router/router";
import Auth from "../api/AuthApi";
import type { User } from "../../../entities/auth/User";
import type { RegisterResponse } from "../../../entities/auth/registerRespons.";
import type { VerifyLocationResponse } from "../../../entities/auth/verifyLocationResponse";
import type { RootState } from "../../../app/store/store";
import {
  deleteProfilePhoto,
  updateProfilePhoto,
} from "../../users/store/UserSlice";
import type { UpdateProfilePhotoResponse } from "../../../entities/user/UpdateProfilePhotoResponse";

interface AuthState {
  user: User | null;
  token: string | null;
  status: string;
  emailOrUserName: string | null;
  refreshTried: boolean;
  verificationToken: string | null;
  verifyUser: boolean;
}
const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  emailOrUserName: null,
  refreshTried: false,
  verificationToken: null,
  verifyUser: false,
};
export const login = createAsyncThunk<LoginResponse, FieldValues>(
  "auth/login",
  async (data) => {
    const response = await Auth.login(data);
    const { token, userDto } = response.data;
    return { token, userDto };
  }
);
export const registerUser = createAsyncThunk<RegisterResponse, FieldValues>(
  "auth/registerUser",
  async (data) => {
    const response = await Auth.register(data);
    return response.data;
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
export const confirmEmail = createAsyncThunk<LoginResponse, FieldValues>(
  "auth/confirmEmail",
  async (data) => {
    const response = await Auth.confirmEmail(data);
    return response.data;
  }
);
export const refreshToken = createAsyncThunk<{ token: string }, void>(
  "auth/refreshToken",
  async () => {
    const response = await Auth.refreshToken();
    return response.data;
  }
);
export const me = createAsyncThunk<User, void>("auth/me", async () => {
  const response = await Auth.me();
  return response.data as User;
});

export const verifyLocation = createAsyncThunk<
  VerifyLocationResponse,
  FieldValues
>("auth/verifyLocation", async (data, { getState }) => {
  const state = getState() as RootState;
  const verifyToken = state.auth.verificationToken;

  const response = await Auth.verifyLocation(data, verifyToken || "");
  return response.data;
});

export const logout = createAsyncThunk<boolean, FieldValues>(
  "auth/logout",
  async (data) => {
    const response = await Auth.logout(data);
    return response.data;
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
      state.token = action.payload.token;
      state.user = action.payload.userDto;
      router.navigate("/feed");
    });
    builder.addCase(login.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(registerUser.pending, (state, action) => {
      state.status = "pendingRegister";
      state.emailOrUserName = action.meta.arg.emailOrUserName;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<RegisterResponse>) => {
        state.verificationToken = action.payload.token;
        state.status = "fulfilledregister";
      }
    );
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
    builder.addCase(
      confirmEmail.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        state.token = action.payload.token;
        state.user = action.payload.userDto;
        router.navigate("/feed");
        state.status = "idle";
      }
    );
    builder.addCase(confirmEmail.rejected, (state) => {
      state.status = "rejectedconfirmEmail";
    });
    builder.addCase(refreshToken.pending, (state) => {
      state.status = "pendingRefreshToken";
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.status = "idle";
      state.refreshTried = true;
      state.token = action.payload.token;
    });
    builder.addCase(me.pending, (state) => {
      state.status = "pendingMe";
    });
    builder.addCase(me.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload;
    });
    builder.addCase(me.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(verifyLocation.pending, (state) => {
      state.status = "pendingVerifyLocation";
    });
    builder.addCase(
      verifyLocation.fulfilled,
      (state, action: PayloadAction<VerifyLocationResponse>) => {
        state.verifyUser = action.payload.isVerified;
        state.status = "idle";
      }
    );
    builder.addCase(verifyLocation.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(logout.pending, (state) => {
      state.status = "pendingLogout";
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "idle";
      state.token = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(
      updateProfilePhoto.fulfilled,
      (state, action: PayloadAction<UpdateProfilePhotoResponse>) => {
        if (state.user) {
          state.user.profilePhotoUrl = action.payload.profilePhotoUrl;
        }
      }
    );
    builder.addCase(deleteProfilePhoto.fulfilled, (state) => {
      state.user!.profilePhotoUrl = null;
    });
  },
});
