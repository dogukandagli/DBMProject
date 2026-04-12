import React, { useState } from "react";
import {
  Fab,
  Badge,
  Drawer,
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import { ChatCircle, X, PaperPlaneRight, ArrowLeft } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

const mockContacts: ChatContact[] = [
  { id: "1", name: "Ayşe Y.", avatar: "A", lastMessage: "Matkabı yarın getirebilir misin?", time: "2dk", unread: 2, online: true },
  { id: "2", name: "Mehmet K.", avatar: "M", lastMessage: "Teşekkürler komşum!", time: "15dk", unread: 0, online: true },
  { id: "3", name: "Zeynep D.", avatar: "Z", lastMessage: "Etkinliğe katılacak mısın?", time: "1sa", unread: 1, online: false },
];

const mockMessages: Message[] = [
  { id: "1", text: "Merhaba komşum!", sender: "other", time: "10:30" },
  { id: "2", text: "Merhaba! Nasılsın?", sender: "me", time: "10:31" },
  { id: "3", text: "İyiyim, matkabı yarın getirebilir misin?", sender: "other", time: "10:32" },
  { id: "4", text: "Tabii, sabah getiririm 👍", sender: "me", time: "10:33" },
];

const FloatingChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const totalUnread = mockContacts.reduce((sum, c) => sum + c.unread, 0);

  return (
    <>
      {/* FAB */}
      <motion.div
        style={{ position: "fixed", bottom: 24, left: 24, zIndex: 1000 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Fab
          color="secondary"
          onClick={() => setOpen(true)}
          sx={{ boxShadow: 6 }}
        >
          <Badge badgeContent={totalUnread} color="error" overlap="circular">
            <ChatCircle size={26} weight="fill" />
          </Badge>
        </Fab>
      </motion.div>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedContact(null);
        }}
        PaperProps={{
          sx: { width: 360, borderRadius: "0 16px 16px 0" },
        }}
      >
        <AnimatePresence mode="wait">
          {!selectedContact ? (
            /* Kişi Listesi */
            <motion.div
              key="contacts"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              style={{ height: "100%" }}
            >
              <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    💬 Sohbetler
                  </Typography>
                  <IconButton onClick={() => setOpen(false)}>
                    <X size={20} />
                  </IconButton>
                </Stack>
              </Box>
              <Divider />
              <List sx={{ py: 0 }}>
                {mockContacts.map((contact) => (
                  <ListItemButton
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-dot": {
                            bgcolor: contact.online ? "#4caf50" : "grey.400",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            border: "2px solid white",
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
                          {contact.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          {contact.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {contact.lastMessage}
                        </Typography>
                      }
                    />
                    <Stack alignItems="flex-end" spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {contact.time}
                      </Typography>
                      {contact.unread > 0 && (
                        <Chip
                          label={contact.unread}
                          size="small"
                          color="primary"
                          sx={{ height: 20, minWidth: 20, fontSize: 11-0 }}
                        />
                      )}
                    </Stack>
                  </ListItemButton>
                ))}
              </List>
            </motion.div>
          ) : (
            /* Mesaj Ekranı */
            <motion.div
              key="chat"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* Üst bar */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 2 }}>
                <IconButton onClick={() => setSelectedContact(null)}>
                  <ArrowLeft size={20} />
                </IconButton>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                  {selectedContact.avatar}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {selectedContact.name}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {selectedContact.online ? "Çevrimiçi" : "Çevrimdışı"}
                  </Typography>
                </Box>
                <IconButton onClick={() => { setOpen(false); setSelectedContact(null); }}>
                  <X size={18} />
                </IconButton>
              </Stack>
              <Divider />

              {/* Mesajlar */}
              <Box sx={{ flex: 1, overflow: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                {mockMessages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: msg.sender === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        bgcolor: msg.sender === "me" ? "primary.main" : "grey.200",
                        color: msg.sender === "me" ? "#fff" : "text.primary",
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: "block", textAlign: msg.sender === "me" ? "right" : "left" }}>
                      {msg.time}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Input */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ p: 2, borderTop: 1, borderColor: "divider" }}
              >
                <InputBase
                  placeholder="Mesaj yaz..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  sx={{
                    flex: 1,
                    bgcolor: "grey.100",
                    borderRadius: 3,
                    px: 2,
                    py: 0.5,
                  }}
                  fullWidth
                />
                <Fab size="small" color="primary">
                  <PaperPlaneRight size={18} weight="fill" />
                </Fab>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </>
  );
};

export default FloatingChatWidget;