import {
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Image, Trash } from "@phosphor-icons/react";

interface PhotoUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  type: "avatar" | "cover" | null;
  onChoosePhoto: () => void; // Dropzone'u tetikleyecek fonksiyon
  onRemove: () => void;
}

export default function PhotoUpdateDialog({
  open,
  onClose,
  type,
  onChoosePhoto,
  onRemove,
}: PhotoUpdateDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", md: "center" },
        },
        "& .MuiPaper-root": {
          width: "100%",
          m: { xs: 0, md: 2 },
          borderRadius: { xs: "20px 20px 0 0", md: 5 },
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {type === "cover"
            ? "Kapak fotoğrafını güncelle"
            : "Profil fotoğrafını güncelle"}
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        <ListItem>
          <ListItemButton onClick={onChoosePhoto} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Image size={24} color="#333" />
            </ListItemIcon>
            <ListItemText
              primary="Fotoğraf seç"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={onRemove} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Trash size={24} color="#d32f2f" />
            </ListItemIcon>
            <ListItemText
              primary="Kaldır"
              primaryTypographyProps={{ fontWeight: 500, color: "error.main" }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box>
        <Button
          fullWidth
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "text.primary",
            py: 2,
          }}
        >
          Vazgeç
        </Button>
      </Box>
    </Dialog>
  );
}
