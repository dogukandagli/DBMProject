import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { BorrowRequest } from "../api/BorrowRequestApi";
import type { BorrowRequestDto } from "../../../entities/BorrowRequest/BorrowRequestDto";
import type { RootState } from "../../../app/store/store";

interface GetPostsResponse {
  items: BorrowRequestDto[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export const borrowRequestAdapter = createEntityAdapter<
  BorrowRequestDto,
  string
>({
  selectId: (borrowrequest) => borrowrequest.id,
});
interface BorrowRequestState {
  status: string;
  nextPage: number | null;
  hasMore: boolean;
}

const initialState = borrowRequestAdapter.getInitialState<BorrowRequestState>({
  status: "idle",
  nextPage: 1,
  hasMore: true,
});

export const createBorrowRequest = createAsyncThunk<string, FormData>(
  "borrowRequest/createBorrowRequest",
  async (formData) => {
    const response = await BorrowRequest.createBorrowRequest(formData);
    return response.data;
  }
);

export const getBorrowRequests = createAsyncThunk<
  GetPostsResponse,
  void,
  { state: RootState }
>("borrowRequest/getBorrowRequests", async (_, { getState }) => {
  const state = getState();
  const page = state.borrowRequests.nextPage ?? 1;

  const response = await BorrowRequest.getBorrowRequest(page);
  return response.data;
});
export const getMyBorrowRequests = createAsyncThunk<
  GetPostsResponse,
  void,
  { state: RootState }
>("borrowRequest/getMyBorrowRequests", async (_, { getState }) => {
  const state = getState();
  const page = state.borrowRequests.nextPage ?? 1;

  const response = await BorrowRequest.getMyBorrowRequest(page);
  return response.data;
});

export const createOffer = createAsyncThunk<string, FormData>(
  "borrowRequest/createOffer",
  async (formData) => {
    const response = await BorrowRequest.createOffer(formData);
    return response.data;
  }
);

export const borrowRequstSlice = createSlice({
  name: "borrowRequest",
  initialState,
  reducers: {
    clearBorrowRequests: (state) => {
      borrowRequestAdapter.removeAll(state);
      state.nextPage = 1;
      state.hasMore = true;
      state.status = "idle";
    },
  },
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
      })
      .addCase(getBorrowRequests.pending, (state) => {
        state.status = "idleGetBorrowRequests";
      })
      .addCase(getBorrowRequests.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          borrowRequestAdapter.setAll(state, items);
        } else {
          borrowRequestAdapter.addMany(state, items);
        }
        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? null : page + 1;
      })
      .addCase(getBorrowRequests.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(getMyBorrowRequests.pending, (state) => {
        state.status = "idlegetMyBorrowRequests";
      })
      .addCase(getMyBorrowRequests.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          borrowRequestAdapter.setAll(state, items);
        } else {
          borrowRequestAdapter.addMany(state, items);
        }
        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? null : page + 1;
      })
      .addCase(getMyBorrowRequests.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(createOffer.pending, (state) => {
        state.status = "pendingCreateOffer";
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.status = "idle";
        const formdata = action.meta.arg as FormData;
        const borrowRequestId = formdata.get("borrowRequestId") as string;

        const existingBorrowRequest = state.entities[borrowRequestId];
        if (existingBorrowRequest) {
          existingBorrowRequest.borrowRequestActionsDto.hasOffered = true;
          existingBorrowRequest.borrowRequestActionsDto.canMakeOffer = false;
        }
      })
      .addCase(createOffer.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const { clearBorrowRequests } = borrowRequstSlice.actions;

export const { selectAll: selectAllBorrowRequests } =
  borrowRequestAdapter.getSelectors((state: RootState) => state.borrowRequests);
