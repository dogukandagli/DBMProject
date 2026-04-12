import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useState } from "react";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ForumIcon from "@mui/icons-material/Forum";
import CelebrationIcon from "@mui/icons-material/Celebration";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: { xs: 2, md: 6 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ConnectWithoutContactIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={800} color="primary.main">
            Mahallem
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Zaten üye misiniz?
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/login")}
            sx={{ fontWeight: 600, borderRadius: 8, px: 3 }}
          >
            Giriş Yap
          </Button>
        </Stack>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 14 },
          bgcolor:
            theme.palette.mode === "light"
              ? "background.default"
              : "background.paper",
          backgroundImage:
            theme.palette.mode === "light"
              ? "linear-gradient(to bottom, #f0f7ff 0%, #ffffff 100%)"
              : "none",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Typography
                  variant="h1"
                  fontWeight={900}
                  sx={{
                    fontSize: { xs: "3rem", md: "4.5rem" },
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Mahallenize <br />
                  <Typography
                    component="span"
                    variant="inherit"
                    color="primary.main"
                  >
                    Hoş Geldiniz.
                  </Typography>
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Mahallem, çevrenizdeki insanlarla iletişim kurmanın,
                  yardımlaşmanın ve mahallenizde olan bitenden anında haberdar
                  olmanın en güvenilir yoludur.
                </Typography>

                <Box
                  component="form"
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    maxWidth: 480,
                    pt: 2,
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate("/create-account", { state: { email } });
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="E-posta adresiniz"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      sx: { borderRadius: 8, bgcolor: "background.paper" },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 8,
                      px: 4,
                      whiteSpace: "nowrap",
                      fontWeight: 700,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    Ücretsiz Katıl
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Mahallenize katılmak tamamen ücretsizdir. <VerifiedUserIcon sx={{ fontSize: 14, verticalAlign: 'middle', ml: 0.5 }} color="success" /> Gerçek komşular, güvenli ağ.
                </Typography>
              </Stack>
            </Grid>

            {/* Right Visuals */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 300, md: 500 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Abstract neighborhood visual using MUI elements */}
                <Box
                  sx={{
                    position: "absolute",
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    opacity: 0.1,
                    zIndex: 0,
                  }}
                />
                
                {/* Central Map Pin */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: theme.shadows[8],
                    zIndex: 2,
                    position: "relative",
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 40 }} />
                </Box>

                {/* Floating Avatars / Cards */}
                <Avatar
                  sx={{
                    position: "absolute",
                    top: "15%",
                    left: "20%",
                    width: 56,
                    height: 56,
                    bgcolor: "secondary.main",
                    boxShadow: theme.shadows[4],
                    zIndex: 2,
                  }}
                >
                  <HandshakeIcon />
                </Avatar>

                <Avatar
                  sx={{
                    position: "absolute",
                    bottom: "20%",
                    right: "15%",
                    width: 64,
                    height: 64,
                    bgcolor: "success.main",
                    boxShadow: theme.shadows[4],
                    zIndex: 2,
                  }}
                >
                  <CelebrationIcon />
                </Avatar>

                <Card
                  sx={{
                    position: "absolute",
                    top: "40%",
                    right: "5%",
                    width: 200,
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    zIndex: 3,
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "info.main" }}>
                        <ForumIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          Kedi bulundu!
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Az önce • Mahalle Meydanı
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust & Safety Banner */}
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" textAlign="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <VerifiedUserIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
              <Typography variant="h6" fontWeight={700}>Adres Doğrulaması</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Sadece o mahallede yaşayanlar katılabilir.</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <HandshakeIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
              <Typography variant="h6" fontWeight={700}>Güvenli İletişim</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Kişisel verileriniz gizli kalır ve korunur.</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <LocationOnIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
              <Typography variant="h6" fontWeight={700}>Yerel Odaklı</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Tamamen mahallenize ve çevrenize özel bir ağ.</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Detail Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            {/* Feature 1 */}
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    borderRadius: 6,
                    bgcolor: `${theme.palette.info.main}1A`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ForumIcon sx={{ fontSize: 100, color: "info.main" }} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="overline" color="info.main" fontWeight={700} sx={{ letterSpacing: 1 }}>
                  HABERDAR OLUN
                </Typography>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
                  Mahallenizdeki <br/>gelişmeleri kaçırmayın
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 3 }}>
                  Güvenlik uyarıları, kayıp ilanları, belediye duyuruları veya sokağınızdaki son haberler anında cebinize gelsin. Komşularınızın tavsiyeleriyle en iyi yerel hizmetleri keşfedin.
                </Typography>
                <Button variant="text" color="info" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>
                  Daha fazlasını keşfet
                </Button>
              </Grid>
            </Grid>

            {/* Feature 2 (Reversed) */}
            <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="overline" color="secondary.main" fontWeight={700} sx={{ letterSpacing: 1 }}>
                  YARDIMLAŞMA & PAYLAŞIM
                </Typography>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
                  İhtiyacınız olanı bulun, <br/>fazlasını paylaşın
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 3 }}>
                  Kısa süreliğine matkaba mı ihtiyacınız var? Veya kullanmadığınız eşyalarınızı komşunuza mı vermek istiyorsunuz? Mahallem ile ödünç alma ve ikinci el eşya paylaşımı artık çok kolay.
                </Typography>
                <Button variant="text" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>
                  Paylaşmaya başla
                </Button>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    borderRadius: 6,
                    bgcolor: `${theme.palette.secondary.main}1A`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HandshakeIcon sx={{ fontSize: 100, color: "secondary.main" }} />
                </Box>
              </Grid>
            </Grid>

            {/* Feature 3 */}
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    borderRadius: 6,
                    bgcolor: `${theme.palette.success.main}1A`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CelebrationIcon sx={{ fontSize: 100, color: "success.main" }} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="overline" color="success.main" fontWeight={700} sx={{ letterSpacing: 1 }}>
                  YEREL ETKİNLİKLER
                </Typography>
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ mt: 1 }}>
                  Gerçek hayatta <br/>bir araya gelin
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 3 }}>
                  Parkta sabah yürüyüşü, kitap kulübü veya hafta sonu pikniği. Mahallenizdeki etkinlikleri görün veya kendi buluşmanızı organize ederek komşuluk bağlarınızı güçlendirin.
                </Typography>
                <Button variant="text" color="success" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>
                  Etkinliklere göz at
                </Button>
              </Grid>
            </Grid>

          </Stack>
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ py: 10, bgcolor: "background.default", textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Mahallenizdeki yerinizi alın
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
            Binlerce komşu çoktan Mahallem'e katıldı. Siz de hemen katılın ve mahallenizle bağlantı kurmaya başlayın.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/create-account")}
            sx={{ px: 6, py: 2, fontSize: "1.1rem", borderRadius: 8, boxShadow: theme.shadows[6] }}
          >
            Mahallem'e Ücretsiz Katıl
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: { xs: 2, md: 6 },
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ConnectWithoutContactIcon color="disabled" />
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Mahallem © {new Date().getFullYear()}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Hakkımızda</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Gizlilik Politikası</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Kullanım Koşulları</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Yardım</Typography>
        </Stack>
      </Box>
    </Box>
  );
}
