import { Box, Button } from "@mui/material";
import { Spinner } from "@phosphor-icons/react/dist/ssr/Spinner";
import PostCreateDialog from "../../components/PostCreateDialog";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import EventCreateDialog from "../../components/EventCreateDialog";

export default function FeedPage() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleClosePostDialog = () => {
    setIsPostDialogOpen(false);
  };

  const handleEventDialog = (data: boolean) => {
    setIsEventDialogOpen(data);
  };
  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "flex-start",
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsEventDialogOpen(true)}
        >
          Yeni Event Oluştur
        </Button>
      </Box>
      <Spinner size={32} />
      <PostCreateDialog
        open={isPostDialogOpen}
        onClose={handleClosePostDialog}
        setIsCreateDialogOpen={handleEventDialog}
        post={null}
      />
      <EventCreateDialog
        open={isEventDialogOpen}
        onClose={handleCloseEventDialog}
      />
      <Box sx={{ height: "200vh" }}>AuthPage</Box>
    </>
  );
}
