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

        <Typography
          onClick={() => navigate("/settings/notifications")}
          sx={{
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
        (Şimdilik boş) — sonra ayarları ekleyeceğiz.
      </Typography>
    </Box>
  );
}