import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FieldValues } from "react-hook-form";
import Location from "../api/LocationApi";

interface LocationState {
  status: string;
}
const initialState: LocationState = {
  status: "idle",
};

export const findByGps = createAsyncThunk<any, FieldValues>(
  "location/findByGps",
  async (data) => {
    const response = await Location.findByGps(data);
    return response.data;
  }
);

export const LocationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(findByGps.pending, (state) => {
      state.status = "pendingFindByGps";
    });
    builder.addCase(findByGps.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(findByGps.rejected, (state) => {
      state.status = "idle";
    });
  },
});
