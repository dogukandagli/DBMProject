import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { FieldValues } from "react-hook-form";
import Location from "../api/LocationApi";
import type { AutoComplete } from "../../../entities/location/autoComplete";
import type { PlaceDetails } from "../../../entities/location/placeDetails";
import type { CheckAddressExistsResponse } from "../../../entities/location/checkAddressExistsResponse";

interface LocationState {
  options: AutoComplete[];
  status: string;
  selectedDetails: PlaceDetails | null;
  deviceLocation: PlaceDetails | null;
}
const initialState: LocationState = {
  status: "idle",
  options: [],
  selectedDetails: null,
  deviceLocation: null,
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

export const fetchReverseGeocode = createAsyncThunk<PlaceDetails, FieldValues>(
  "location/fetchReverseGeocode",
  async (data) => {
    const response = await Location.reverseGeocode(data);
    return response.data;
  }
);

export const checkAddress = createAsyncThunk<
  CheckAddressExistsResponse,
  FieldValues
>("location/checkAddress", async (data) => {
  const response = await Location.checkAddress(data);
  return response.data;
});

export const LocationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearPlaces(state) {
      state.options = [];
    },
  },
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
        state.options = [...action.payload];
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
    builder.addCase(fetchReverseGeocode.pending, (state) => {
      state.status = "pendingFindByGps";
    });
    builder.addCase(
      fetchReverseGeocode.fulfilled,
      (state, action: PayloadAction<PlaceDetails>) => {
        state.status = "idle";
        state.deviceLocation = action.payload;
      }
    );
    builder.addCase(fetchReverseGeocode.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(checkAddress.pending, (state) => {
      state.status = "pendingCheckAddress";
    });
    builder.addCase(checkAddress.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(checkAddress.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const { clearPlaces } = LocationSlice.actions;
