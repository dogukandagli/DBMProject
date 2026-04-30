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
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { NavigationArrow } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  checkEmail,
  registerUser,
  verifyLocation,
} from "../../features/auth/store/AuthSlice";
import { Link, useLocation, useNavigate } from "react-router";
import {
  clearPlaces,
  fetchAutoComplete,
  fetchPlaceDetails,
  fetchReverseGeocode,
} from "../../features/location/store/LocationSlice";
import mapboxgl from "mapbox-gl";
import type { AutoComplete } from "../../entities/location/autoComplete";
import RoomIcon from "@mui/icons-material/Room";
import { isFulfilled } from "@reduxjs/toolkit";
import MapWithStatusMarker from "../../components/MapWithStatusMarker/MapWithStatusMarker";

const steps = [
  "Mahallenize katılmak için bir hesap oluşturun.",
  "Merhaba komşu! Adın ne? ",
  "Harika! Şimdi mahallenizi bulalım.",
  "Doğum tarihinizi seçiniz ",
];
const FORCED_LOCATION_IDS = {
  cityId: 35,
  districtId: 35,
  neighborhoodId: 1,
};
const DUMMY_ADDRESS = {
  placeId: "adatepe-dummy",
  formattedAddress: "Adatepe",
  streetAddress: "Adatepe",
  latitude: 38.423734,
  longitude: 27.142826,
};
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX;

type FormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  placeId: string | null;
  birthDate: string | null;
  verificationTicket: string | null;
  neighborhoodId: number | null;
};
type FormFields =
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "placeId"
  | "birthDate"
  | "neighborhoodId";

