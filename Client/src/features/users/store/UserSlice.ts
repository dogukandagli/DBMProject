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

interface Neighborhood {
  id: string;
  name: string;
  city: string;
  district: string;
}

interface UserState {
  profilePhotoUrl: string | null;
  status: string;
  myNeighborhood: Neighborhood | null; 
}

const initialState: UserState = {
  profilePhotoUrl: null,
  status: "idle",
  myNeighborhood: null,
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
export const getMyNeighborhoodDetails = createAsyncThunk<Neighborhood, void>(
  "user/getMyNeighborhoodDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await User.getMyNeighborhood();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Mahalle bilgisi alınamadı");
    }
  }
);

export const requestMyInformation = createAsyncThunk<void, FormData>(
  "user/requestMyInformation",
  async (data) => {
    const blob = await User.requestMyInformation(data);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-data.zip";
    a.click();
    window.URL.revokeObjectURL(url);
  }
);


export const deactivateAccount = createAsyncThunk(
  "user/deactivate",
  async (_, { rejectWithValue }) => {
    try {
      await User.deactivateAccount();
      toast.success("Hesabın başarıyla donduruldu.");
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "İşlem başarısız");
    }
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
    builder.addCase(requestMyInformation.pending, (state) => {
      state.status = "pendingRequestInfo";
    });
    builder.addCase(requestMyInformation.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(requestMyInformation.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(deactivateAccount.pending, (state) => {
      state.status = "pendingDeactivate";
    });
    builder.addCase(deactivateAccount.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(deactivateAccount.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(getMyNeighborhoodDetails.pending, (state) => {
      state.status = "pendingGetMyNeighborhood";
    });
    builder.addCase(getMyNeighborhoodDetails.fulfilled, (state, action) => {
      state.status = "idle";
      state.myNeighborhood = action.payload;
    });
    builder.addCase(getMyNeighborhoodDetails.rejected, (state) => {
      state.status = "idle";
    });
  },
});
