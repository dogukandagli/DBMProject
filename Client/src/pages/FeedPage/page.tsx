import { Box, Button } from "@mui/material";
import { Spinner } from "@phosphor-icons/react/dist/ssr/Spinner";
import PostCreateDialog from "../../components/PostCreateDialog";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function FeedPage() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsPostDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "flex-start",
          mt: "40px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsPostDialogOpen(true)}
        >
          Yeni Gönderi Oluştur
        </Button>
      </Box>
      <Spinner size={32} />
      <PostCreateDialog open={isPostDialogOpen} onClose={handleCloseDialog} />
      <Box sx={{ height: "200vh" }}>AuthPage</Box>
    </>
  );
}
