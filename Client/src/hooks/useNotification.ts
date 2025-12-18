import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import * as signalR from "@microsoft/signalr";
import type { NotificationEntity } from "../entities/notification/Notification";
import { apiUrl } from "../shared/api/ApiClient";
import { addNotification } from "../features/notifications/store/notificationSlice";

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const accesstoken = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}hubs/notification`, {
        accessTokenFactory: () => accesstoken ?? "",
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        connection.on(
          "ReceiveNotification",
          (notification: NotificationEntity) => {
            dispatch(addNotification(notification));
          }
        );
      })
      .catch((err) => console.error("SignalR hatasi", err));

    return () => {
      connection.stop();
    };
  }, [dispatch]);
};
