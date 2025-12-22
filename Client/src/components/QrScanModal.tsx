import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Scanner } from "@yudiel/react-qr-scanner";

interface QrScanModalProps {
  open: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export const QrScanModal: React.FC<QrScanModalProps> = ({
  open,
  onClose,
  onScan,
}) => {
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        QR Kodu Tara
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          overflow: "hidden",
          bgcolor: "black",
          height: 400,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Scanner
          onScan={(result) => {
            if (result && result.length > 0) {
              onScan(result[0].rawValue);
            }
          }}
          onError={(error) => console.log("Kamera Hatası:", error)}
          components={{
            torch: true,
          }}
          styles={{
            container: { width: "100%", height: "100%" },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
