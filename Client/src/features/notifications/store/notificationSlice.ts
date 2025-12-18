import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import type { NotificationEntity } from "../../../entities/notification/Notification";
import type { RootState } from "../../../app/store/store";
import { Notification } from "../api/NotificationApi";

interface GetNotificationResponse {
  items: NotificationEntity[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export const notificationAdapter = createEntityAdapter<
  NotificationEntity,
  string
>({
  selectId: (notification) => notification.id,
});

interface NotificationState {
  status: string;
  nextPage: number;
  hasMore: boolean;
}

const initialState = notificationAdapter.getInitialState<NotificationState>({
  status: "idle",
  nextPage: 1,
  hasMore: true,
});

export const getMeNotifications = createAsyncThunk<
  GetNotificationResponse,
  void,
  { state: RootState }
>("notification/getMeNotifications", async (_, { getState }) => {
  const state = getState();
  const page = state.borrowRequests.nextPage ?? 1;

  const response = await Notification.getNotifications(page);
  return response.data;
});

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      notificationAdapter.removeAll(state);
      state.nextPage = 1;
      state.hasMore = true;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeNotifications.pending, (state) => {
        state.status = "idleGetBorrowRequests";
      })
      .addCase(getMeNotifications.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          notificationAdapter.setAll(state, items);
        } else {
          notificationAdapter.addMany(state, items);
        }
        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? 1 : page + 1;
      })
      .addCase(getMeNotifications.rejected, (state) => {
        state.status = "idle";
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;

export const { selectAll: selectAllNotifications } =
  notificationAdapter.getSelectors((state: RootState) => state.notification);
