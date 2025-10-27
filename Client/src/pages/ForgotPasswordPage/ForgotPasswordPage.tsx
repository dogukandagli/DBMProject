import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { forgotPassword } from "../../features/auth/store/AuthSlice";

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: any) => {
    dispatch(forgotPassword(data));
  };

  const loading = status === "pendingforgotPassword";

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background: "linear-gradient(135deg, #EFF6FF, #E0E7FF)",
      }}
    >
      <Card
        elevation={4}
        sx={{ width: "100%", maxWidth: 420, borderRadius: 3 }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <LockResetRoundedIcon />
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={800}>
                Şifreni mi unuttun?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                E-posta adresini yaz, sıfırlama bağlantısını gönderelim.
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: "100%" }}
            >
              <Stack spacing={2}>
                <TextField
                  {...register("email", {
                    required: "Email adresi girmek zorunlu",
                  })}
                  label="E-posta adresi"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  placeholder="ornek@domain.com"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {loading ? "Gönderiliyor..." : "Sıfırlama bağlantısı gönder"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
