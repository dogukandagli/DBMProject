import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
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
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

type PostCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; audience: string }) => void;
};

export default function PostCreateDialog({
  open,
  onClose,
  onSubmit,
}: PostCreateDialogProps) {
  const user = useAppSelector((state) => state.auth.user);
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);

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

  const imageDrop = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => {
      setFiles((prev) => [...prev, ...files]);
    },
  });

  const videoDrop = useDropzone({
    accept: { "video/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => {
      setFiles((prev) => [...prev, ...files]);
    },
  });

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
          {files.length > 0 && (
            <Box
              sx={{
                border: `2px solid ${theme.palette.icon.background}`,
                p: 1,
                borderRadius: 2,
                mt: 2,
              }}
            >
              <Grid container spacing={1}>
                {files.map((file, index) => {
                  const isVideo = file.type.startsWith("video");

                  return (
                    <Grid size={{ xs: 3, md: 3 }} key={index}>
                      <Box
                        sx={{
                          width: "100%",
                          paddingTop: "100%",
                          position: "relative",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleRemove(index)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0,0,0,0.6)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                            zIndex: 10,
                          }}
                        >
                          <CloseIcon sx={{ color: "#fff", fontSize: 14 }} />
                        </IconButton>

                        {isVideo ? (
                          <video
                            src={URL.createObjectURL(file)}
                            controls
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(file)}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
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
          <input {...imageDrop.getInputProps()} style={{ display: "none" }} />
          <input {...videoDrop.getInputProps()} style={{ display: "none" }} />
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={imageDrop.open}>
              <Image size={28} />
            </IconButton>
            <IconButton size="small" onClick={videoDrop.open}>
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
