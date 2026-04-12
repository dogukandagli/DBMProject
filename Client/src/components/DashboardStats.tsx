import React from "react";
import { Grid, Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { Package, CalendarCheck, ChatCircle, Star } from "@phosphor-icons/react";
import AnimatedCounter from "./AnimatedCounter";

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  gradient: string;
}

interface DashboardStatsProps {
  totalShared: number;
  totalEvents: number;
  totalMessages: number;
  rating: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalShared,
  totalEvents,
  totalMessages,
  rating,
}) => {
  const theme = useTheme();

  const stats: StatItem[] = [
    {
      icon: <Package size={32} weight="duotone" />,
      label: "Paylaşılan Eşya",
      value: totalShared,
      suffix: "",
      gradient: "linear-gradient(135deg, #1976d2, #42a5f5)",
    },
    {
      icon: <CalendarCheck size={32} weight="duotone" />,
      label: "Katıldığın Etkinlik",
      value: totalEvents,
      suffix: "",
      gradient: "linear-gradient(135deg, #43a047, #66bb6a)",
    },
    {
      icon: <ChatCircle size={32} weight="duotone" />,
      label: "Mesaj",
      value: totalMessages,
      suffix: "",
      gradient: "linear-gradient(135deg, #ff9800, #ffb74d)",
    },
    {
      icon: <Star size={32} weight="duotone" />,
      label: "Puan",
      value: rating,
      suffix: "/5",
      gradient: "linear-gradient(135deg, #9c27b0, #ba68c8)",
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, i) => (
        <Grid size={{ xs: 6, md: 3 }} key={i}>
          <Card
            sx={{
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.3s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
            elevation={2}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 4,
                background: stat.gradient,
              }}
            />
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                {stat.icon}
              </Box>
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                variant="h4"
                fontWeight={700}
              />
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;