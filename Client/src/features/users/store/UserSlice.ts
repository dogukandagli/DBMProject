import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import User from "../api/UserApi";
import type { UpdateProfilePhotoResponse } from "../../../entities/user/UpdateProfilePhotoResponse";
import { toast } from "react-toastify";
import type { UpdateCoverPhotoResponse } from "../../../entities/user/UpdateCoverPhotoResponse";
import type { FieldValues } from "react-hook-form";
import type { UpdateInfoResponse } from "../../../entities/user/UpdateInfoResponse";

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
export const deleteProfilePhoto = createAsyncThunk<string, void>(
  "user/deleteProfilePhoto",
  async () => {
    const response = await User.deleteProfilePhoto();
    return response.data;
  }
);
export const updateCoverPhoto = createAsyncThunk<
  UpdateCoverPhotoResponse,
  FormData
>("user/UpdateCoverPhotoResponse", async (data) => {
  const response = await User.updateCoverPhoto(data);
  return response.data;
});
export const deleteCoverPhoto = createAsyncThunk<string, void>(
  "user/deleteCoverPhoto",
  async () => {
    const response = await User.deleteCoverPhoto();
    return response.data;
  }
);
export const updateInfo = createAsyncThunk<UpdateInfoResponse, FieldValues>(
  "user/updateInfo",
  async (data) => {
    const response = await User.updateInfo(data);
    return response.data;
  }
);
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
        toast.success(action.payload.message);
      }
    );
    builder.addCase(updateProfilePhoto.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(deleteProfilePhoto.pending, (state) => {
      state.status = "pendingDeleteProfilePhoto";
    });
    builder.addCase(deleteProfilePhoto.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(deleteProfilePhoto.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(updateCoverPhoto.pending, (state) => {
      state.status = "pendingUpdateCoverPhoto";
    });
    builder.addCase(
      updateCoverPhoto.fulfilled,
      (state, action: PayloadAction<UpdateCoverPhotoResponse>) => {
        state.status = "idle";
        toast.success(action.payload.message);
      }
    );
    builder.addCase(updateCoverPhoto.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(deleteCoverPhoto.pending, (state) => {
      state.status = "pendingDeleteCoverPhoto";
    });
    builder.addCase(deleteCoverPhoto.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(deleteCoverPhoto.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(updateInfo.pending, (state) => {
      state.status = "pendingUpdateInfo";
    });
    builder.addCase(updateInfo.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(updateInfo.rejected, (state) => {
      state.status = "idle";
    });
  },
});
