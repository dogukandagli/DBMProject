import React from "react";
import { Card, CardContent, Typography, Box, Stack, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface DayActivity {
  day: string;
  value: number;
}

interface WeeklyActivityChartProps {
  data?: DayActivity[];
}

const defaultData: DayActivity[] = [
  { day: "Pzt", value: 3 },
  { day: "Sal", value: 7 },
  { day: "Çar", value: 5 },
  { day: "Per", value: 8 },
  { day: "Cum", value: 12 },
  { day: "Cmt", value: 6 },
  { day: "Paz", value: 4 },
];

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  data = defaultData,
}) => {
  const theme = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const today = new Date().getDay(); // 0=Pazar
  const dayIndexMap = [6, 0, 1, 2, 3, 4, 5]; // JS day -> chart index
  const todayIndex = dayIndexMap[today];

  return (
    <Card sx={{ borderRadius: 3 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          📊 Haftalık Aktivite
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Bu hafta mahallendeki etkileşimlerin
        </Typography>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-end"
          sx={{ height: 160 }}
        >
          {data.map((d, i) => {
            const heightPct = (d.value / maxValue) * 100;
            const isToday = i === todayIndex;

            return (
              <Box
                key={d.day}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ mb: 0.5, color: "text.secondary" }}
                >
                  {d.value}
                </Typography>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    background: isToday
                      ? `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      : `linear-gradient(180deg, ${theme.palette.primary.light}88, ${theme.palette.primary.light}44)`,
                    minHeight: 8,
                    boxShadow: isToday
                      ? `0 4px 12px ${theme.palette.primary.main}44`
                      : "none",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? "primary.main" : "text.secondary",
                  }}
                >
                  {d.day}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityChart;