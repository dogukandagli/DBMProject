import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "../api/UserApi";

interface UserState {
  status: string;
}

const initialState: UserState = {
  status: "idle",
};

export const updateProfilePhoto = createAsyncThunk<string, FormData>(
  "user/updateProfilePhoto",
  async (data) => {
    const response = await User.updateProfilePhoto(data);
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
    builder.addCase(updateProfilePhoto.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(updateProfilePhoto.rejected, (state) => {
      state.status = "idle";
    });
  },
});
