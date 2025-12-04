import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Box,
  IconButton,
  Stack,
  useTheme,
  ButtonBase,
} from "@mui/material";
// Phosphor Icon'larını import ediyoruz
import {
  Heart,
  ChatCircle,
  ShareNetwork,
  Globe,
  HouseLine,
  DotsThree,
} from "@phosphor-icons/react";

// --- TİP TANIMLAMALARI ---
export interface Post {
  id: number | string;
  userName: string;
  userAvatar?: string;
  timeAgo: string; // Örn: "6 saat önce"
  location: string; // Örn: "Kadıköy"
  visibility: "public" | "neighborhood"; // İkon seçimi için
  content: string;
  imageUrl?: string | null;
  likes: number;
  comments: number;
}

interface SinglePostCardProps {
  post: Post;
}

const SinglePostCard: React.FC<SinglePostCardProps> = ({ post }) => {
  const theme = useTheme();

  // "Daha fazla oku" durumu için state
  const [expanded, setExpanded] = useState(false);

  // Görünürlük ikonunu belirleyen yardımcı fonksiyon
  const getVisibilityIcon = () => {
    if (post.visibility === "public") {
      return <Globe size={16} weight="regular" />;
    }
    return <HouseLine size={16} weight="regular" />;
  };

  return (
    <Card
      elevation={0} // Gölgeyi kaldırdık (Daha clean görünüm için)
      variant="outlined"
      sx={{
        borderRadius: 3,
        mb: 2, // Kartlar arası boşluk
        bgcolor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        overflow: "hidden",
      }}
    >
      {/* --- 1. HEADER (SOLDA PP, SAĞDA BİLGİLER) --- */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Profil Fotoğrafı */}
          <Avatar
            src={post.userAvatar}
            alt={post.userName}
            sx={{ width: 44, height: 44 }}
          />

          {/* İsim ve Meta Bilgiler */}
          <Box>
            {/* İsim Soyisim */}
            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.1}>
              {post.userName}
            </Typography>

            {/* Alt Satır: Konum • Zaman • İkon */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mt: 0.5 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="medium"
              >
                {post.location}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                •
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {post.timeAgo}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", ml: 0.5 }}
              >
                {getVisibilityIcon()}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Sağ Üst Köşe Seçenekler (Opsiyonel) */}
        <IconButton size="small">
          <DotsThree size={24} weight="bold" />
        </IconButton>
      </Box>

      {/* --- 2. İÇERİK METNİ (HEADER ALTINA GELDİ) --- */}
      <CardContent sx={{ pt: 0, pb: 1, px: 2 }}>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            // Eğer expanded değilse ve resim varsa 2 satırla sınırla
            // Resim yoksa genelde metin tamamı okunur ama isteğe göre sınır konabilir.
            display: expanded ? "block" : "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: expanded ? "none" : 2, // 2 satır sınırı
            lineHeight: 1.5,
            whiteSpace: "pre-line", // Satır boşluklarını korur
          }}
        >
          {post.content}
        </Typography>

        {/* Metin uzunsa "Daha fazla" butonu göster */}
        {/* Not: Basitlik adına her zaman gösterilebilir veya karakter sayısına göre kontrol edilebilir */}
        {!expanded && post.content.length > 100 && (
          <ButtonBase
            onClick={() => setExpanded(true)}
            sx={{
              mt: 0.5,
              typography: "body2",
              color: "text.secondary",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            ... daha fazla görüntüle
          </ButtonBase>
        )}
      </CardContent>

      {/* --- 3. GÖRSEL ALANI (METNİN ALTINDA) --- */}
      {post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt="Post content"
          sx={{
            width: "100%",
            height: "auto", // OTOMATİK UZUNLUK (Oranı korur)
            display: "block",
            maxHeight: "600px", // Çok aşırı uzun görseller ekranı kaplamasın diye güvenlik önlemi
            objectFit: "contain", // Görseli kırpmaz, sığdırır
            bgcolor: "#f0f2f5", // Resim yüklenirken arkada hafif gri fon
          }}
        />
      )}

      {/* --- 4. AKSİYONLAR (Çizgi Yok) --- */}
      <CardActions sx={{ px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={3} width="100%" alignItems="center">
          {/* Beğen */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.8}
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { color: theme.palette.error.main }, // Hoverda kırmızı olsun
            }}
          >
            <Heart size={24} />
            <Typography variant="body2" fontWeight="medium">
              {post.likes > 0 ? post.likes : "Beğen"}
            </Typography>
          </Stack>

          {/* Yorum */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.8}
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            <ChatCircle size={24} />
            <Typography variant="body2" fontWeight="medium">
              {post.comments > 0 ? post.comments : "Yorum Yap"}
            </Typography>
          </Stack>

          {/* Paylaş (Sağa Yaslı) */}
          <Box sx={{ ml: "auto !important" }}>
            <IconButton size="small">
              <ShareNetwork size={24} />
            </IconButton>
          </Box>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default SinglePostCard;
