import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router";

export default function MemberAgreementPage() {
  const navigate = useNavigate();

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

      <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.8 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula
        eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
        montes, nascetur ridiculus mus.
        <br /><br />
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
        consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec,
        vulputate eget, arcu.
        <br /><br />
        In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
        felis eu pede mollis pretium.
      </Typography>
    </Box>
  );
}
