import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import { Trophy, Star, Medal, Crown } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "trophy" | "star" | "medal" | "crown";
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const iconMap = {
  trophy: <Trophy size={36} weight="duotone" />,
  star: <Star size={36} weight="duotone" />,
  medal: <Medal size={36} weight="duotone" />,
  crown: <Crown size={36} weight="duotone" />,
};

const rarityColors = {
  common: { bg: "#e0e0e0", text: "#616161", label: "Yaygın" },
  rare: { bg: "#42a5f5", text: "#1565c0", label: "Nadir" },
  epic: { bg: "#ab47bc", text: "#7b1fa2", label: "Epik" },
  legendary: { bg: "#ffa726", text: "#e65100", label: "Efsanevi" },
};

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const rarity = rarityColors[achievement.rarity];

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          opacity: achievement.unlocked ? 1 : 0.55,
          filter: achievement.unlocked ? "none" : "grayscale(60%)",
          border: achievement.unlocked
            ? `2px solid ${rarity.bg}`
            : "2px solid transparent",
        }}
        elevation={achievement.unlocked ? 4 : 1}
      >
        {achievement.unlocked && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 4,
              background: `linear-gradient(90deg, ${rarity.bg}, ${rarity.text})`,
            }}
          />
        )}
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <Tooltip title={achievement.description}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
                bgcolor: achievement.unlocked ? `${rarity.bg}22` : "grey.100",
                color: achievement.unlocked ? rarity.text : "grey.400",
              }}
            >
              {iconMap[achievement.icon]}
            </Box>
          </Tooltip>

          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            {achievement.title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1.5}
          >
            {achievement.description}
          </Typography>

          <Chip
            label={rarity.label}
            size="small"
            sx={{
              bgcolor: `${rarity.bg}22`,
              color: rarity.text,
              fontWeight: 600,
              mb: 1.5,
            }}
          />

          {!achievement.unlocked && (
            <Box sx={{ px: 2 }}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  İlerleme
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  %{achievement.progress}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={achievement.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${rarity.bg}, ${rarity.text})`,
                  },
                }}
              />
            </Box>
          )}

          {achievement.unlocked && achievement.unlockedAt && (
            <Typography variant="caption" color="text.secondary">
              ✅ {achievement.unlockedAt}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementBadge;
