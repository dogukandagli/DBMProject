import React, { useEffect, useState, type FC } from "react";
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
  Button,
  Chip,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  DoneAll as DoneAllIcon,
  Check as CheckIcon,
  Circle as CircleIcon,
  QrCode as QrCodeIcon,
  QrCodeScanner as QrScannerIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { apiUrl } from "../shared/api/ApiClient";
import { formatDate } from "../utils/dateUtils";
import type { ConversationEntity } from "../entities/chat/ConversationEntity";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import {
  getConversationDetail,
  getConversations,
  selectAllConversations,
} from "../features/chats/store/ConversationStore";
import {
  RequiredAction,
  type ConversationData,
  type LoanContextDto,
} from "../entities/chat/ConversationData";
import { useChatSignalR } from "../hooks/useChatSignalR";
import {
  generateHandoverQr,
  generateReturnQr,
  scanHandoverQr,
  scanReturnQr,
} from "../features/loanTransactions/store/loanTransactionSlice";
import { QrDisplayModal } from "./QrDisplayModal";
import { QrScanModal } from "./QrScanModal";

const formatDateRange = (start: string, end: string) => {
  if (!start || !end) return "";
  try {
    const s = new Date(start);
    const e = new Date(end);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return `${s.toLocaleDateString("tr-TR", options)} - ${e.toLocaleDateString(
      "tr-TR",
      options
    )}`;
  } catch (e) {
    return "";
  }
};

