import { queries } from "../../../shared/api/ApiClient";

export const Notification = {
  getNotifications: (page: number) =>
    queries.get(`notifications/${page}/10?OnlyUnread=false`),
  markNotificationAsRead: (data: any) =>
    queries.post("notifications/mark-as-read", data),
};
