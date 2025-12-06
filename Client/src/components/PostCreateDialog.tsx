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
  ShoppingBag,
  CalendarDots,
  Handshake,
} from "@phosphor-icons/react/dist/ssr";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IconPhosphor } from "./IconPhosphor";
import { createPost } from "../features/posts/store/PostSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import { AppTooltip } from "./AppTooltip";
import { Select, type FancyOption } from "./Select";
import { Globe } from "@phosphor-icons/react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableImage } from "./SortableImage";
import type { UserPost } from "../entities/post/UserPost";
import { apiUrl } from "../shared/api/ApiClient";

interface MediaItem {
  id: string;
  file?: File;
  url?: string;
  type: "image" | "video";
  isExisting: boolean;
}
type PostCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  setIsCreateDialogOpen?: ((data: boolean) => void) | null;
  post: UserPost | null;
};

export default function PostCreateDialog({
  open,
  onClose,
  setIsCreateDialogOpen,
  post,
}: PostCreateDialogProps) {
  const user = useAppSelector((state) => state.auth.user);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.post);
  const [existingMedias, setExistingMedias] = useState<MediaItem[]>([]);

  const visibilityOptions: FancyOption[] = [
    {
      value: 3,
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
      value: 1,
      title: "Mahalleniz",
      subtitle: `Sadece ${user?.neighborhood}`,
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

    if (!post) {
      existingMedias.forEach((item) => {
        if (item.file) {
          formData.append("files", item.file);
        }
      });

      const actionResult = await dispatch(createPost(formData));

      if (isFulfilled(actionResult)) {
        reset();
        onClose();
        setExistingMedias([]);
      }
    } else {
      formData.append("postId", post.postId);

      const mediaOrder = existingMedias.map((item) => {
        if (item.isExisting) {
          return {
            type: "existing",
            id: item.id,
            mediaType: item.type,
          };
        } else {
          return {
            type: "new",
          };
        }
      });

      formData.append("mediaOrder", JSON.stringify(mediaOrder));

      existingMedias.forEach((item) => {
        if (!item.isExisting && item.file) {
          formData.append("files", item.file);
        }
      });
    }
  };
  useEffect(() => {
    if (existingMedias.length > 10) {
      toast.warning("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");
    }
  }, [existingMedias]);

  useEffect(() => {
    if (post) {
      reset({
        content: post.content,
        postVisibilty: post.postVisibilty,
      });
      if (post?.medias) {
        const existing: MediaItem[] = post.medias.map((m) => ({
          id: m.mediaId,
          url: `${apiUrl}${m.type === 1 ? "post-images/" : "post-videos/"}${
            m.url
          }`,
          type: m.type === 2 ? "video" : "image",
          isExisting: true,
        }));
        setExistingMedias(existing);
      }
    } else {
      reset({
        content: "",
        postVisibilty: 1,
        postType: 1,
      });
    }
  }, [post, reset]);

  const imageDrop = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (imageFiles) => {
      if (existingMedias.length + imageFiles.length > 10) {
        toast.warning("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");
      }

      const newFiles: MediaItem[] = imageFiles.map((file: any) => ({
        id: `new-${file.name}-${Date.now()}`,
        file: file,
        type: "image",
        isExisting: false,
      }));

      setExistingMedias((prev) => [...prev, ...newFiles]);
    },
  });

  const videoDrop = useDropzone({
    accept: { "video/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop: (videoFiles) => {
      if (existingMedias.length + videoFiles.length > 10) {
        toast.warning("Bir gönderiye en fazla 10 adet medya ekleyebilirsiniz.");
      }

      const existingVideoCount = existingMedias.filter(
        (f) => (f.type = "video")
      ).length;

      const incomingVideoCount = videoFiles.filter((f) =>
        f.type.startsWith("video/")
      ).length;

      if (existingVideoCount + incomingVideoCount > 1) {
        toast.warning("Bir gönderiye sadece 1 adet video ekleyebilirsiniz.");
      }
      const newFiles: MediaItem[] = videoFiles.map((file: any) => ({
        id: `new-${file.name}-${Date.now()}`,
        file: file,
        type: "video",
        isExisting: false,
      }));
      setExistingMedias((prev) => [...prev, ...newFiles]);
    },
  });

  const handleRemove = (id: string) => {
    setExistingMedias((prevItems) => {
      return prevItems.filter((item) => item.id !== id);
    });
  };
  const pendingCreatePost = status === "pendingCreatePost";

  const contentValue = watch("content");
  const showRightPanel = !contentValue?.trim() && existingMedias.length === 0;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = existingMedias.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = existingMedias.findIndex((item) => item.id === over.id);
      if (setExistingMedias) {
        setExistingMedias((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: (theme) => ({
          margin: 0,
          width: { xs: "100vw", sm: "720px" },
          height: { xs: "100dvh", sm: "auto" },
          maxWidth: { xs: "100vw", sm: "720px" },
          maxHeight: { xs: "100dvh", sm: "none" },
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
            minHeight: 0,
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
                rules={{ required: "Lütfen bir mesaj girin" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    placeholder={`Ne düşünüyorsun, ${user?.firstName}?`}
                    multiline
                    minRows={3}
                    variant="standard"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      mt: 3,
                      p: 1.5,
                      borderRadius: 1.5,
                      "& .MuiInput-underline:before": {
                        borderBottom: "none",
                      },
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
              {existingMedias.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={existingMedias.map((f) => f.id)}
                      strategy={rectSortingStrategy}
                    >
                      <Grid container spacing={1}>
                        {existingMedias.map((item) => (
                          <SortableImage
                            key={item.id}
                            id={item.id}
                            file={item.file}
                            url={item.url}
                            mediaType={item.type as "image" | "video"}
                            onRemove={() => handleRemove(item.id)}
                          />
                        ))}
                      </Grid>
                    </SortableContext>
                  </DndContext>
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
                ) : post ? (
                  "Düzenle"
                ) : (
                  "Paylaş"
                )}
              </Button>
            </DialogActions>
          </form>
        </Box>

        {(showRightPanel || !post) && (
          <Box
            sx={{
              px: { sm: 2, xs: 2 },
              width: { xs: "100%", sm: 225 },
              borderLeft: {
                xs: "none",
                sm: "1px solid #E0E0E0",
              },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexShrink: 0,
              pb: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="text.primary"
              display={{ xs: "none", sm: "block" }}
            >
              Yeni bir şey oluştur
            </Typography>

            <Stack spacing={1}>
              <Button
                fullWidth
                sx={{
                  py: 2,
                  px: 3,
                  borderRadius: 2,
                  backgroundColor: (theme) => theme.palette.icon.background,
                  color: "text.primary",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                <ShoppingBag size={28} weight="regular" />
                <Typography variant="body1" fontWeight={620} fontSize={13}>
                  Sat veya ücretsiz ver
                </Typography>
              </Button>

              <Button
                fullWidth
                onClick={() => setIsCreateDialogOpen?.(true)}
                sx={{
                  py: 2,
                  px: 3,
                  borderRadius: 2,
                  backgroundColor: (theme) => theme.palette.icon.background,
                  color: "text.primary",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                <CalendarDots size={28} weight="regular" />
                <Typography variant="body1" fontWeight={620} fontSize={13}>
                  Etkinlik oluştur
                </Typography>
              </Button>

              <Button
                fullWidth
                sx={{
                  py: 2,
                  px: 3,
                  borderRadius: 2,
                  backgroundColor: (theme) => theme.palette.icon.background,
                  color: "text.primary",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                <Handshake size={28} weight="regular" />
                <Typography variant="body1" fontWeight={620} fontSize={13}>
                  Ödünç ver
                </Typography>
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Dialog>
  );
}
