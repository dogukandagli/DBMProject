import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  IconButton,
  useTheme,
  Card,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { Camera, Image as ImageIcon, CaretLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PhotoUpdateDialog from "../../components/PhotoUpdateDialog";
import { updateProfilePhoto } from "../../features/users/store/UserSlice";
import { isFulfilled } from "@reduxjs/toolkit";

const getInitials = (name?: string) => {
  if (!name) return "U";
  const names = name.trim().split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0][0].toUpperCase();
};

export default function EditProfile() {
  const [activeModal, setActiveModal] = useState<"avatar" | "cover" | null>(
    null
  );
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const ND_DARK = theme.palette.icon.main;

  const [biography, setBiography] = useState(user?.biography || "");

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (activeModal === "avatar") {
        setProfilePhoto(file);
        setProfilePreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("formFile", profilePhoto!);
        console.log(formData);

        const result = await dispatch(updateProfilePhoto(formData));
        if (isFulfilled(result)) {
          setActiveModal(null);
        }
      } else if (activeModal === "cover") {
        setCoverPhoto(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    },
  });

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  const handleRemovePhoto = () => {
    if (activeModal === "avatar") {
      setProfilePhoto(null);
      setProfilePreview(null);
    } else if (activeModal === "cover") {
      setCoverPhoto(null);
      setCoverPreview(null);
    }
    setActiveModal(null);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <CaretLeft size={24} color={ND_DARK} />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" color={ND_DARK}>
          Profili Düzenle
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ px: { xs: 0, md: 2 }, mt: 2 }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", mb: 8, textAlign: "center" }}>
            <Box
              sx={{
                height: 140,
                bgcolor: "#dbe2ef",
                backgroundImage: coverPreview
                  ? `url(${coverPreview})`
                  : user?.coverPhotoUrl
                  ? `url(${user.coverPhotoUrl})`
                  : "linear-gradient(to right, #dbe2ef, #cbd5e1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setActiveModal("cover")}
                variant="contained"
                startIcon={<ImageIcon />}
                sx={{
                  bgcolor: "white",
                  color: ND_DARK,
                  textTransform: "none",
                  borderRadius: 5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Kapak fotoğrafı yükle
              </Button>
            </Box>

            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                mt: "-50px",
              }}
            >
              <Avatar
                src={profilePreview || user?.profilePhotoUrl || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#c4cdd5",
                  fontSize: 40,
                  color: ND_DARK,
                  border: "4px solid white",
                }}
              >
                {getInitials(user?.fullName)}
              </Avatar>

              <IconButton
                onClick={() => setActiveModal("avatar")}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: `${theme.palette.icon.background}`,
                  border: "1px solid #ddd",
                  width: 32,
                  height: 32,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <Camera size={22} />
              </IconButton>
            </Box>
          </Box>
          <PhotoUpdateDialog
            open={Boolean(activeModal)}
            onClose={() => setActiveModal(null)}
            type={activeModal}
            onChoosePhoto={open}
            onRemove={handleRemovePhoto}
          />

          <Stack spacing={4} sx={{ mx: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Biyografi
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Kendinden bahset..."
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                inputProps={{ maxLength: 500 }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 3 },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {biography.length}/500
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  disabled={biography === (user?.biography || "")}
                  sx={{
                    bgcolor: ND_DARK,
                    borderRadius: 5,
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                >
                  Kaydet
                </Button>
              </Box>
            </Box>

            <Box sx={{ pb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Mahalle
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user?.neighborhood || "Mahalle bilgisi yok"}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: 4,
                  py: 1,
                  px: 2,
                  borderColor: "#ddd",
                  color: "text.primary",
                  bgcolor: `${theme.palette.icon.background}`,
                }}
              >
                Mahalleyi Güncelle
              </Button>
            </Box>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
