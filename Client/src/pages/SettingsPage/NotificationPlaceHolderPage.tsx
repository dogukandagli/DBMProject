import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router";

export default function NotificationPlaceholderPage({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton
          onClick={() => navigate("/settings/notifications")}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontSize: 16, fontWeight: 900 }}>{title}</Typography>
      </Box>

      <Typography sx={{ color: "text.secondary" }}>
        (Şimdilik boş) — sonra ayarları ekleyeceğiz.
      </Typography>

      {/* BACKEND: buraya ilgili notification setting endpointleri bağlanacak */}
    </Box>
  );
}
