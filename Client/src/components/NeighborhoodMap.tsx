import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Users } from "@phosphor-icons/react";

interface MapPoint {
  id: string;
  name: string;
  avatar: string;
  x: number; // 0-100 yüzdelik konum
  y: number;
  status: "online" | "offline";
  sharedItems: number;
}

interface NeighborhoodMapProps {
  points?: MapPoint[];
  neighborhoodName?: string;
}

const defaultPoints: MapPoint[] = [
  {
    id: "1",
    name: "Ayşe Y.",
    avatar: "A",
    x: 25,
    y: 30,
    status: "online",
    sharedItems: 5,
  },
  {
    id: "2",
    name: "Mehmet K.",
    avatar: "M",
    x: 55,
    y: 45,
    status: "online",
    sharedItems: 3,
  },
  {
    id: "3",
    name: "Zeynep D.",
    avatar: "Z",
    x: 70,
    y: 20,
    status: "offline",
    sharedItems: 8,
  },
  {
    id: "4",
    name: "Ali R.",
    avatar: "A",
    x: 40,
    y: 70,
    status: "online",
    sharedItems: 2,
  },
  {
    id: "5",
    name: "Fatma S.",
    avatar: "F",
    x: 80,
    y: 60,
    status: "offline",
    sharedItems: 6,
  },
  {
    id: "6",
    name: "Hasan T.",
    avatar: "H",
    x: 15,
    y: 65,
    status: "online",
    sharedItems: 1,
  },
];

const NeighborhoodMap: React.FC<NeighborhoodMapProps> = ({
  points = defaultPoints,
  neighborhoodName = "Kadıköy Mahallesi",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const onlineCount = points.filter((p) => p.status === "online").length;

  return (
    <Card sx={{ borderRadius: 3 }} elevation={2}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              🗺️ {neighborhoodName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mahallendeki komşularının konumları
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<Users size={14} />}
              label={`${onlineCount} çevrimiçi`}
              size="small"
              color="success"
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 320,
            borderRadius: 3,
            bgcolor: isDark ? "grey.900" : "grey.100",
            border: `1px solid ${isDark ? "grey.800" : "grey.300"}`,
            overflow: "hidden",
            backgroundImage: isDark
              ? `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`
              : `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Merkez göstergesi */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "primary.main",
              boxShadow: `0 0 0 4px ${theme.palette.primary.main}33`,
              zIndex: 2,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: "54%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "primary.main",
              fontWeight: 600,
              zIndex: 2,
            }}
          >
            Sen
          </Typography>

          {points.map((point) => (
            <Tooltip
              key={point.id}
              title={
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {point.name}
                  </Typography>
                  <Typography variant="caption">
                    📦 {point.sharedItems} paylaşım
                  </Typography>
                </Box>
              }
              arrow
            >
              <Box
                sx={{
                  position: "absolute",
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translate(-50%, -50%) scale(1.2)",
                    zIndex: 10,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 14,
                    fontWeight: 700,
                    bgcolor:
                      point.status === "online" ? "success.main" : "grey.400",
                    border: "3px solid",
                    borderColor: "background.paper",
                    boxShadow: 2,
                  }}
                >
                  {point.avatar}
                </Avatar>
                {point.status === "online" && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#4caf50",
                      border: "2px solid",
                      borderColor: "background.paper",
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Alt bilgi */}
        <Stack direction="row" spacing={3} mt={2} justifyContent="center">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Çevrimiçi
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "grey.400",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Çevrimdışı
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Sen
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodMap;
