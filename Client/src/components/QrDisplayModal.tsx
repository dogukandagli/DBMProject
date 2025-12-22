import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import QRCode from "react-qr-code";

interface QrDisplayModalProps {
  open: boolean;
  onClose: () => void;
  qrData: string;
}

export const QrDisplayModal: React.FC<QrDisplayModalProps> = ({
  open,
  onClose,
  qrData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>Teslimat QR Kodu</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              border: "1px solid #eee",
              borderRadius: 2,
            }}
          >
            <QRCode value={qrData} size={200} />
          </Box>
          <Typography variant="caption" sx={{ mt: 2, textAlign: "center" }}>
            Karşı tarafa bu kodu okutun. <br />
            Okunduğunda bu ekran otomatik kapanacaktır.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