export default function CreateAccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.neighborhood);
  const { status, verifyUser } = useAppSelector((state) => state.auth);
  const locationStatus = useAppSelector((state) => state.location.status);
  const [open, setOpen] = useState(true);
  const { options, selectedDetails, deviceLocation } = useAppSelector(
    (state) => state.location
  );
  const [addressInputValue, setAddressInputValue] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    control,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: location.state?.email || "",
      password: "",
      firstName: "",
      lastName: "",
      placeId: null,
      birthDate: null,
      neighborhoodId: null,
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const placeId = data.placeId?.trim() || DUMMY_ADDRESS.placeId;
    const streetAddress =
      selectedDetails?.streetAddress?.trim() || DUMMY_ADDRESS.streetAddress;
    const formattedAddress =
      selectedDetails?.formattedAddress || DUMMY_ADDRESS.formattedAddress;
    const latitude =
      selectedDetails?.geoPoint?.latDegrees ?? DUMMY_ADDRESS.latitude;
    const longitude =
      selectedDetails?.geoPoint?.lonDegrees ?? DUMMY_ADDRESS.longitude;

    const finalRequest = {
      ...data,
      cityId: FORCED_LOCATION_IDS.cityId,
      districtId: FORCED_LOCATION_IDS.districtId,
      neighborhoodId: FORCED_LOCATION_IDS.neighborhoodId,
      placeId,
      latitude,
      longitude,
      streetAddress,
      formattedAddress,
    };

    const result = await dispatch(registerUser(finalRequest));

    if (isFulfilled(result)) {
      handleNext();
    }
  };

  useEffect(() => {
    if (activeStep === 4) {
      handleSubmit(onSubmit)();
    }
    if (activeStep === 5 && deviceLocation?.geoPoint) {
      dispatch(
        verifyLocation({
          latitude: deviceLocation?.geoPoint?.latDegrees,
          longitude: deviceLocation?.geoPoint?.lonDegrees,
        })
      );
    }
  }, [activeStep]);

  const handleNext = async () => {
    if (activeStep == 2) {
      setValue("neighborhoodId", FORCED_LOCATION_IDS.neighborhoodId);
      if (!getValues("placeId")) {
        setValue("placeId", DUMMY_ADDRESS.placeId);
      }
    }

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

    if (activeStep == 4 && isRejected) {
      return;
    }
    if (activeStep == steps.length + 1) {
      navigate("/login");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    if (activeStep == 0) {
      navigate("/");
      return;
    }
    if (activeStep == 5) {
      return;
    }
    setActiveStep((prev) => prev - 1);
  };

  const fetchPlacesDebounced = useMemo(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (query: string, sessionToken: string) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        dispatch(fetchAutoComplete({ query, sessionToken }));
      }, 500);
    };
  }, [dispatch]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const gpsResult = await dispatch(
          fetchReverseGeocode({ latitude, longitude })
        );
        if (isFulfilled(gpsResult)) {
          const adress = gpsResult.payload.formattedAddress;
          setAddressInputValue(adress ?? "");

          if (adress) {
            const token = sessionToken ?? createSessionToken();
            if (!sessionToken) setSessionToken(token);

            dispatch(fetchAutoComplete({ query: adress, sessionToken: token }));
          }
          setAutocompleteOpen(true);
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

  const isLastStep = activeStep === steps.length + 2;
  const isCreating = status === "pendingRegister";
  const isSuccess = status === "fulfilledregister";
  const isRejected = status === "rejectedRegister";
  const pendingcheckEmail = status === "pendingcheckEmail";
  const pendingFindByGps = locationStatus === "pendingFindByGps";
  const pendingverifyLocation = status === "pendingVerifyLocation";

  const createSessionToken = () => crypto.randomUUID();

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
              name="placeId"
              control={control}
              rules={{ required: "Adres seçmek zorunludur" }}
              render={({ field }) => {
                const { onChange, value, ref } = field;

                // value: placeId (string | null)
                const selectedOption =
                  options.find((o) => o.placeId === value) ?? null;

                return (
                  <Autocomplete<AutoComplete, false, false, false>
                    open={isAutocompleteOpen}
                    onOpen={() => setAutocompleteOpen(true)}
                    onClose={() => setAutocompleteOpen(false)}
                    options={options}
                    loading={loading}
                    value={selectedOption}
                    inputValue={addressInputValue}
                    filterOptions={(x) => x}
                    getOptionLabel={(option) => option.description}
                    onChange={(_, newValue) => {
                      if (!newValue) {
                        onChange(null);
                        setAddressInputValue("");
                        dispatch(clearPlaces());
                        clearErrors("placeId");
                        setSessionToken(null);
                        return;
                      }
                      onChange(newValue.placeId);

                      const fullText = newValue.description;
                      setAddressInputValue(fullText);

                      const token = sessionToken ?? createSessionToken();

                      dispatch(
                        fetchPlaceDetails({
                          placeId: newValue.placeId,
                          sessionToken: token,
                        })
                      )
                        .unwrap()
                        .then(() => {
                          clearErrors("placeId");
                        })
                        .catch(() => {
                          setError("placeId", {
                            type: "manual",
                            message:
                              "Adres detayları alınırken bir hata oluştu.",
                          });
                        })
                        .finally(() => {
                          setSessionToken(null);
                        });
                    }}
                    onInputChange={(_, newInput, reason) => {
                      if (reason !== "input") return;

                      setAddressInputValue(newInput);

                      if (!newInput || newInput.length < 3) {
                        dispatch(clearPlaces());
                        return;
                      }

                      let token = sessionToken;
                      if (!token) {
                        token = createSessionToken();
                        setSessionToken(token);
                      }

                      fetchPlacesDebounced(newInput, token);
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <RoomIcon fontSize="small" />
                          <Box>
                            <Typography fontWeight={600}>
                              {option.mainText}
                            </Typography>
                            {option.secondaryText && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {option.secondaryText}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label="Adres"
                        variant="outlined"
                        error={!!errors.placeId}
                        helperText={errors.placeId?.message}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            borderRadius: 3,
                            paddingRight: 0,
                          },
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
              {isRejected && "Hesabınız olusturulamadı."}
            </Typography>
          </Box>
        );

      case 5:
        return (
          <>
            {deviceLocation?.geoPoint ? (
              <>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  {pendingverifyLocation && "Konumunuz Doğrulanıyor..."}
                  {!pendingverifyLocation &&
                    verifyUser &&
                    "Konumunuz Doğrulandı"}
                  {!pendingverifyLocation &&
                    !verifyUser &&
                    "Konumunuz Doğrulanamadı"}
                </Typography>

                <MapWithStatusMarker
                  center={[
                    selectedDetails!.geoPoint!.lonDegrees,
                    selectedDetails!.geoPoint!.latDegrees,
                  ]}
                  status={status}
                  address={selectedDetails!.formattedAddress!}
                />
                {!pendingverifyLocation && (
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{
                      mt: 2,
                      color: theme.palette.icon.main,
                    }}
                  >
                    Mail adresinizi gelen bağlantı ile hesabınızı doğruladıktan
                    sonra mahallenizde gezinebilirsiniz.
                    {!verifyUser && (
                      <>
                        <br />
                        <br />
                        Konumun doğrulanmadığı için seni sadece mahallede
                        gezintiye çıkaracağız. Tüm özelliklere erişmek için
                        konum doğrulaması yapabilirsin. Dilediğin zaman
                        profilinden konum doğrulaması yapabilirsin.
                      </>
                    )}
                  </Typography>
                )}
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
                    cursor: "pointer",
                  },
                  p: 1,
                  borderRadius: 3,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
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
                  disabled={pendingcheckEmail}
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
                      activeStep === steps.length + 1
                        ? "Konum Doğrulamayı Atla"
                        : "Devam Et"
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
