import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback } from "react";
import type { FieldError } from "react-hook-form";

import { useDropzone } from "react-dropzone";
import { Image, Trash } from "@phosphor-icons/react/dist/ssr";

interface DropzoneProps {
  onChange: (files: File[] | null) => void;
  value: File[] | null;
  error?: FieldError;
}

export const PhotoDropzone: React.FC<DropzoneProps> = ({
  onChange,
  value,
  error,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );
  const theme = useTheme();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const hasImage = value && value.length > 0;
  const previewUrl = hasImage ? URL.createObjectURL(value[0]) : null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        {...getRootProps()}
        sx={{
          width: "100%",
          height: "250px",
          backgroundColor: `${theme.palette.icon.background}`,
          borderRadius: "12px",
          border: isDragActive ? "2px dashed #1877F2" : "1px solid #E4E6EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.2s ease",
        }}
      >
        <input {...getInputProps()} />

        {hasImage && previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Cover Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": { backgroundColor: "white", color: "red" },
              }}
            >
              <Trash size={25} />
            </IconButton>
          </>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<Image size={25} />}
              sx={{
                backgroundColor: `${theme.palette.icon.main}`,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "24px",
                padding: "8px 20px",
                fontSize: "0.95rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                pointerEvents: "none",
              }}
            >
              Fotoğraf
            </Button>

            {isDragActive && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "#1877F2", fontWeight: "bold" }}
              >
                Bırakın yüklesin!
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {error && (
        <FormHelperText error sx={{ ml: 1, mt: 0.5 }}>
          {error.message}
        </FormHelperText>
      )}
    </Box>
  );
};
