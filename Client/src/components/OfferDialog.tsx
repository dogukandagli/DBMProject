import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  useTheme,
  FormHelperText,
  Box,
} from "@mui/material";
import { X } from "@phosphor-icons/react";
import { useAppDispatch } from "../app/store/hooks";
import { createOffer } from "../features/borrowRequests/store/BorrowRequestSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import { Image, CameraPlus } from "@phosphor-icons/react/dist/ssr";
import {
  conditionOptions,
  handoverOptions,
  type ConditionType,
  type HandoverMethodType,
} from "../entities/BorrowRequest/ConditionEnum";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { SortableImage } from "./SortableImage";
import type { BorrowRequestDto } from "../entities/BorrowRequest/BorrowRequestDto";

interface FormInputs {
  condition: ConditionType | "";
  description: string;
  handoverMethod: HandoverMethodType | "";
  startDate: string | null;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
}
interface MediaItem {
  id: string;
  file?: File;
  url?: string;
}

type OfferDialogProps = {
  open: boolean;
  onClose: () => void;
  borrowRequest: BorrowRequestDto | null;
};

export default function OfferDialog({
  open,
  onClose,
  borrowRequest,
}: OfferDialogProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      condition: "",
      description: "",
      handoverMethod: "",
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    },
  });
  const [existingMedias, setExistingMedias] = useState<MediaItem[]>([]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("borrowRequestId", borrowRequest!.id);
    formData.append("condition", data.condition);
    formData.append("description", data.description);
    formData.append("handoverMethod", data.handoverMethod);
    if (data.startDate && data.startTime) {
      formData.append("startTime", `${data.startDate}T${data.startTime}`);
    }
    if (data.endDate && data.endTime) {
      formData.append("endTime", `${data.endDate}T${data.endTime}`);
    }

    if (existingMedias && existingMedias.length > 0) {
      existingMedias.forEach((item) => {
        if (item.file) {
          formData.append("images", item.file);
        }
      });
    }
    const actionResult = await dispatch(createOffer(formData));
    if (isFulfilled(actionResult)) {
      onClose();
      reset();
    }
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop: (imageFiles) => {
      const newFiles: MediaItem[] = imageFiles.map((file: any) => ({
        id: `new-${file.name}-${Date.now()}`,
        file: file,
        type: "image",
      }));
      setExistingMedias((prev) => [...prev, ...newFiles]);
    },
    accept: { "image/*": [] },
    noClick: existingMedias.length > 0,
    noKeyboard: true,
  });

  const handleRemove = (id: string) => {
    setExistingMedias((prevItems) => {
      return prevItems.filter((item) => item.id !== id);
    });
  };
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
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: (theme) => ({
            margin: 0,
            width: { xs: "100vw", sm: "720px" },
            height: { xs: "100dvh", sm: "auto" },
            maxWidth: { xs: "100vw", sm: "720px" },
            maxHeight: { xs: "100dvh", sm: "90dvh" },
            borderRadius: { xs: 0, sm: 4.5 },
            py: 2,
            px: 1,
            position: "absolute",
            top: { xs: "0px", sm: "75px" },
            backgroundColor: theme.palette.background.default,
          }),
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography fontSize={25} fontWeight="bold">
            Teklif Ver
          </Typography>
          <IconButton onClick={onClose}>
            <X size={25} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  <strong>{borrowRequest?.borrower.fullName}</strong>{" "}
                  kullanıcısının <u>{borrowRequest?.itemNeeded.title}</u>{" "}
                  ihtiyacı için teklif veriyorsunuz.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Fotoğraflar
                </Typography>
                <input {...getInputProps()} />
                {existingMedias.length === 0 ? (
                  <Box
                    {...getRootProps()}
                    sx={{
                      mt: 2,
                      height: "250px",
                      backgroundColor: isDragActive
                        ? `${theme.palette.accent.background}`
                        : `${theme.palette.icon.background}`,
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Image size={48} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, color: "text.primary", fontWeight: 600 }}
                    >
                      {isDragActive ? "Bırakın Yüklesin!" : "Fotoğraf Yükle"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Cihazınızdan seçmek için tıklayın
                    </Typography>
                  </Box>
                ) : (
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
                          {[...existingMedias].map((item) => (
                            <SortableImage
                              key={item.id}
                              id={item.id}
                              file={item.file}
                              url={item.url}
                              onRemove={() => handleRemove(item.id)}
                            />
                          ))}
                          <Grid>
                            <Button
                              sx={{ mt: 8, ml: 8 }}
                              onClick={openFileDialog}
                            >
                              <CameraPlus
                                color={theme.palette.icon.main}
                                size={50}
                                weight="bold"
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </SortableContext>
                    </DndContext>
                  </Box>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Açıklama
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Merhaba, ürünüm belirttiğiniz tarihlerde müsait..."
                  {...register("description", {
                    required: "Açıklama zorunludur",
                  })}
                  error={!!errors.description}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: `${theme.palette.icon.background}`,
                      borderRadius: "12px",
                      padding: "16px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "0.95rem",
                      color: `${theme.palette.icon.main}`,
                      lineHeight: 1.5,
                    },
                  }}
                />
                {errors.description && (
                  <FormHelperText error sx={{ ml: 1, mt: 0.5 }}>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Ürün Durumu
                </Typography>
                <Controller
                  name="condition"
                  control={control}
                  rules={{ required: "Lütfen bir durum seçiniz." }} // Validasyon hatası (Türkçe)
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Ürün Durumu"
                      variant="outlined"
                      fullWidth
                      error={!!errors.condition}
                      helperText={errors.condition?.message}
                    >
                      {conditionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Teslimat
                </Typography>
                <Controller
                  name="handoverMethod"
                  control={control}
                  rules={{ required: "Lütfen bir teslimat yöntemi seçiniz." }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Teslimat Yöntemi"
                      variant="outlined"
                      fullWidth
                      error={!!errors.handoverMethod}
                      helperText={errors.handoverMethod?.message}
                    >
                      {handoverOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {" Müsaitlik durumu nedir? (Opsiyonel)"}
                </Typography>
                <Grid container alignItems="center" spacing={2}>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography variant="subtitle2">Başlangıç</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 5 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Tarih"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startDate}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 5 }}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Saat"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startTime}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Typography variant="subtitle2">Bitiş</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 5 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Tarih"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.endDate}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 5 }}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Saat"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.endTime}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} color="inherit">
              İptal
            </Button>
            <Button type="submit" variant="contained">
              {"Paylaş"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