const ChatHeader: FC<{
  chat: ConversationData;
  onShowQr: () => void;
  onScanQr: () => void;
}> = ({ chat, onShowQr, onScanQr }) => {
  const theme = useTheme();

  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const loanContext = (chat as any).loanContextDto as
    | LoanContextDto
    | undefined;
  const isLoanChat = chat.conversationType === "LoanTransaction" && loanContext;

  const amILender = currentUserId === chat.loanContextDto.lenderId;
  const amIBorrower = currentUserId === chat.loanContextDto.borrowerId;

  console.log(amIBorrower, amILender);
  const renderActionButton = () => {
    if (!isLoanChat || !loanContext) return null;

    const { requiredAction } = loanContext;

    if (requiredAction === RequiredAction.LenderGeneratePickupQr) {
      if (amILender) {
        return (
          <Button
            variant="contained"
            onClick={onShowQr}
            startIcon={<QrCodeIcon />}
          >
            Teslim Et (QR Oluştur)
          </Button>
        );
      }

      if (amIBorrower) {
        return (
          <Button
            variant="contained"
            color="warning"
            onClick={onScanQr}
            startIcon={<QrScannerIcon />}
          >
            Teslim Al (QR Tara)
          </Button>
        );
      }
    }

    if (requiredAction === RequiredAction.BorrowerGenerateReturnQr) {
      if (amIBorrower) {
        return (
          <Button
            variant="contained"
            onClick={onShowQr}
            startIcon={<QrCodeIcon />}
          >
            İade Et (QR Oluştur)
          </Button>
        );
      }

      if (amILender) {
        return (
          <Button
            variant="contained"
            color="warning"
            onClick={onScanQr}
            startIcon={<QrScannerIcon />}
          >
            İade Al (QR Tara)
          </Button>
        );
      }
    }

    return null;
  };

  const getStatusChipProps = (status: string) => {
    switch (status) {
      case "Active":
        return {
          label: "Kullanımda",
          color: "success" as const,
          icon: <CheckCircleIcon />,
        };
      case "PendingPickup":
        return {
          label: "Teslim Bekleniyor",
          color: "warning" as const,
          icon: <AccessTimeIcon />,
        };
      case "PendingReturn":
        return {
          label: "İade Bekleniyor",
          color: "warning" as const,
          icon: <AccessTimeIcon />,
        };
      case "Completed":
        return {
          label: "Tamamlandı",
          color: "default" as const,
          icon: <CheckCircleIcon />,
        };
      default:
        return {
          label: "Oluşturuldu",
          color: "default" as const,
          icon: <AccessTimeIcon />,
        };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #eee",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={
              chat.avatarUrl
                ? `${apiUrl}user-profilephoto/${chat.avatarUrl}`
                : undefined
            }
            sx={{ bgcolor: theme.palette.primary.main }}
          >
            {chat.title?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {chat.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {chat.subtitle || "Çevrimiçi"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {renderActionButton()}
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </Box>

      {isLoanChat && loanContext && (
        <Box
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            px: 2,
            py: 1,
            borderTop: "1px dashed #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {formatDateRange(
                loanContext.loanPeriodStart,
                loanContext.loanPeriodEnd
              )}
            </Typography>
          </Stack>
          {(() => {
            const props = getStatusChipProps(loanContext.transactionStatus);
            return (
              <Chip
                label={props.label}
                size="small"
                color={props.color}
                icon={props.icon}
                variant={
                  loanContext.transactionStatus === "Created"
                    ? "outlined"
                    : "filled"
                }
                sx={{ fontWeight: 600, height: 24 }}
              />
            );
          })()}
        </Box>
      )}
    </Box>
  );
};

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

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const inboxItems = useAppSelector(selectAllConversations);
  const activeChat = useAppSelector(
    (state) => state.conversation.conservationDetail
  );

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useChatSignalR(selectedChatId);

  const [inputText, setInputText] = useState("");

  const selectedChat = inboxItems.find((c) => c.id === selectedChatId);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);
  useEffect(() => {
    if (selectedChatId) {
      dispatch(getConversationDetail(selectedChatId));
    }
  }, [dispatch, selectedChatId]);
  useEffect(() => {
    if (inboxItems.length > 0 && !selectedChatId) {
      setSelectedChatId(inboxItems[0].id);
    }
  }, [inboxItems, selectedChatId]);

  const [showScanModal, setShowScanModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrString, setQrString] = useState("");

  const handleShowQrClick = async () => {
    if (!activeChat?.loanContextDto?.loanTransactionId) return;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Tarayıcınız konum servisini desteklemiyor."));
          } else {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (err) => reject(err),
              { enableHighAccuracy: true, timeout: 15000 }
            );
          }
        }
      );
      const { latitude, longitude } = position.coords;
      let qrString = "";
      if (
        activeChat.loanContextDto.requiredAction ==
        RequiredAction.LenderGeneratePickupQr
      ) {
        qrString = await dispatch(
          generateHandoverQr({
            loanTransactionId: activeChat.loanContextDto.loanTransactionId,
            latitude: latitude,
            longitude: longitude,
          })
        ).unwrap();
      } else if (
        activeChat.loanContextDto.requiredAction ==
        RequiredAction.BorrowerGenerateReturnQr
      ) {
        qrString = await dispatch(
          generateReturnQr({
            loanTransactionId: activeChat.loanContextDto.loanTransactionId,
            latitude: latitude,
            longitude: longitude,
          })
        ).unwrap();
      }

      setQrString(qrString);
      setShowQrModal(true);
    } catch (error) {
      console.error("QR oluşturma hatası:", error);
      if (error instanceof GeolocationPositionError) {
        alert("QR kodunu oluşturmak için konum izni vermeniz gerekmektedir.");
      } else {
        alert("QR oluşturulurken bir hata oluştu.");
      }
    }
  };

  const handleScanSuccess = async (scannedQrData: string) => {
    setShowScanModal(false);
    console.log("QR Okundu:", scannedQrData);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Tarayıcınız konum servisini desteklemiyor."));
          } else {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (err) => reject(err),
              { enableHighAccuracy: true, timeout: 15000 }
            );
          }
        }
      );
      const { latitude, longitude } = position.coords;
      if (
        activeChat?.loanContextDto.requiredAction ==
        RequiredAction.LenderGeneratePickupQr
      ) {
        dispatch(
          scanHandoverQr({
            qrHash: scannedQrData,
            latitude: latitude,
            longitude: longitude,
          })
        );
      } else if (
        activeChat?.loanContextDto.requiredAction ==
        RequiredAction.BorrowerGenerateReturnQr
      ) {
        dispatch(
          scanReturnQr({
            qrHash: scannedQrData,
            latitude: latitude,
            longitude: longitude,
          })
        );
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        alert("QR kodunu oluşturmak için konum izni vermeniz gerekmektedir.");
      } else {
        alert("QR oluşturulurken bir hata oluştu.");
      }
    }
  };
  return (
    <Box sx={{ height: "100vh" }}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          height: "100%",
          maxWidth: 1400,
          mx: "auto",
          bgcolor: "transparent",
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{ width: 320, display: "flex", flexDirection: "column", mr: 3 }}
        >
          <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 2 }}
            >
              <SearchIcon sx={{ color: "text.secondary" }} />
              <InputBase placeholder="Sohbetlerde ara..." fullWidth />
            </Stack>
          </Paper>

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

        <Card
          variant="outlined"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {selectedChat && activeChat ? (
            <>
              <ChatHeader
                chat={activeChat}
                onShowQr={handleShowQrClick}
                onScanQr={() => setShowScanModal(true)}
              />

              <QrDisplayModal
                open={showQrModal}
                onClose={() => setShowQrModal(false)}
                qrData={qrString}
              />

              <QrScanModal
                open={showScanModal}
                onClose={() => setShowScanModal(false)}
                onScan={handleScanSuccess}
              />

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
        </Card>
      </Paper>
    </Box>
  );
};

export default ChatPage;
