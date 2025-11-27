import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { FieldValues } from "react-hook-form";
import Location from "../api/LocationApi";
import type { AutoComplete } from "../../../entities/location/autoComplete";
import type { PlaceDetails } from "../../../entities/location/placeDetails";

interface LocationState {
  options: AutoComplete[];
  status: string;
  selectedDetails: PlaceDetails | null;
}
const initialState: LocationState = {
  status: "idle",
  options: [],
  selectedDetails: null,
};

export const findByGps = createAsyncThunk<any, FieldValues>(
  "location/findByGps",
  async (data) => {
    const response = await Location.findByGps(data);
    return response.data;
  }
);

export const fetchAutoComplete = createAsyncThunk<AutoComplete[], FieldValues>(
  "location/fetchAutoComplete",
  async (data) => {
    const response = await Location.autoComplete(data);
    return response.data;
  }
);

export const fetchPlaceDetails = createAsyncThunk<PlaceDetails, FieldValues>(
  "location/fetchPlaceDetails",
  async (data) => {
    const response = await Location.placeDetails(data);
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
    builder.addCase(fetchAutoComplete.pending, (state) => {
      state.status = "pendingFetchAutoComplete";
    });
    builder.addCase(
      fetchAutoComplete.fulfilled,
      (state, action: PayloadAction<AutoComplete[]>) => {
        state.status = "idle";
        state.options = action.payload;
      }
    );
    builder.addCase(fetchAutoComplete.rejected, (state) => {
      state.status = "idle";
      state.options = [];
    });
    builder.addCase(
      fetchPlaceDetails.fulfilled,
      (state, action: PayloadAction<PlaceDetails>) => {
        state.status = "idle";
        state.selectedDetails = action.payload;
      }
    );
  },
});
