import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import { X } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { getEventParticipants, clearParticipants } from "../features/events/store/EventSlice";
import { apiUrl } from "../shared/api/ApiClient";
import { getInitials } from "../pages/EditProfilePage/Page";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface EventParticipantsDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string | null;
}

export default function EventParticipantsDialog({
  open,
  onClose,
  eventId,
}: EventParticipantsDialogProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { participants, participantsStatus } = useAppSelector(
    (state) => state.eventRequests
  );

  useEffect(() => {
    if (open && eventId) {
      dispatch(getEventParticipants({ eventId, page: 1 }));
    } else {
      dispatch(clearParticipants());
    }
  }, [open, eventId, dispatch]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: tr,
      });
    } catch (e) {
      return "";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Katılımcılar
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} weight="bold" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {participantsStatus === "pending" && participants.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : participants.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Henüz katılımcı yok.</Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {participants.map((participant, index) => (
              <Box key={participant.userId}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        participant.profilePhotoUrl
                          ? `${apiUrl}/user-profilephoto/${participant.profilePhotoUrl}`
                          : undefined
                      }
                      alt={participant.fullName}
                    >
                      {getInitials(participant.fullName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600}>
                        {participant.fullName}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {formatDate(participant.CreatedAt)} katıldı
                      </Typography>
                    }
                  />
                </ListItem>
                {index < participants.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
