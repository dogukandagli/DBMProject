import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  InputBase,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { apiUrl } from "../shared/api/ApiClient";
import { useAppSelector } from "../app/store/hooks";
import {
  ArrowCircleRight,
  DotsThree,
  Pencil,
  TrashSimple,
} from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { Comment } from "../entities/post/PostComment";
import { getInitials } from "../pages/EditProfilePage/Page";

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
  // YENİ: Edit fonksiyonunu buraya ekledik
  onEdit: (commentId: string, newContent: string) => void;
}

export const CommentItem = ({
  comment,
  onDelete,
  onEdit,
}: CommentItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);

  const open = Boolean(anchorEl);

  const { content, commentAuthorDto, commentCapabilitiesDto } = comment;
  const { fullName, profilePhotoUrl } = commentAuthorDto;
  const { canEdit, canDelete } = commentCapabilitiesDto || {
    canEdit: false,
    canDelete: false,
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(comment.commentId);
    handleMenuClose();
  };
  const handleStartEdit = () => {
    setEditValue(content);
    setIsEditing(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(content);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() !== "" && editValue !== content) {
      onEdit(comment.commentId, editValue);
    }
    setIsEditing(false);
  };

  const displayDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, alignItems: "flex-start" }}>
      <Avatar
        src={`${apiUrl}user-profilephoto/${profilePhotoUrl}` || ""}
        alt={fullName}
        sx={{ width: 45, height: 45, cursor: "pointer" }}
      >
        {getInitials(fullName)}
      </Avatar>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* İsim ve Tarih Başlığı */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 0.3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              mr: 1,
              cursor: "pointer",
            }}
          >
            {fullName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: "0.8rem" }}
          >
            {displayDate}
          </Typography>
        </Box>

        {/* --- İÇERİK VEYA EDİT ALANI --- */}
        {isEditing ? (
          <Box sx={{ mt: 0.5 }}>
            <TextField
              fullWidth
              multiline
              autoFocus
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              variant="outlined"
              placeholder="Yorumunuzu düzenleyin..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.paper",
                  fontSize: "0.95rem",
                  borderRadius: 2,
                  padding: 1,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            />
            {/* Butonlar */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1, justifyContent: "flex-end" }}
            >
              <Button
                size="small"
                color="inherit"
                onClick={handleCancelEdit}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  color: "text.secondary",
                }}
              >
                İptal
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveEdit}
                disabled={!editValue.trim() || editValue === content}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  borderRadius: 4,
                  boxShadow: "none",
                  px: 2,
                }}
              >
                Kaydet
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontSize: "0.95rem",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {content}
          </Typography>
        )}
      </Box>

      {/* --- MENÜ (Edit modunda gizliyoruz) --- */}
      {!isEditing && (
        <Box>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              padding: 0.5,
              color: "text.disabled",
              "&:hover": { color: "text.primary" },
            }}
          >
            <DotsThree size={20} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                minWidth: 150,
                borderRadius: 3,
                mt: 1,
                "& .MuiMenuItem-root": { fontSize: "0.9rem", gap: 1.5, py: 1 },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {canEdit && (
              // onClick artık handleStartEdit'i çağırıyor
              <MenuItem onClick={handleStartEdit}>
                <Pencil size={20} /> Düzenle
              </MenuItem>
            )}

            {canDelete && (
              <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                <TrashSimple size={20} /> Sil
              </MenuItem>
            )}
          </Menu>
        </Box>
      )}
    </Box>
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
        <IconButton onSubmit={handleSend} disabled={isLoading || !text.trim()}>
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
