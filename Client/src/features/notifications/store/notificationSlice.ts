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
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

interface NotificationState {
  status: string;
  nextPage: number;
  hasMore: boolean;
  unreadCount: number;
}

const initialState = notificationAdapter.getInitialState<NotificationState>({
  status: "idle",
  nextPage: 1,
  hasMore: true,
  unreadCount: 0,
});

export const getMeNotifications = createAsyncThunk<
  GetNotificationResponse,
  void,
  { state: RootState }
>("notification/getMeNotifications", async (_, { getState }) => {
  const state = getState();
  const page = state.notification.nextPage ?? 1;

  const response = await Notification.getNotifications(page);
  return response.data;
});

export const markNotificationAsRead = createAsyncThunk<
  void,
  { notificationId: string }
>("notification/markNotificationAsRead", async (data) => {
  const response = await Notification.markNotificationAsRead(data);
  return response.data;
});

export const getUnreadNotificationCount = createAsyncThunk<
  UnreadCountResponse,
  void
>("notification/getUnreadNotificationCount", async () => {
  const response = await Notification.GetUnreadNotificationCount();
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
    addNotification: (state, action) => {
      const id = action.payload.id;
      const exists = state.entities[id];
      notificationAdapter.addOne(state, action.payload);
      if (!exists) state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeNotifications.pending, (state) => {
        state.status = "pendingGetMeNotifications";
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
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.status = "pendingMarkNotificationAsRead";
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.status = "idle";
        const { notificationId } = action.meta.arg;
        const existingNotification = state.entities[notificationId];
        if (existingNotification) {
          existingNotification.isRead = true;
          state.unreadCount -= 1;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
        state.status = "idle";
        state.unreadCount = action.payload.unReadNotificationsCount;
      });
  },
});

export const { clearNotifications, addNotification } =
  notificationSlice.actions;

export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectEntities: selectNotificationEntities,
} = notificationAdapter.getSelectors((state: RootState) => state.notification);

interface UnreadCountResponse {
  unReadNotificationsCount: number;
}
