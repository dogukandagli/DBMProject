import { type FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  CardActionArea,
  useTheme,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import type { NotificationEntity } from "../entities/notification/Notification";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble"; // Message
import NotificationsIcon from "@mui/icons-material/Notifications"; // Default
import { CheckCircle, Handshake } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface NotificationCardProps {
  notification: NotificationEntity;
  onRead: (id: string | number) => void;
}

const getNotificationConfig = (type: string) => {
  switch (type) {
    case "OfferAccepted":
      return { icon: <CheckCircle /> };
    case "NewOffer":
      return { icon: <Handshake /> }; // Turuncu
    case "NEW_MESSAGE":
      return { icon: <ChatBubbleIcon fontSize="small" /> }; // Mavi
    default:
      return { icon: <NotificationsIcon fontSize="small" /> }; // Gri
  }
};

const NotificationCard: FC<NotificationCardProps> = ({
  notification,
  onRead,
}) => {
  const theme = useTheme();
  const { id, title, message, createdAt, type } = notification;

  const { icon } = getNotificationConfig(type);

  const displayDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: tr,
  });
  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        borderRadius: 3,
        border: "2px solid",
        borderColor: true ? "divider" : theme.palette.primary.light,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <CardActionArea onClick={() => onRead(id)} sx={{ p: 0.5 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            p: "12px !important",
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${theme.palette.icon.background}`,
              color: `${theme.palette.icon.main}`,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: true ? 500 : 700,

                  color: "text.primary",
                  fontSize: "0.95rem",
                }}
              >
                {title}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontWeight: 500 }}
                >
                  {displayDate}
                </Typography>
                {!true && (
                  <CircleIcon sx={{ fontSize: 10, color: "primary.main" }} />
                )}
              </Stack>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "text.secondary",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {message}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NotificationCard;
