import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type FollowedNeighborhood = {
  id: string;
  name: string;
  subtitle: string; // "Skidmore, TX • Nearby"
};

export default function NeighborhoodsSettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const initial = useMemo<FollowedNeighborhood[]>(
    () => [
      { id: "1", name: "Co Rd 618", subtitle: "Skidmore, TX • Nearby" },
      { id: "2", name: "The Maps", subtitle: "Skidmore, TX • Nearby" },
      { id: "3", name: "Skidmore", subtitle: "Skidmore, TX • Nearby" },
    ],
    []
  );

  const [items, setItems] = useState(initial);

  const handleUnfollow = async (id: string) => {
    // BACKEND: POST/DELETE /neighborhoods/following/{id} (unfollow)
    // await apiClient.delete(`/settings/neighborhoods/following/${id}`);
    console.log("BACKEND:UNFOLLOW", id);

    // frontend-only: listeden düş
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleExplore = () => {
    // BACKEND: Explore ekranı/route (sonra)
    // navigate("/neighborhoods/explore")
    console.log("Explore neighborhoods");
  };

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
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 900, mb: 2 }}>
            Neighborhoods you're following
          </Typography>

          {/* List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((n) => (
              <Box
                key={n.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 800,
                      textDecoration: "underline",
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                    onClick={() => {
                      // BACKEND: mahalle detayına gitmek istersen
                      // navigate(`/neighborhoods/${n.id}`)
                      console.log("Open neighborhood", n.id);
                    }}
                  >
                    {n.name}
                  </Typography>

                  <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                    {n.subtitle}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => handleUnfollow(n.id)}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 900,
                    px: 2.5,
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                    "&:hover": { backgroundColor: theme.palette.action.selected },
                  }}
                >
                  Unfollow
                </Button>
              </Box>
            ))}

            {items.length === 0 && (
              <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>
                You're not following any neighborhoods.
              </Typography>
            )}
          </Box>

          {/* Explore button */}
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={handleExplore}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 900,
                py: 1.2,
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.primary,
                "&:hover": { backgroundColor: theme.palette.action.selected },
              }}
            >
              Explore neighborhoods
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
