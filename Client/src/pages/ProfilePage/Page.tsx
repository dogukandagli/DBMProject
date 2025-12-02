import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Card,
  LinearProgress,
  Grid,
  Stack,
  Chip,
  useTheme,
  Fade,
} from "@mui/material";
import { useAppSelector } from "../../app/store/hooks";
import { CalendarDots, MapPin, PencilSimpleLine } from "@phosphor-icons/react";

interface QuickAction {
  label: string;
  action?: () => void;
}
interface QuickAction {
  label: string;
  showIf: boolean;
}

export default function ProfilePage() {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const actions: QuickAction[] = [
    { label: "Mahallenizi doğrulayınız", showIf: !user?.isLocationVerified },
    { label: "Profil fotosu ekle", showIf: user?.photoUrl === null },
    { label: "İlk gönderini yayınla", showIf: true },
    { label: "Kapak fotoğrafı ekle", showIf: true },
  ];
  const visibleActions = actions.filter((action) => action.showIf);

  const totalTasks = actions.length;
  const completedTasks = totalTasks - visibleActions.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;
  const ND_DARK = theme.palette.icon.main;

  return (
    <Box sx={{ minHeight: "100vh", py: 2 }}>
      <Container maxWidth="md" sx={{ px: { xs: 0, md: 2 }, width: "%100" }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 100,
              backgroundImage: "linear-gradient(to right, #dbe2ef, #cbd5e1)",
            }}
          />

          <Box sx={{ px: 2, pb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#c4cdd5",
                fontSize: 32,
                color: `${theme.palette.icon.main}`,
                mt: "-40px",
                border: "4px solid white",
                position: "relative",
                zIndex: 1,
              }}
            >
              A
            </Avatar>

            <Box sx={{ mt: 1 }}>
              <Typography variant="h5" fontWeight="bold" color={ND_DARK}>
                {user?.fullName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {user?.biography}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  color: "text.secondary",
                  gap: 1,
                }}
              >
                <MapPin size={23} color={theme.palette.icon.main} />
                <Typography variant="caption" sx={{ fontSize: "0.8rem" }}>
                  {user?.neighborhood}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: ND_DARK,
                  textTransform: "none",
                  borderRadius: 5,
                  px: 3,
                }}
              >
                Profili düzenle
              </Button>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color={ND_DARK}>
              Kontrol Paneli
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yalnızca senin tarafından görülebilir
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                Profil İlerlemesi: {progressPercentage}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${theme.palette.icon.background}`,
                "& .MuiLinearProgress-bar": { bgcolor: ND_DARK },
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {visibleActions.length > 0 ? (
                visibleActions.map((item, i) => (
                  <Fade in={true} key={item.label}>
                    <Chip
                      key={i}
                      label={item.label}
                      variant="outlined"
                      onClick={() => console.log(item.label)}
                      sx={{
                        borderRadius: 2,
                        borderColor: "#ddd",
                        bgcolor: `${theme.palette.icon.background}`,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    />
                  </Fade>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  🎉 Tebrikler! Profiliniz tamamlandı.
                </Typography>
              )}
            </Stack>
          </Card>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarDots />}
                sx={{
                  justifyContent: "flex-start",
                  color: ND_DARK,
                  borderColor: "#ddd",
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: "none",
                }}
              >
                Etkinlikler
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={ND_DARK}
            sx={{ mb: 1 }}
          >
            Posts
          </Typography>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              textAlign: "center",
              py: 4,
              px: 2,
              bgcolor: `${theme.palette.icon.background}`,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Henüz hiç gönderi yok
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Burası çok sessiz...
            </Typography>
            <Button
              variant="contained"
              startIcon={<PencilSimpleLine size={20} />}
              sx={{
                bgcolor: ND_DARK,
                textTransform: "none",
                borderRadius: 5,
              }}
            >
              Bir Gönderi Paylaş
            </Button>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
