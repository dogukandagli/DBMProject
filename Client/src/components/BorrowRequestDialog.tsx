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
  CircularProgress,
} from "@mui/material";
import { PhotoDropzone } from "./PhotoDropzone";
import { X } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { createBorrowRequest } from "../features/borrowRequests/store/BorrowRequestSlice";
import { isFulfilled } from "@reduxjs/toolkit";

type BorrowRequestDialogProps = {
  open: boolean;
  onClose: () => void;
};
interface FormInputs {
  title: string;
  description: string;
  category: string;
  image: File[] | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export default function BorrowRequestDialog({
  open,
  onClose,
}: BorrowRequestDialogProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.borrowRequests);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image: null,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("startTime", `${data.startDate}T${data.startTime}`);

    if (data.endDate && data.endTime) {
      formData.append("endTime", `${data.endDate}T${data.endTime}`);
    }

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    const actionResult = await dispatch(createBorrowRequest(formData));
    if (isFulfilled(actionResult)) {
      onClose();
      reset();
    }
  };

  const pendingCreateBorrowRequest = status === "pendingCreateBorrowRequest";

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
            Ödünç İste
          </Typography>
          <IconButton onClick={onClose}>
            <X size={25} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Başlık
                </Typography>
                <TextField
                  fullWidth
                  label="Ödünç Başlığı"
                  placeholder="Örn: Matkaba ihtiyacım var"
                  {...register("title", { required: "Başlık zorunludur" })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Kategori
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Kategori"
                  defaultValue=""
                  {...register("category", { required: "Kategori seçiniz" })}
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  <MenuItem value="alet-edavat">Alet – Edevat</MenuItem>
                  <MenuItem value="ev-gunluk">Ev & Günlük Kullanım</MenuItem>
                  <MenuItem value="arac-tasima">Araç & Taşıma</MenuItem>
                  <MenuItem value="organizasyon-etkinlik">
                    Organizasyon & Etkinlik
                  </MenuItem>
                  <MenuItem value="elektronik-teknoloji">
                    Elektronik & Teknoloji
                  </MenuItem>
                  <MenuItem value="kamera-medya">Kamera & Medya</MenuItem>
                  <MenuItem value="kamp-outdoor">Kamp & Outdoor</MenuItem>
                  <MenuItem value="bebek-cocuk">Bebek & Çocuk</MenuItem>
                  <MenuItem value="spor-hobi">Spor & Hobi</MenuItem>
                  <MenuItem value="egitim-ofis">Eğitim & Ofis</MenuItem>
                  <MenuItem value="mutfak">Mutfak</MenuItem>
                  <MenuItem value="diğer">Diğer</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {"Fotoğraf (opsiyonel)"}
                </Typography>
                <Controller
                  control={control}
                  name="image"
                  render={({ field: { onChange, value } }) => (
                    <PhotoDropzone onChange={onChange} value={value} />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Açıklama
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Duvarımı delmek için lazım..."
                  {...register("description", {
                    required: "Açıklama zorunludur",
                  })}
                  error={!!errors.description}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: `${theme.palette.icon.background}`, // Görseldeki açık gri tonu
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

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Ne kadar kullanıcaksın?
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
                      {...register("startDate", { required: "Gerekli" })}
                      error={!!errors.startDate}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 5 }}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Saat"
                      InputLabelProps={{ shrink: true }}
                      {...register("startTime", { required: "Gerekli" })}
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
                      {...register("endDate", { required: "Gerekli" })}
                      error={!!errors.endDate}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 5 }}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Saat"
                      InputLabelProps={{ shrink: true }}
                      {...register("endTime", { required: "Gerekli" })}
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
            <Button
              disabled={pendingCreateBorrowRequest}
              type="submit"
              variant="contained"
            >
              {pendingCreateBorrowRequest ? <CircularProgress /> : "Paylaş"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
