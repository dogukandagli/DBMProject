import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../app/store/hooks";

type Nearby = {
  id: string;
  name: string;
  cityLine: string;
};

export default function SettingsNeighborhoodsPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const myNeighborhoodName = (user as any)?.neighborhood ?? "Mahallen bulunamadı";

  const nearbyDefaults: Nearby[] = useMemo(
    () => [
      { id: "near-1", name: "Şirinyer", cityLine: "İzmir · Yakın" },
      { id: "near-2", name: "Buca Koop.", cityLine: "İzmir · Yakın" },
    ],
    []
  );

  const [following, setFollowing] = useState<Record<string, boolean>>({
    "near-1": false,
    "near-2": true,
  });

  const toggleFollow = (id: string) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography
          onClick={() => navigate("/settings")}
          sx={{
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Ayarlar
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h3" sx={{ mb: 2, fontSize: 18 }}>
            Mahalleler
          </Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: "text.secondary" }}>
            Benim mahallem
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.4,
              px: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              mb: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 15.5, fontWeight: 800 }}>
                {myNeighborhoodName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.2 }}>
                Senin mahallen
              </Typography>
            </Box>

            <Button
              variant="contained"
              disabled
              sx={{
                px: 2.2,
                fontWeight: 800,
              }}
            >
              Takiptesin
            </Button>
          </Box>

          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: "text.secondary" }}>
            Yakın mahalleler
          </Typography>

          <Stack gap={1.2}>
            {nearbyDefaults.map((n) => {
              const isFollowing = !!following[n.id];

              return (
                <Box
                  key={n.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.4,
                    px: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: 15.5, fontWeight: 800 }}>
                      {n.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.2 }}>
                      {n.cityLine}
                    </Typography>
                  </Box>

                  <Button
                    onClick={() => toggleFollow(n.id)}
                    variant={isFollowing ? "outlined" : "contained"}
                    sx={{ px: 2.2, fontWeight: 800 }}
                  >
                    {isFollowing ? "Takibi Bırak" : "Takip Et"}
                  </Button>
                </Box>
              );
            })}
          </Stack>

          <Button
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              mt: 2.2,
              py: 1.2,
              fontWeight: 800,
            }}
            onClick={() => console.log("Mahalleleri keşfet")}
          >
            Mahalleleri keşfet
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}