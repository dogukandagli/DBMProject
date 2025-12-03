import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import User from "../api/UserApi";
import type { UpdateProfilePhotoResponse } from "../../../entities/user/UpdateProfilePhotoResponse";

interface UserState {
  profilePhotoUrl: string | null;
  status: string;
}

const initialState: UserState = {
  profilePhotoUrl: null,
  status: "idle",
};

export const updateProfilePhoto = createAsyncThunk<
  UpdateProfilePhotoResponse,
  FormData
>("user/updateProfilePhoto", async (data) => {
  const response = await User.updateProfilePhoto(data);
  return response.data;
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateProfilePhoto.pending, (state) => {
      state.status = "pendingUpdateProfilePhoto";
    });
    builder.addCase(
      updateProfilePhoto.fulfilled,
      (state, action: PayloadAction<UpdateProfilePhotoResponse>) => {
        state.status = "idle";
        state.profilePhotoUrl = action.payload.profilePhotoUrl;
      }
    );
    builder.addCase(updateProfilePhoto.rejected, (state) => {
      state.status = "idle";
    });
  },
});
