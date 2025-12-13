import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BorrowRequest } from "../api/BorrowRequestApi";

interface BorrowRequestState {
  status: string;
}

export const createBorrowRequest = createAsyncThunk<string, FormData>(
  "borrowRequest/createBorrowRequest",
  async (formData) => {
    const response = await BorrowRequest.createBorrowRequest(formData);
    return response.data;
  }
);

const initialState: BorrowRequestState = {
  status: "idle",
};
export const borrowRequstSlice = createSlice({
  name: "borrowRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBorrowRequest.pending, (state) => {
        state.status = "pendingCreateBorrowRequest";
      })
      .addCase(createBorrowRequest.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(createBorrowRequest.rejected, (state) => {
        state.status = "idle";
      });
  },
});
