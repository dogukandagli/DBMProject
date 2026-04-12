import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        bottom: "10%",
        right: "10%",
        width: 350,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6" mb={2}>
        Yardım & SSS
      </Typography>
      <Typography variant="body1" mb={1}>
        • Hesabınızı nasıl oluşturabilirsiniz?
        <br />
        • Bildirimleri nereden görebilirim?
        <br />
        • Bir etkinliğe nasıl katılırım?
        <br />• Daha fazla bilgi için destek ekibimize ulaşın.
      </Typography>
      <Button variant="contained" onClick={onClose} fullWidth>
        Kapat
      </Button>
    </Box>
  </Modal>
);

export default HelpModal;
