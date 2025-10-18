import { useParams } from "react-router";
import { Box, CircularProgress, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { confirmEmail } from "../../features/auth/store/AuthSlice";

export default function ConfirmEmailPage() {
  const { userId, mailToken } = useParams();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    dispatch(confirmEmail({ userId, mailToken }));
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {status === "pendingconfirmEmail" && (
        <CircularProgress size={100} thickness={4} />
      )}

      {status === "idle" && (
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 120, color: "success.main" }}
          />
          <Typography sx={{ fontSize: 40 }}>
            Mail Adresiniz Onaylanmıştır
          </Typography>
        </>
      )}

      {status === "rejectedconfirmEmail" && (
        <>
          <HighlightOffIcon sx={{ fontSize: 120, color: "error.main" }} />
          <Typography sx={{ fontSize: 40 }}>
            Mail Adresiniz Onaylanamadı
          </Typography>
        </>
      )}
    </Box>
  );
}
