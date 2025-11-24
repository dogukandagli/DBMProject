import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  X,
  Image,
  VideoCamera,
  MapPinLine,
} from "@phosphor-icons/react/dist/ssr";
import { Controller, useForm } from "react-hook-form";
import { useAppSelector } from "../app/store/hooks";

type PostCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; audience: string }) => void;
  userName: string;
};

export default function PostCreateDialog({
  open,
  onClose,
  onSubmit,
  userName,
}: PostCreateDialogProps) {
  const user = useAppSelector((state) => state.auth.user);
  const theme = useTheme();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      audience: 1,
    },
  });
  const submitForm = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 0,
        },
      }}
    >
      <Stack direction={"row"} alignItems={"center"} px={3} py={2}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Gönderi Oluştur
        </Typography>
        <IconButton onClick={onClose}>
          <X size={32} />
        </IconButton>
      </Stack>
      <Divider />
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              flexGrow={1}
            >
              <Avatar />
              <Typography fontWeight={600}>{user?.fullName}</Typography>
            </Stack>
            <Controller
              name="audience"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="small"
                  variant="outlined"
                  sx={{
                    mt: 0.5,
                    fontSize: "14px",
                    height: 32,
                    backgroundColor: theme.palette.icon.background,
                  }}
                >
                  <MenuItem value={1}>Mahallem</MenuItem>
                  <MenuItem value={2}>Mahallem ve yakınları</MenuItem>
                  <MenuItem value={2}>Herkes</MenuItem>
                </Select>
              )}
            />
          </Stack>
          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder={`Ne düşünüyorsun, ${user?.firstName}?`}
                multiline
                minRows={5}
                variant="standard"
                fullWidth
                sx={{
                  mt: 3,
                  backgroundColor: theme.palette.icon.background,
                  p: 1.5,
                  borderRadius: 1.5,
                  "& .MuiInput-underline:before": { borderBottom: "none" },
                  "& .MuiInput-underline:after": { borderBottom: "none" },
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottom: "none",
                  },
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1}>
            <IconButton size="small">
              <Image size={28} />
            </IconButton>
            <IconButton size="small">
              <VideoCamera size={28} />
            </IconButton>
            <IconButton size="small">
              <MapPinLine size={28} />
            </IconButton>
          </Stack>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              px: 4,
              borderRadius: 2,
            }}
          >
            Paylaş
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
