import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import {
  fetchNeighborhoods as fetchNeighborhoodsThunk,
  type Neighborhood,
} from "../../features/neighborhoods/store/neighborhoodSlice";
import { NavigationArrow } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { checkEmail, registerUser } from "../../features/auth/store/AuthSlice";
import { clearNeighborhoodOptions } from "../../features/neighborhoods/store/neighborhoodSlice";
import { Link } from "react-router";
import { findByGps } from "../../features/location/store/LocationSlice";
import mapboxgl from "mapbox-gl";
const steps = [
  "Mahallenize katılmak için bir hesap oluşturun.",
  "Merhaba komşu! Adın ne? ",
  "Harika! Şimdi mahallenizi bulalım.",
  "Doğum tarihinizi seçiniz ",
];
mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9ndWthbmRhZ2xpIiwiYSI6ImNtaTM3MWI5OTFlNm4ybXNmdm5idmo2dm0ifQ.mWkmdo2-w8z4XLtCxQ1P5g";

type FormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  neighborhoodId: number | null;
  birthDate: string | null;
  verificationTicket: string | null;
};
type FormFields =
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "neighborhoodId"
  | "birthDate";

export default function CreateAccountPage() {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const { loading, options } = useAppSelector((state) => state.neighborhood);
  const { status } = useAppSelector((state) => state.auth);
  const locationStatus = useAppSelector((state) => state.location.status);
  const [open, setOpen] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  console.log(latitude, longitude);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      neighborhoodId: null,
      birthDate: null,
      verificationTicket: null,
    },
  });

  const onSubmit = (data: FieldValues) => {
    console.log("Gönderilen data:", data);
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (activeStep === steps.length + 1) {
      handleSubmit(onSubmit)();
    }
  }, [activeStep]);

  const handleNext = async () => {
    let fieldsToValidate: FormFields[] = [];

    if (activeStep === 0) {
      fieldsToValidate = ["email", "password"];
    } else if (activeStep === 1) {
      fieldsToValidate = ["firstName", "lastName"];
    } else if (activeStep == 2) {
      fieldsToValidate = ["neighborhoodId"];
    } else if (activeStep == 3) {
      fieldsToValidate = ["birthDate"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }
    if (activeStep == 0) {
      const email = getValues("email");
      const payload = {
        email: email,
      };
      const result = await dispatch(checkEmail(payload));
      if (checkEmail.rejected.match(result)) {
        return;
      }
    }
    if (activeStep == steps.length + 1) {
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    if (activeStep == 0) {
      return;
    }
    setActiveStep((prev) => prev - 1);
  };

  const fetchNeighborhoods = (() => {
    let timer: any;

    return (query: string) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        const merge = `?count=true&$filter=contains(Name,'${query}')`;
        dispatch(fetchNeighborhoodsThunk(merge) as any);
      }, 500);
    };
  })();

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log("Konum alındı:", latitude, longitude);
        try {
          const gpsResult = await dispatch(
            findByGps({ latitude, longitude })
          ).unwrap();

          setValue("neighborhoodId", gpsResult.id);
          setValue("verificationTicket", gpsResult.verificationTicket);

          handleNext();
        } catch (err) {
          setOpen(false);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Konum izni reddedildi. Lütfen izin verin.");
        } else {
          alert("Konum alınamadı. Tekrar deneyin.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeStep != 4) return;
    if (latitude == null || longitude == null) return;
    if (!mapContainer.current) return;

    const center: [number, number] = [longitude, latitude];
    const map = new mapboxgl.Map({
      container: mapContainer.current, // artık HTMLElement olarak doğru tipte
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom: 16,
      attributionControl: false,
    });
    new mapboxgl.Marker().setLngLat(center).addTo(map);

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: "© Mapbox © OpenStreetMap",
      }),
      "bottom-right"
    );

    return () => map.remove();
  }, [activeStep, latitude, longitude]);

  const isLastStep = activeStep === steps.length + 2;
  const isCreating = status === "pendingRegister";
  const isSuccess = status === "idle";
  const pendingcheckEmail = status === "pendingcheckEmail";
  const pendingFindByGps = locationStatus === "pendingFindByGps";

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            mb={6}
            sx={{
              mx: "auto",
            }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email", {
                required: "Email zorunludur",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Geçerli bir email giriniz",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  fontSize: 16,
                  paddingY: 1,
                },
              }}
            />

            <TextField
              label="Şifre"
              type="password"
              fullWidth
              {...register("password", {
                required: "Şifre zorunludur",
                minLength: {
                  value: 6,
                  message: "Şifre en az 6 karakter olmalıdır",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).+$/,
                  message: "Şifre en az 1 büyük harf ve 1 sayı içermelidir",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  fontSize: 16,
                  paddingY: 1,
                },
              }}
            />
          </Box>
        );
      case 1:
        return (
          <>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              mb={6}
            >
              <TextField
                label="Ad"
                fullWidth
                {...register("firstName", {
                  required: "Ad zorunludur",
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    fontSize: 16,
                    paddingY: 1,
                  },
                }}
              />

              <TextField
                label="Soy Ad"
                fullWidth
                {...register("lastName", { required: "Soy Ad zorunludur" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    fontSize: 16,
                    paddingY: 1,
                  },
                }}
              />
            </Box>
          </>
        );
      case 2:
        return (
          <Box>
            <Controller
              name="neighborhoodId"
              control={control}
              rules={{ required: "Mahalle seçmek zorunludur" }}
              render={({ field }) => {
                const { onChange, value, ref } = field;

                return (
                  <Autocomplete<Neighborhood, false, false, false>
                    options={options}
                    loading={loading}
                    getOptionLabel={(option) => option?.name || ""}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    value={options.find((o) => o.id === value) ?? null}
                    onChange={(_, newValue) => {
                      onChange(newValue ? newValue.id : null);
                    }}
                    onInputChange={(_, inputValue) => {
                      if (inputValue !== "") {
                        fetchNeighborhoods(inputValue);
                      } else {
                        dispatch(clearNeighborhoodOptions());
                      }
                    }}
                    noOptionsText={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 2,
                          px: 2,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                          fontWeight: 700,
                        }}
                        onClick={() => {
                          if (!pendingFindByGps) {
                            handleUseLocation();
                          }
                        }}
                      >
                        <NavigationArrow
                          size={24}
                          style={{ transform: "rotate(90deg)" }}
                        />
                        <Typography variant="body2" color="text.primary">
                          Evde misiniz? Mevcut konumunuzu kullanın.
                        </Typography>
                      </Box>
                    }
                    onFocus={() => {
                      dispatch(clearNeighborhoodOptions());
                    }}
                    freeSolo={false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label="Adres"
                        variant="outlined"
                        error={!!errors.neighborhoodId}
                        helperText={errors.neighborhoodId?.message}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            borderRadius: 3,
                            paddingRight: 0,
                          },
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                              <IconButton edge="end" sx={{ mr: 1 }}>
                                <SendIcon />
                              </IconButton>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                );
              }}
            />
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              fullWidth
              sx={{
                "& .MuiDialog-container": {
                  alignItems: { xs: "flex-end", md: "center" },
                },
                "& .MuiPaper-root": {
                  width: "100%",
                  m: { xs: 0, md: 2 },
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: { xs: 0, md: 5 },
                },
              }}
            >
              <Box sx={{ padding: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    mb: 2,
                  }}
                >
                  Adresiniz için mevcut konumunuzu kullanıyor musunuz?
                </Typography>

                <Typography
                  sx={{
                    mb: 3,
                    color: "rgba(0,0,0,0.7)",
                    lineHeight: 1.5,
                    fontWeight: 200,
                  }}
                >
                  Sizi doğru mahalleye yerleştirmek ve evdeyseniz hesabınızı
                  doğrulamak için konumunuzu kullanıyoruz. Konum izinlerinizi
                  etkinleştirmeniz gerekecektir.
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={pendingFindByGps}
                  onClick={handleUseLocation}
                  endIcon={
                    <NavigationArrow
                      size={24}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  }
                  sx={{
                    mb: 1.5,
                    py: 1.6,
                    borderRadius: 50,
                    bgcolor: "#0c1c49",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "#0a1639",
                      textTransform: "none",
                    },
                  }}
                >
                  {pendingFindByGps ? (
                    <CircularProgress size={24} thickness={5} />
                  ) : (
                    "Konumumu Kullan"
                  )}
                </Button>

                <Button
                  fullWidth
                  onClick={() => setOpen(false)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#0c1c49",
                    mt: 1,
                  }}
                >
                  Adres Yaz
                </Button>
              </Box>
            </Dialog>
          </Box>
        );
      case 3:
        return (
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="birthDate"
                control={control}
                rules={{ required: "Tarih seçmek zorunludur" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Doğum Tarihi"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(
                        newValue ? newValue.format("YYYY-MM-DD") : ""
                      );
                    }}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        );
      case 4:
        return (
          <>
            {latitude != null ? (
              <>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{
                    color: "#1976d2",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  Konumun
                </Typography>

                <div
                  ref={mapContainer}
                  style={{ width: "100%", height: "40vh" }}
                />
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  p: 3,
                  mt: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: "white",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ color: "#d32f2f", mb: 1 }}
                >
                  Konum doğrulanamadı
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Konumun doğrulanmadığı için seni sadece mahallede gezintiye
                  çıkaracağız. Tüm özelliklere erişmek için konum doğrulaması
                  yapabilirsin.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#1976d2",
                    fontWeight: 500,
                  }}
                >
                  Dilediğin zaman profilinden konum doğrulaması yapabilirsin.
                </Typography>
              </Box>
            )}
          </>
        );
      case 5:
        return (
          <Box
            style={{
              padding: "24px",
              maxWidth: 400,
              margin: "32px auto",
              textAlign: "center",
              borderRadius: 16,
            }}
          >
            <Box mb={2} display="flex" justifyContent="center">
              {isCreating && (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <CircularProgress />
                </Box>
              )}

              {isSuccess && <CheckCircleOutlineIcon style={{ fontSize: 48 }} />}
            </Box>

            <Typography variant="h6" gutterBottom>
              {isCreating && "Hesabınız oluşturuluyor"}
              {isSuccess && "Hesabınız başarıyla oluşturuldu"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {isCreating &&
                "Lütfen birkaç saniye bekleyin, bilgileriniz işleniyor..."}
              {isSuccess &&
                "Artık giriş yapabilir veya ana sayfaya dönebilirsiniz."}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box mt={3}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={2}
          >
            <IconButton onClick={handleBack}>
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1a7f37" }}
              >
                Komşu
              </Typography>
            </Box>
            {activeStep == 0 ? (
              <Box
                component={Link}
                to={"/login"}
                sx={{
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "grey.200",
                    cursor: "pointer",
                  },
                  p: 1,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "rgb(35, 47, 70)" }}
                >
                  Giriş Yap
                </Typography>
              </Box>
            ) : (
              <Box width={80} />
            )}
          </Box>
          <LinearProgress
            variant="determinate"
            value={activeStep * (100 / (steps.length + 1))}
            sx={{
              width: "100%",
              height: 5,
              bgcolor: "#e0e0e0",
              borderRadius: 999,
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#000",
                transition: "transform 0.6s ease-in-out",
              },
            }}
          />
          <Box mb={4} mt={8}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: "1.5rem",
                lineHeight: 1.2,
                color: "#1a1a1a",
              }}
            >
              {steps[activeStep]}
            </Typography>
          </Box>
          <Box mt={5} component={"form"}>
            <Box mb={3} key={activeStep}>
              {renderStepContent(activeStep)}
            </Box>
            <Box
              display={"flex"}
              justifyContent={{ xs: "center", sm: "flex-end" }}
            >
              {!isLastStep && (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    borderRadius: 999,
                    textTransform: "none",
                    py: "0.8rem",
                    px: "1.4rem",
                    fontSize: 16,
                    fontWeight: 600,
                    backgroundColor: "#4382f0ff",
                    "&:hover": {
                      backgroundColor: "#5a92f3ff",
                    },
                  }}
                >
                  {pendingcheckEmail ? (
                    <CircularProgress size={24} thickness={5} />
                  ) : (
                    "Devam Et"
                  )}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
