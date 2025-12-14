import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

function OptionRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.4,
        px: 1,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <Typography sx={{ fontSize: 14.5, fontWeight: 800 }}>
        {label}
      </Typography>

      {selected ? <Check size={20} weight="bold" /> : <Box sx={{ width: 20 }} />}
    </Box>
  );
}

export default function AppearanceSettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem("appearance_mode") as Mode | null;
    return saved ?? "light"; // default: light (istersen system yap)
  });

  useEffect(() => {
    localStorage.setItem("appearance_mode", mode);

    // BACKEND: kullanıcı tercihini kaydetmek istersen
    // await apiClient.patch("/settings/appearance", { mode });
    console.log("BACKEND:PATCH_APPEARANCE", { mode });
  }, [mode]);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ fontSize: 16, fontWeight: 900 }}>
          Settings
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <OptionRow
            label="Use device settings"
            selected={mode === "system"}
            onClick={() => setMode("system")}
          />

          <OptionRow
            label="Light mode"
            selected={mode === "light"}
            onClick={() => setMode("light")}
          />

          <OptionRow
            label="Dark mode"
            selected={mode === "dark"}
            onClick={() => setMode("dark")}
          />

          {/* küçük not (istersen kaldır) */}
          <Typography sx={{ mt: 1, fontSize: 12.5, color: "text.secondary", px: 1 }}>
            Current: <b style={{ color: theme.palette.text.primary }}>{mode}</b>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
