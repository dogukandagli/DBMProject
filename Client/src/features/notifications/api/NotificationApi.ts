import { queries } from "../../../shared/api/ApiClient";

export const Notification = {
  getNotifications: (page: number) =>
    queries.get(`notifications/${page}/10?OnlyUnread=false`),
};
