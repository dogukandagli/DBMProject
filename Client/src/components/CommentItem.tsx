import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowCircleRight } from "@phosphor-icons/react";
import { apiUrl } from "../shared/api/ApiClient";
import { useAppSelector } from "../app/store/hooks";
import { useState } from "react";

interface CommentProps {
  username: string;
  avatarUrl?: string;
  text: string;
  time: string;
}

export const CommentItem = ({
  username,
  avatarUrl,
  text,
  time,
}: CommentProps) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
      <Avatar src={avatarUrl} alt={username} sx={{ width: 32, height: 32 }} />

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            bgcolor: theme.palette.action.hover,
            borderRadius: 3,
            px: 2,
            py: 1,
            display: "inline-block",
            maxWidth: "100%",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" fontSize={13}>
            {username}
          </Typography>
          <Typography
            variant="body2"
            fontSize={14}
            sx={{ wordBreak: "break-word" }}
          >
            {text}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 0.5, ml: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {time}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

interface CommentInputProps {
  isLoading?: boolean;
  onSubmit: (text: string) => void;
}

export const CommentInput = ({ isLoading, onSubmit }: CommentInputProps) => {
  const theme = useTheme();
  const [text, setText] = useState("");
  const user = useAppSelector((state) => state.auth.user);

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
      <Avatar
        src={`${apiUrl}user-profilephoto/${user?.profilePhotoUrl}`}
        sx={{ width: 50, height: 50 }}
      />

      <Paper
        component="form"
        variant="outlined"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          flex: 1,
          borderRadius: 20,
          boxShadow: "none",
        }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1, fontSize: 14 }}
          placeholder="Yorum yaz..."
          multiline
          maxRows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <IconButton disabled={isLoading || !text.trim()}>
          <ArrowCircleRight
            size={32}
            color={theme.palette.icon.main}
            weight="fill"
          />
        </IconButton>
      </Paper>
    </Stack>
  );
};
