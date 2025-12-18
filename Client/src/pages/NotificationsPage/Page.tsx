import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  clearNotifications,
  getMeNotifications,
  selectAllNotifications,
} from "../../features/notifications/store/notificationSlice";
import NotificationCard from "../../components/NotificationCard";
import { useEffect } from "react";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const { hasMore } = useAppSelector((state) => state.notification);

  useEffect(() => {
    dispatch(clearNotifications());
    dispatch(getMeNotifications());

    return () => {
      dispatch(clearNotifications());
    };
  }, [dispatch]);
  const handle = () => {};
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: "750px",
        px: { xs: 0, md: 2 },
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1.15rem", sm: "1.5rem" },
          mb: 2,
        }}
      >
        Bildirimler
      </Typography>
      {notifications ? (
        <InfiniteScroll
          dataLength={notifications.length}
          next={() => dispatch(getMeNotifications())}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
              <CircularProgress size={20} />
            </Box>
          }
          endMessage={
            notifications.length > 0 && (
              <Typography
                variant="caption"
                display="block"
                align="center"
                color="text.secondary"
                py={2}
              >
                Tüm bildirimler listelendi.
              </Typography>
            )
          }
        >
          {notifications.map((notification) => (
            <NotificationCard notification={notification} onRead={handle} />
          ))}
        </InfiniteScroll>
      ) : (
        "Bildirim yok"
      )}
    </Container>
  );
}
