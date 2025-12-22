import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Avatar,
  Stack,
  useTheme,
  Paper,
  InputBase,
  IconButton,
  Divider,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as InsertEmoticonIcon,
  Send as SendIcon,
  DoneAll as DoneAllIcon,
  Check as CheckIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";

// ==================== TİP TANIMLARI ====================

interface Message {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
}

// ==================== ÖRNEK VERİ ====================

const mockChatHistory: Message[] = [
  {
    id: "m1",
    text: "Merhaba, proje ne durumda?",
    createdAt: "2023-10-27T10:30:00",
    senderId: "other",
  },
  {
    id: "m2",
    text: "Selam, tasarımları bitirmek üzereyim.",
    createdAt: "2023-10-27T10:35:00",
    senderId: "me",
  },
];

// ==================== 1. INBOX KARTI (OUTLINED DESIGN) ====================

const InboxItemCard: React.FC<{
  item: ConversationEntity;
  isSelected: boolean;
  onClick: () => void;
}> = ({ item, isSelected, onClick }) => {
  const theme = useTheme();
  const formattedDate = formatDate(item.lastMessageAt);

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        borderRadius: 3,
        borderColor: isSelected
          ? theme.palette.icon.main
          : theme.palette.divider,
        bgcolor: isSelected
          ? alpha(theme.palette.icon.main, 0.08)
          : "background.paper",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: theme.palette.icon.main,
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ py: 2, px: 2, "&:last-child": { pb: 2 } }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              alt={item.title}
              src={
                item.avatarUrl
                  ? `${apiUrl}user-profilephoto/${item.avatarUrl}`
                  : undefined
              }
              sx={{
                width: 50,
                height: 50,
              }}
            >
              {item.title ? item.title.charAt(0).toUpperCase() : "?"}
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                mb={0.5}
              >
                <Typography
                  variant="subtitle1"
                  noWrap
                  fontWeight={!item.isReadByMe ? 700 : 600}
                >
                  {item.title}
                </Typography>
                {formattedDate && (
                  <Typography
                    variant="caption"
                    color={"text.secondary"}
                    fontWeight={!item.isReadByMe ? 700 : 400}
                  >
                    {formattedDate}
                  </Typography>
                )}
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    mr: 1,
                  }}
                >
                  {item.isLastMessageFromMe && (
                    <Box component="span" sx={{ display: "flex", mr: 0.5 }}>
                      {item.isReadByRecipient ? (
                        <DoneAllIcon sx={{ fontSize: 16, color: "#4fc3f7" }} />
                      ) : (
                        <CheckIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                      )}
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    noWrap
                    color={!item.isReadByMe ? "text.primary" : "text.secondary"}
                    fontWeight={!item.isReadByMe ? 600 : 400}
                  >
                    {item.lastMessage ?? "Mesaj yok"}
                  </Typography>
                </Box>
                {!item.isReadByMe && (
                  <CircleIcon
                    sx={{ fontSize: 10, color: "primary.main", flexShrink: 0 }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const theme = useTheme();
  const isMe = message.senderId === "me";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: "75%",
          borderRadius: 4,
          bgcolor: isMe ? theme.palette.primary.main : "#fff",
          color: isMe ? "#fff" : "text.primary",
          boxShadow: isMe ? 2 : 1,
          borderBottomRightRadius: isMe ? 0 : 4,
          borderBottomLeftRadius: isMe ? 4 : 0,
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 0.5,
            opacity: 0.8,
            fontSize: "0.7rem",
          }}
        >
          {formatDate(message.createdAt)}
        </Typography>
      </Paper>
    </Box>
  );
};

import { alpha } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import {
  getConversations,
  selectAllConversations,
} from "../features/chats/store/ConversationStore";
import { useSelector } from "react-redux";
import type { ConversationEntity } from "../entities/chat/ConversationEntity";
import { apiUrl } from "../shared/api/ApiClient";
import { formatDate } from "../utils/dateUtils";

// ==================== ANA SAYFA ====================

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const inboxItems = useAppSelector(selectAllConversations);
  const theme = useTheme();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    inboxItems[0]?.id || null
  );
  const [inputText, setInputText] = useState("");

  const selectedChat = inboxItems.find((c) => c.id === selectedChatId);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <Box sx={{ height: "100vh" }}>
      {" "}
      {/* Tüm sayfa arka planı */}
      <Paper
        elevation={0} // Ana kağıdı düz yaptık, çünkü içerde kartlar var
        sx={{
          display: "flex",
          height: "100%",
          maxWidth: 1400,
          mx: "auto",
          bgcolor: "transparent", // Arka plan şeffaf
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{ width: 300, display: "flex", flexDirection: "column", mr: 3 }}
        >
          {/* Arama Alanı */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                bgcolor: `${theme.palette.icon.background}`,
                p: 1,
                borderRadius: 2,
              }}
            >
              <SearchIcon sx={{ color: "text.secondary" }} />
              <InputBase placeholder="Sohbetlerde ara..." fullWidth />
            </Stack>
          </Paper>

          {/* Kart Listesi */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
            {inboxItems.map((item) => (
              <InboxItemCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedChatId}
                onClick={() => setSelectedChatId(item.id)}
              />
            ))}
          </Box>
        </Box>

        {/* --- SAĞ PANEL (SOHBET PENCERESİ) --- */}
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {selectedChat ? (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={selectedChat.avatarUrl || undefined}
                  sx={{ bgcolor: theme.palette.primary.main }}
                >
                  {selectedChat.title?.charAt(0)}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedChat.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Çevrimiçi
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Mesaj Alanı */}
              <Box
                sx={{
                  flexGrow: 1,
                  p: 3,
                  overflowY: "auto",
                  bgcolor: "#fafafa",
                }}
              ></Box>

              {/* Input Alanı */}
              <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                  <InputBase
                    fullWidth
                    placeholder="Mesaj yazın..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    sx={{ bgcolor: "#f3f6f9", px: 2, py: 1.5, borderRadius: 3 }}
                  />
                  <IconButton color="primary" disabled={!inputText}>
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography color="text.secondary">Sohbet seçiniz</Typography>
            </Box>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default ChatPage;
