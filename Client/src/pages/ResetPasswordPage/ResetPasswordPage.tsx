import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { resetPassword } from "../../features/auth/store/AuthSlice";

/** Basit şifre skoru (0-5) */
function passwordScore(pw: any) {
  let s = 0;
  if (!pw) return 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5);
}
function strengthLabel(score: any) {
  switch (true) {
    case score <= 1:
      return "Çok zayıf";
    case score === 2:
      return "Zayıf";
    case score === 3:
      return "Orta";
    case score === 4:
      return "İyi";
    default:
      return "Çok güçlü";
  }
}

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      newPasswordConfirm: "",
    },
    mode: "onBlur",
  });

  const { id, forgotPasswordCode } = useParams<{
    id: string;
    forgotPasswordCode: string;
  }>();

  const [showPassword, setShowPw] = useState(false);
  const [showPasswordConfirm, setShowPwConfirm] = useState(false);

  const newPassword = watch("newPassword");
  const newPasswordConfirm = watch("newPasswordConfirm");

  const score = passwordScore(newPassword);
  const strengthPct = Math.round((score / 5) * 100);

  useEffect(() => {
    if (!newPasswordConfirm) {
      clearErrors("newPasswordConfirm");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("newPasswordConfirm", {
        type: "validate",
        message: "Şifreler eşleşmiyor.",
      });
    } else {
      clearErrors("newPasswordConfirm");
    }
  }, [newPassword, newPasswordConfirm, setError, clearErrors]);
  const passwordsMatch =
    newPassword && newPasswordConfirm && newPassword === newPasswordConfirm;

  const onSubmit = (data: any) => {
    dispatch(
      resetPassword({ id, forgotPasswordCode, newPassword: data.newPassword })
    );
  };

  const loading = status === "pendingresetPassword";

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #EFF6FF, #E0E7FF)",
        bgcolor: (t) => t.palette.background.default,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Yeni Şifre Oluştur
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            E-postadaki bağlantıyla geldin. Lütfen yeni şifreni belirle.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* Yeni Şifre */}
            <TextField
              fullWidth
              margin="normal"
              label="Yeni Şifre"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("newPassword", {
                required: "Bu alan zorunludur.",
                minLength: {
                  value: 6,
                  message: "En az 6 karakter olmalı.",
                },
                validate: (v) => {
                  const hasUpper = /[A-Z]/.test(v);
                  const hasLower = /[a-z]/.test(v);
                  const hasDigit = /\d/.test(v);
                  if (!(hasUpper && hasLower && hasDigit)) {
                    return "En az bir büyük, bir küçük harf ve bir rakam içermeli.";
                  }
                  if (v.includes(" ")) return "Boşluk içeremez.";
                  // özel karakter opsiyonel ama puan sağlar
                  return true;
                },
              })}
              error={!!errors.newPassword}
              helperText={
                errors.newPassword?.message ||
                "Öneri: özel karakter ekle (+güç)."
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                      onClick={() => setShowPw((p) => !p)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 1, mb: 2 }}>
              <LinearProgress variant="determinate" value={strengthPct} />
              <Typography variant="caption" color="text.secondary">
                Güç: {strengthLabel(score)}
              </Typography>
            </Box>

            <TextField
              fullWidth
              margin="normal"
              label="Yeni Şifre (Tekrar)"
              type={showPasswordConfirm ? "text" : "password"}
              autoComplete="new-password"
              {...register("newPasswordConfirm", {
                required: "Bu alan zorunludur.",
              })}
              error={!!errors.newPasswordConfirm}
              helperText={
                errors.newPasswordConfirm?.message || "Aynı şifreyi tekrar gir."
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPasswordConfirm ? "Şifreyi gizle" : "Şifreyi göster"
                      }
                      onClick={() => setShowPwConfirm((p) => !p)}
                      edge="end"
                    >
                      {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit */}
            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !passwordsMatch}
                startIcon={loading ? <CircularProgress size={18} /> : null}
              >
                {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
