import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoanTransaction } from "../api/LoanTransactionApi";

interface LoanTransactionState {
  status: string;
}

const initialState: LoanTransactionState = {
  status: "idle",
};

export const generateHandoverQr = createAsyncThunk<
  string,
  { loanTransactionId: string; latitude: number; longitude: number }
>("loanTransaction/generateHandoverQr", async (data) => {
  const response = await LoanTransaction.generateHandoverQr(data);
  return response.data;
});

export const scanHandoverQr = createAsyncThunk<
  string,
  { qrHash: string; latitude: number; longitude: number }
>("loanTransaction/scanHandoverQr", async (data) => {
  const response = await LoanTransaction.scanHandoverQr(data);
  return response.data;
});

export const generateReturnQr = createAsyncThunk<
  string,
  { loanTransactionId: string; latitude: number; longitude: number }
>("loanTransaction/generateReturnQr", async (data) => {
  const response = await LoanTransaction.generateReturnQr(data);
  return response.data;
});

export const scanReturnQr = createAsyncThunk<
  string,
  { qrHash: string; latitude: number; longitude: number }
>("loanTransaction/scanReturnQr", async (data) => {
  const response = await LoanTransaction.scanReturnQr(data);
  return response.data;
});

export const loanTransactionSlice = createSlice({
  name: "loanTransaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateHandoverQr.pending, (state) => {
        state.status = "pendingGenerateHandoverQr";
      })
      .addCase(generateHandoverQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(generateHandoverQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(scanHandoverQr.pending, (state) => {
        state.status = "pendingScanHandoverQr";
      })
      .addCase(scanHandoverQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(scanHandoverQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(generateReturnQr.pending, (state) => {
        state.status = "pendingGenerateReturnQr";
      })
      .addCase(generateReturnQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(generateReturnQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(scanReturnQr.pending, (state) => {
        state.status = "pendingScanReturnQr";
      })
      .addCase(scanReturnQr.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(scanReturnQr.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});
