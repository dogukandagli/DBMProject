import {
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const steps = [
  "Mahallenize katılmak için bir hesap oluşturun.",
  "Merhaba komşu! Adın ne? ",
  "Ek Bilgiler & Onay",
];

type FormFields =
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "neighborhoodId"
  | "birthDate";

export default function CreateAccountPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      neighborhoodId: 0,
      birthDate: "",
    },
  });
  const handleNext = async () => {
    let fieldsToValidate: FormFields[] = [];

    if (activeStep === 0) {
      fieldsToValidate = ["email", "password"];
    } else if (activeStep === 1) {
      fieldsToValidate = ["firstName", "lastName"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }
    if (activeStep == steps.length) {
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

  const onSubmit = () => {
    console.log("Gönderilen data:");
    setIsCompleted(true);
  };

  const isLastStep = activeStep === steps.length - 1;

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
              width: {
                xs: "100%",
                sm: "400px",
                md: "400px",
                lg: "450px",
              },
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
                label="İsim"
                fullWidth
                {...register("firstName", {
                  required: "İsim zorunludur",
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
                label="Soy isim"
                fullWidth
                {...register("lastName", { required: "Soy isim zorunludur" })}
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
        return <div>Third step</div>;
      default:
        return null; // <- MUTLAKA RETURN OLMALI
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
            <Box width={40} />
          </Box>
          <LinearProgress
            variant="determinate"
            value={activeStep * (100 / steps.length)}
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
          <Box
            mt={5}
            component={"form"}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box mb={3} key={activeStep}>
              {renderStepContent(activeStep)}
            </Box>
            <Box
              display={"flex"}
              justifyContent={{ xs: "center", sm: "flex-end" }}
            >
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
                  backgroundColor: "#1a7f37",
                  "&:hover": {
                    backgroundColor: "#16652c",
                  },
                }}
              >
                Devam Et
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
