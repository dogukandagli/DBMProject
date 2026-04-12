import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import WeeklyActivityChart from "../../components/WeeklyActivityChart";
import NeighborhoodMap from "../../components/NeighborhoodMap";
import NotificationPreferences from "../../components/NotificationPreferences";
import DashboardStats from "../../components/DashboardStats";

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Merhaba, Komşu! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          İşte mahallendeki son durumun.
        </Typography>
      </Box>

      {/* İstatistikler */}
      <Box mb={4}>
        <DashboardStats
          totalShared={24}
          totalEvents={8}
          totalMessages={156}
          rating={4}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Haftalık Aktivite */}
        <Grid size={{ xs: 12, md: 6 }}>
          <WeeklyActivityChart />
        </Grid>

        {/* Mahalle Haritası */}
        <Grid size={{ xs: 12, md: 6 }}>
          <NeighborhoodMap />
        </Grid>

        {/* Bildirim Tercihleri */}
        <Grid size={{ xs: 12 }}>
          <NotificationPreferences />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
