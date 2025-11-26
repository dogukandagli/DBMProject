import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { IconPhosphor } from "./IconPhosphor";
import { createPost } from "../features/posts/store/PostSlice";
import { isFulfilled } from "@reduxjs/toolkit";

type PostCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function PostCreateDialog({
  open,
  onClose,
}: PostCreateDialogProps) {
  const user = useAppSelector((state) => state.auth.user);
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.post);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      postVisibilty: 1,
      postType: 1,
    },
  });
  const submitForm = async (data: any) => {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("postType", data.postType);
    formData.append("postVisibilty", data.postVisibilty);
    if (files.length > 0) {
      files.forEach((f) => formData.append("files", f));
    }
    const actionResult = await dispatch(createPost(formData));

    if (isFulfilled(actionResult)) {
      reset();
      setFiles([]);
      onClose();
    }
  };
  useEffect(() => {
    if (files.length > 10) {
      toast.warning("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");
    }
  }, [files]);

  const imageDrop = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (imageFiles) => {
      if (files.length + imageFiles.length > 10) {
        toast.warning("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");
      }
      setFiles((prev) => [...prev, ...imageFiles]);
    },
  });

  const videoDrop = useDropzone({
    accept: { "video/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (videoFiles) => {
      if (files.length + videoFiles.length > 10) {
        toast.warning("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");
      }

      const existingVideoCount = files.filter((f) =>
        f.type.startsWith("video/")
      ).length;

      const incomingVideoCount = videoFiles.filter((f) =>
        f.type.startsWith("video/")
      ).length;

      if (existingVideoCount + incomingVideoCount > 1) {
        toast.warning("Bir gönderiye sadece 1 adet video ekleyebilirsiniz.");
      }

      setFiles((prev) => [...prev, ...videoFiles]);
    },
  });

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const pendingCreatePost = status === "pendingCreatePost";

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
      <Stack direction={"row"} alignItems={"center"} px={2} py={1}>
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
              name="postVisibilty"
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
              <IconPhosphor Icon={Image} />
            </IconButton>
            <IconButton size="small" onClick={videoDrop.open}>
              <IconPhosphor Icon={VideoCamera} />
            </IconButton>
            <IconButton size="small">
              <IconPhosphor Icon={MapPinLine} />
            </IconButton>
          </Stack>
          <Button
            type="submit"
            disabled={pendingCreatePost}
            variant="contained"
            sx={{
              textTransform: "none",
              px: 4,
              borderRadius: 2,
            }}
          >
            {pendingCreatePost ? (
              <CircularProgress
                sx={{
                  color: (theme) => theme.palette.icon.main,
                }}
                size={24}
                thickness={5}
              />
            ) : (
              "Paylaş"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
