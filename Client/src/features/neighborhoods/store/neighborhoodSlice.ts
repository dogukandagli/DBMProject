import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Neighborhood from "../api/NeighborhoodsApi";
import type { ODataResponse } from "../../../shared/types/ODataResponse";

export type Neighborhood = {
  id: number;
  name: string;
};

type NeighborhoodsState = {
  options: Neighborhood[];
  loading: boolean;
  error: string | null;
  lastQuery: string;
};

const initialState: NeighborhoodsState = {
  options: [],
  loading: false,
  error: null,
  lastQuery: "",
};

export const fetchNeighborhoods = createAsyncThunk<
  ODataResponse<Neighborhood>,
  string
>("neighborhoods/fetchNeighborhoods", async (query) => {
  return await Neighborhood.getNeighborhoods(query);
});

export const neighborhoodsSlice = createSlice({
  name: "neighborhoods",
  initialState,
  reducers: {
    clearNeighborhoods(state) {
      state.options = [];
      state.error = null;
      state.lastQuery = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNeighborhoods.pending, (state, action) => {
        state.loading = true;
        state.lastQuery = action.meta.arg;
      })
      .addCase(fetchNeighborhoods.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload.value;
      })
      .addCase(fetchNeighborhoods.rejected, (state) => {
        state.loading = false;
      });
  },
});
