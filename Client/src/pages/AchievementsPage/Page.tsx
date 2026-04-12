import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Chip,
  Stack,
} from "@mui/material";
import AchievementBadge from "../../components/AchievementBadge";
import type { Achievement } from "../../components/AchievementBadge";

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "İlk Paylaşım",
    description: "İlk eşyanı paylaş",
    icon: "star",
    progress: 100,
    unlocked: true,
    unlockedAt: "12 Ocak 2026",
    rarity: "common",
  },
  {
    id: "2",
    title: "Cömert Komşu",
    description: "10 eşya paylaş",
    icon: "trophy",
    progress: 70,
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "3",
    title: "Sosyal Kelebek",
    description: "5 etkinliğe katıl",
    icon: "medal",
    progress: 40,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "4",
    title: "Mahalle Lideri",
    description: "50 komşuyla etkileşime geç",
    icon: "crown",
    progress: 15,
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "5",
    title: "Mesaj Ustası",
    description: "100 mesaj gönder",
    icon: "star",
    progress: 100,
    unlocked: true,
    unlockedAt: "5 Şubat 2026",
    rarity: "rare",
  },
  {
    id: "6",
    title: "Etkinlik Düzenleyici",
    description: "İlk etkinliğini oluştur",
    icon: "trophy",
    progress: 100,
    unlocked: true,
    unlockedAt: "20 Ocak 2026",
    rarity: "common",
  },
];

const AchievementsPage: React.FC = () => {
  const [tab, setTab] = React.useState(0);

  const unlocked = mockAchievements.filter((a) => a.unlocked);
  const locked = mockAchievements.filter((a) => !a.unlocked);
  const displayed =
    tab === 0 ? mockAchievements : tab === 1 ? unlocked : locked;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Typography variant="h4" fontWeight={700}>
          🏆 Başarılar
        </Typography>
        <Chip
          label={`${unlocked.length}/${mockAchievements.length}`}
          color="primary"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Stack>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Komşuluk yolculuğunda rozetler kazan ve seviyeni yükselt!
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
        <Tab label="Tümü" />
        <Tab label="Kazanılan" />
        <Tab label="Devam Eden" />
      </Tabs>

      <Grid container spacing={3}>
        {displayed.map((a) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={a.id}>
            <AchievementBadge achievement={a} />
          </Grid>
        ))}
      </Grid>

      {displayed.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Bu kategoride henüz başarı yok 😔
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default AchievementsPage;
