import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { loginWithTFA } from "../../features/auth/store/AuthSlice";
const LEN = 6;

export default function TwoFactorPage() {
  const [code, setCode] = useState<string[]>(Array(LEN).fill(""));
  const [active, setActive] = useState(0);
  const { handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const emailOrUserName = useAppSelector((state) => state.auth.emailOrUserName);

  useEffect(() => {
    const el = document.getElementById(
      `otp-${active}`
    ) as HTMLInputElement | null;
    el?.focus();
    el?.select();
  }, [active]);

  const onSubmit = () => {
    const tfaCode = code.join("");
    console.log(tfaCode);
    dispatch(loginWithTFA({ tfaCode, emailOrUserName }));
  };

  const setAt = (i: number, v: string) =>
    setCode((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: number
  ) => {
    const d = (e.target.value ?? "").replace(/\D/g, "").slice(-1);
    setAt(i, d);
    if (d && i < LEN - 1) setActive(i + 1);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>,
    i: number
  ) => {
    if (e.key !== "Backspace") return;

    if (code[i]) {
      setAt(i, "");
      e.preventDefault();
    }
    if (i > 0) {
      setActive(i - 1);
      setAt(i - 1, "");
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const nums = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, LEN);
    if (!nums) return;
    const arr = Array.from({ length: LEN }, (_, k) => nums[k] ?? "");
    setCode(arr);
    setActive(Math.min(nums.length, LEN) - 1);
  };
  const allFilled = code.every(Boolean);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EFF6FF, #E0E7FF)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                color: "primary.main",
                width: 64,
                height: 64,
                margin: "0 auto",
              }}
              variant="circular"
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={700} mt={2}>
              Güvenlik Kodu
            </Typography>
            <Typography color="text.secondary">
              Mailinize gönderilen 6 haneli kodu girin
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Grid
                container
                justifyContent="center"
                spacing={0.7}
                onPaste={handlePaste}
              >
                {code.map((val, i) => (
                  <Grid size={2} key={i}>
                    <TextField
                      id={`otp-${i}`}
                      value={val}
                      onChange={(e) => handleChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      inputProps={{
                        inputMode: "numeric",
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          height: 56,
                          fontWeight: 700,
                          fontSize: 22,
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                variant="contained"
                disabled={!allFilled}
                sx={{ py: 1.2, fontWeight: 600, mt: 2.5 }}
                type="submit"
              >
                Doğrula
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
