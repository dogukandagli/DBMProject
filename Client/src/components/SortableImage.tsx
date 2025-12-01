import React, { useEffect, useState, type FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Grid, IconButton } from "@mui/material";
import { X } from "@phosphor-icons/react/dist/ssr";

interface SortableImageProps {
  id: string;
  file: File;
  onRemove: () => void;
}

export const SortableImage: FC<SortableImageProps> = ({
  id,
  file,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    touchAction: "none" as React.CSSProperties["touchAction"],
  };

  const [preview, setPreview] = useState<string>("");
  const isVideo = file.type.startsWith("video");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <Grid
      size={{ xs: 6, md: 6 }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Box
        sx={{
          width: "100%",
          paddingTop: "100%",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: isDragging ? 3 : 0,
        }}
      >
        <IconButton
          size="small"
          onClick={onRemove}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            zIndex: 10,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
          }}
        >
          <X size={14} weight="bold" />
        </IconButton>

        {isVideo ? (
          <video
            src={preview}
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
            src={preview}
            alt="preview"
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
};
