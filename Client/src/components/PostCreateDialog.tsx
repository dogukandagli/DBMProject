import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  X,
  Image,
  VideoCamera,
  SquaresFour,
  HouseLine,
  MapPin,
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
import { AppTooltip } from "./AppTooltip";
import { Select, type FancyOption } from "./Select";
import { Globe } from "@phosphor-icons/react";

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

  const visibilityOptions: FancyOption[] = [
    {
      value: 1,
      title: "Herkes",
      subtitle: "Komşu'da olan veya olmayan herkes",
      icon: <IconPhosphor Icon={Globe} />,
    },
    {
      value: 2,
      title: "Yakındaki mahalleler",
      subtitle: "Sizin mahalleniz ve diğer 15 mahalle",
      icon: <IconPhosphor Icon={SquaresFour} weight="bold" />,
    },
    {
      value: 3,
      title: "Mahalleniz",
      subtitle: `Sadece ${user?.locationText}`,
      icon: <IconPhosphor Icon={HouseLine} weight="bold" />,
    },
  ];

  const { control, handleSubmit, reset, watch } = useForm({
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

  const contentValue = watch("content");
  const showRightPanel = !contentValue?.trim() && files.length === 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: (theme) => ({
          margin: 0,
          width: { xs: "100vw", sm: "720px" },
          height: { xs: "100vh", sm: "auto" },
          maxWidth: { xs: "100vw", sm: "720px" },
          maxHeight: { xs: "100vh", sm: "none" },
          borderRadius: { xs: 0, sm: 4.5 },
          py: 2,
          px: 1,
          position: "absolute",
          top: { xs: "0px", sm: "75px" },
          backgroundColor: theme.palette.background.default,
        }),
      }}
    >
      <Stack
        direction={{ sm: "row", xs: "column" }}
        spacing={3}
        sx={{ height: "100%" }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Flex scroll fix
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent="space-between"
            py={0.5}
            pl={0.5}
            sx={{ flexShrink: 0 }}
          >
            <IconButton onClick={onClose}>
              <X size={32} weight="bold" />
            </IconButton>
            <Controller
              name="postVisibilty"
              control={control}
              render={({ field }) => (
                <Select
                  options={visibilityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  title="Anasayfada gönderinizi kimlerin görebileceğini seçin"
                  triggerLabel="Anyone"
                />
              )}
            />
          </Stack>

          <form
            onSubmit={handleSubmit(submitForm)}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* CONTENT - Flex 1 ile uzayarak Action'ı aşağı iter */}
            <DialogContent
              sx={{
                pt: 3,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems={"center"}
                  flexGrow={1}
                >
                  <Avatar />
                  <Typography fontSize={20} fontWeight={600}>
                    {user?.fullName}
                  </Typography>
                </Stack>
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
                    minRows={3}
                    variant="standard"
                    fullWidth
                    sx={{
                      mt: 3,
                      p: 1.5,
                      borderRadius: 1.5,
                      "& .MuiInput-underline:before": { borderBottom: "none" },
                      "& .MuiInput-underline:after": { borderBottom: "none" },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "none",
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: `${theme.palette.icon.main}`,
                        opacity: 1,
                      },
                    }}
                  />
                )}
              />
              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {files.map((file, index) => {
                      const isVideo = file.type.startsWith("video");
                      return (
                        <Grid size={{ xs: 6, md: 6 }} key={index}>
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
                                bgcolor: "rgba(228, 219, 219, 0.6)",
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
                pl: 3,
                mt: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <input
                {...imageDrop.getInputProps()}
                style={{ display: "none" }}
              />
              <input
                {...videoDrop.getInputProps()}
                style={{ display: "none" }}
              />
              <Stack direction="row" spacing={1}>
                <AppTooltip title={"Fotoğraf ekle"}>
                  <IconButton
                    onClick={imageDrop.open}
                    sx={{
                      backgroundColor: `${theme.palette.icon.background}`,
                      p: 1,
                    }}
                  >
                    <IconPhosphor Icon={Image} finalSize={28} />
                  </IconButton>
                </AppTooltip>
                <AppTooltip title={"Video ekle"}>
                  <IconButton
                    onClick={videoDrop.open}
                    sx={{
                      backgroundColor: `${theme.palette.icon.background}`,
                      p: 1,
                    }}
                  >
                    <IconPhosphor Icon={VideoCamera} finalSize={28} />
                  </IconButton>
                </AppTooltip>
                <AppTooltip title={"Konum ekle"}>
                  <IconButton
                    sx={{
                      backgroundColor: `${theme.palette.icon.background}`,
                      p: 1,
                    }}
                  >
                    <IconPhosphor Icon={MapPin} finalSize={30} />
                  </IconButton>
                </AppTooltip>
              </Stack>
              <Button
                type="submit"
                disabled={pendingCreatePost}
                variant="contained"
                sx={{
                  textTransform: "none",
                  pl: 2,
                  borderRadius: 4,
                }}
              >
                {pendingCreatePost ? (
                  <CircularProgress
                    sx={{ color: (theme) => theme.palette.icon.main }}
                    size={24}
                    thickness={5}
                  />
                ) : (
                  "Paylaş"
                )}
              </Button>
            </DialogActions>
          </form>
        </Box>

        {showRightPanel && (
          <Box
            sx={{
              pl: { sm: 3, xs: 0 },
              width: { xs: "100%", sm: 230 },
              borderLeft: { xs: "none", sm: 1 },
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              flexShrink: 0,
              pb: { xs: 2, sm: 0 },
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Create something
            </Typography>

            <Button
              variant="outlined"
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
              fullWidth
            >
              Sell or give away
            </Button>
            <Button
              variant="outlined"
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
              fullWidth
            >
              Create an event
            </Button>
            <Button
              variant="outlined"
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
              fullWidth
            >
              Poll your neighbors
            </Button>
          </Box>
        )}
      </Stack>
    </Dialog>
  );
}
