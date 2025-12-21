import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { X, MapPin } from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { useForm } from "react-hook-form";
import { createEvent } from "../features/events/store/EventSlice";

import { isFulfilled } from "@reduxjs/toolkit";

interface FormInputs {
  title: string;
  description: string | null;
  coverPhoto: File | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  latitude: number;
  longitude: number;
  capacity: number | null;
  price: number | null;
}

type EventCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function EventCreateDialog({
  open,
  onClose,
}: EventCreateDialogProps) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.eventRequests);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      title: "",
      description: "",
      coverPhoto: null,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      latitude: 1,
      longitude: 1,
      capacity: null,
      price: null,
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("eventStartDate", `${data.startDate}T${data.startTime}`);
    formData.append("eventEndDate", `${data.endDate}T${data.endTime}`);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);

    if (selectedFile) {
      formData.append("coverPhoto", selectedFile);
    }

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.capacity) {
      formData.append("capacity", data.capacity);
    }

    if (data.price) {
      formData.append("price", data.price);
    }

    const result = await dispatch(createEvent(formData));

    if (result) {
      if (isFulfilled(result)) {
        onClose();
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const pendingCreateEvent = status === "pendingCreateEvent";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      setSelectedFile(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            id="header"
            sx={{
              top: 5,
              left: 1,
              m: 1,
              display: "flex",
              justifyContent: "space-between",
              flexShrink: 0,
              alignItems: "center",
              mb: 3,
            }}
          >
            <IconButton onClick={onClose}>
              <X size={32} weight="bold" />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Yeni Etkinlik
            </Typography>

            <Button
              type="submit"
              variant="contained"
              disabled={pendingCreateEvent}
            >
              {pendingCreateEvent ? <CircularProgress /> : "Oluştur"}
            </Button>
          </Box>

          <DialogContent
            dividers={false}
            sx={{ p: 0, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <Grid
              id="cover photo"
              sx={{
                m: 2,
                mt: 1,
                width: "%100",
                height: "380px",
                backgroundColor: "#E0E0E0",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                borderRadius: { xs: 0, sm: 4.5 },
                overflow: "hidden",
                position: "relative",
              }}
            >
              {previewUrl ? (
                <>
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Selected Cover"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  ></Box>

                  <IconButton
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    }}
                  >
                    <X size={24} weight="bold" />
                  </IconButton>
                </>
              ) : (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<ImageIcon />}
                  sx={{
                    backgroundColor: "#1E293B",
                    color: "white",
                    textTransform: "none",
                    height: "50px",
                    borderRadius: "50px",
                    padding: "8px 24px",
                    mt: 20,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#334155",
                    },
                  }}
                >
                    Kapak fotoğrafı
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>
              )}
            </Grid>

            <Grid id="title" sx={{ m: 2 }}>
              <TextField
                label="Başlık"
                placeholder="Örn: Doğum günü partisi"
                {...register("title", { required: "Başlık zorunludur" })}
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  width: "100%",
                  "& fieldset": {
                    borderColor: "black",
                    borderWidth: "2px",
                  },
                }}
              ></TextField>
            </Grid>

            <Grid id="start date and time" container spacing={2} sx={{ m: 2 }}>
              <Grid
                size={{ xs: 12, sm: 3 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  Başlangıç
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 9 }}>
                <Stack direction="row" spacing={5}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Tarih"
                    InputLabelProps={{ shrink: true }}
                    {...register("startDate", { required: "Başlangıç tarihi zorunludur" })}
                    error={!!errors.startDate}
                  />

                  <TextField
                    fullWidth
                    type="time"
                    label="Saat"
                    InputLabelProps={{ shrink: true }}
                    {...register("startTime", { required: "Başlangıç zamanı zorunludur" })}
                    error={!!errors.startTime}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Grid id="end date and time" container spacing={2} sx={{ m: 2 }}>
              <Grid
                size={{ xs: 12, sm: 3 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  Bitiş
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 9 }}>
                <Stack direction="row" spacing={5}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Tarih"
                    InputLabelProps={{ shrink: true }}
                    {...register("endDate", { required: "Bitiş tarihi zorunludur" })}
                    error={!!errors.endDate}

                  />

                  <TextField
                    fullWidth
                    type="time"
                    label="Saat"
                    InputLabelProps={{ shrink: true }}
                    {...register("endTime", { required: "Bitiş zamanı zorunludur" })}
                    error={!!errors.endTime}

                  />
                </Stack>
              </Grid>
            </Grid>

            <Grid id="location" container spacing={2} sx={{ m: 2 }}>
              <Grid
                size={{ xs: 12, sm: 3 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  Konum
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 9 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<MapPin size={24} />}
                  sx={{
                    justifyContent: "flex-start",
                    height: "56px",
                    borderRadius: "12px",
                    borderColor: "black",
                    borderWidth: "1px",
                    color: "text.secondary",
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderWidth: "1px",
                      borderColor: "black",
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  Konum ekleyin...
                </Button>
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ m: 2 }}> 

              <Grid
                size={{ xs: 12, sm: 3 }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  Kapasite
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 9 }}>
              <Stack direction={"row"} spacing={3}>

                <TextField
                  label="Kapasite"
                  type="number"
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register("capacity", { required: false})}
                />
              
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1rem", display: "flex", alignItems: "center" }}
                >
                  Ücret
                </Typography>
 
                <TextField
                  label="Ücret"
                  type="number"
                  variant="outlined"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register("price", { required: false })}
                />


            </Stack>
            </Grid>
            </Grid>

            <Grid id="description" sx={{ m: 2, mt: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  mb:1,
                }}
              >
                Detay ekleyin(opsiyonel)
              </Typography>

              <TextField
                multiline
                rows={4}
                label="Açıklama"
                placeholder="Örn: Doğum günümü kafe'de kutlayacağım"
                {...register("description", { required: false })}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#E0E0E0",
                  },
                  "& fieldset": {
                    borderColor: "black",
                    borderWidth: "2px",
                  },
                }}
              ></TextField>
            </Grid>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
