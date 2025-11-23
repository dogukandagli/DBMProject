import {
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, type FieldValues } from "react-hook-form";
import { login } from "../../features/auth/store/AuthSlice";
import { useAppDispatch } from "../../app/store/hooks";
import { useNavigate } from "react-router";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function submitForm(data: FieldValues) {
    await dispatch(login(data));
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100dvh",
      }}
    >
      <Stack spacing={1.5} alignItems="center" my={5}>
        <Typography variant="h5" fontWeight={700}>
          DBM PROJECT
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Giriş Yapın
        </Typography>
      </Stack>

      {/* Form */}
      <Stack component="form" spacing={2} onSubmit={handleSubmit(submitForm)}>
        <TextField
          {...register("email", {
            required: "Email girmeniz zorunlu!",
          })}
          fullWidth
          label="Email"
          placeholder="Emalinizi giriniz"
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          {...register("password", {
            required: "Parola girmelisiniz!",
            minLength: {
              value: 6,
              message: "En az 6 karakter girmelisiniz!",
            },
          })}
          fullWidth
          label="Şifre"
          type="password"
          placeholder="Şifrenizi giriniz"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          loading={isSubmitting}
          size="large"
          variant="contained"
          fullWidth
          type="submit"
          disabled={!isValid}
        >
          Giriş Yap
        </Button>
      </Stack>

      <Stack alignItems="center" spacing={2.5} mt={4}></Stack>

      <Stack alignItems="center" spacing={1.5} mt={4}>
        <Link
          color="inherit"
          component="button"
          onClick={() => navigate("/forgotpassword")}
        >
          Şifremi unuttum?
        </Link>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">Hesabınız yok mu?</Typography>
          <Link
            color="inherit"
            onClick={() => navigate("/create-account")}
            sx={{
              border: "none",
              p: 0,
              cursor: "pointer",
              fontWeight: 600,
              transition: "color 0.25s ease",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Üye Ol
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Login;
