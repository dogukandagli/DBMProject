import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Post from "../api/PostApi";

interface PostState {
  status: string;
}
const initialState: PostState = {
  status: "idle",
};

export const createPost = createAsyncThunk<void, FormData>(
  "posts/createPost",
  async (formData) => {
    return await Post.createPost(formData);
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPost.pending, (state) => {
      state.status = "pendingCreatePost";
    });
    builder.addCase(createPost.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(createPost.rejected, (state) => {
      state.status = "idle";
    });
  },
});
