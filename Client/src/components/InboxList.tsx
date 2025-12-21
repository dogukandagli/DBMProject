import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Avatar,
  Stack,
  useTheme,
} from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

// 1. Veri Tipi Tanımlaması (Interface)
interface InboxItemData {
  id: string;
  title: string;
  avatarUrl: string;
  type: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  relatedEntityId: string;
}

// Örnek Veri
const inboxData: InboxItemData[] = [
  {
    id: "019b3dff-f3e6-73d8-8380-364aaadf1b45",
    title: " Kredi İşlemi",
    avatarUrl: "134092386431993678.pp.jpg",
    type: 2,
    lastMessage: "İşleminiz başlatıldı.",
    lastMessageAt: "2025-12-21T00:00:00+00:00", // Backend'den gelen default tarih
    relatedEntityId: "019b3dff-f385-78b8-aa8f-75b0be2ff4c5",
  },
  {
    id: "019b3dd3-5099-7e46-be40-697f004247de",
    title: " Kredi İşlemi",
    avatarUrl: "134092386431993678.pp.jpg",
    type: 2,
    lastMessage: null,
    lastMessageAt: null,
    relatedEntityId: "019b3dd3-5015-7264-8d10-fa3876df5352",
  },
];

export function getDisplayDate(dateString?: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: tr,
  });
}

// 2. Alt Bileşen Props Tanımı
interface InboxItemProps {
  item: InboxItemData;
  onClick?: (id: string) => void;
}

const InboxItem: React.FC<InboxItemProps> = ({ item, onClick }) => {
  const theme = useTheme();

  const formattedDate = getDisplayDate(item.lastMessageAt);
  const hasMessage = item.lastMessage && item.lastMessage.trim().length > 0;

  // Avatar için base URL (Gerekirse burayı projenize göre güncelleyin)
  // const fullAvatarUrl = `https://api.domain.com/uploads/${item.avatarUrl}`;
  // Şimdilik direkt veriyi kullanıyoruz:
  const avatarSrc = item.avatarUrl;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 2,
        borderColor: theme.palette.grey[300],
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardActionArea onClick={() => onClick?.(item.id)}>
        <CardContent sx={{ py: 2, px: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Avatar Alanı */}
            <Avatar
              alt={item.title}
              src={avatarSrc}
              sx={{
                width: 50,
                height: 50,
                bgcolor: theme.palette.primary.light,
                fontSize: "1.2rem",
              }}
            >
              {item.title.trim().charAt(0).toUpperCase()}
            </Avatar>

            {/* Metin Alanı */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                mb={0.5}
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  fontWeight={600}
                  noWrap
                >
                  {item.title}
                </Typography>

                {formattedDate && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ minWidth: "fit-content", ml: 1 }}
                  >
                    <TimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {formattedDate}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Typography
                variant="body2"
                color={hasMessage ? "text.primary" : "text.secondary"}
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  fontStyle: hasMessage ? "normal" : "italic",
                  opacity: hasMessage ? 1 : 0.7,
                }}
              >
                {hasMessage ? item.lastMessage : "Mesaj içeriği bulunmuyor"}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// Ana Bileşen
const InboxList: React.FC = () => {
  const handleItemClick = (id: string) => {
    console.log(`Mesaja tıklandı ID: ${id}`);
    // Router yönlendirmesi buraya eklenebilir
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3, color: "text.primary" }}
      >
        Mesajlarım
      </Typography>

      {inboxData.map((item) => (
        <InboxItem key={item.id} item={item} onClick={handleItemClick} />
      ))}

      {inboxData.length === 0 && (
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mt={4}
        >
          Gelen kutunuz boş.
        </Typography>
      )}
    </Box>
  );
};

export default InboxList;
