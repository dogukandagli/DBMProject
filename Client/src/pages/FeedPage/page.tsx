import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PostCreateDialog from "../../components/PostCreateDialog";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import EventCreateDialog from "../../components/EventCreateDialog";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCardSkeleton from "../../components/PostCardSkeleton";
import PostCard from "../../components/SinglePostCard";
import { useAppDispatch } from "../../app/store/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import {
  feedPosts,
  resetList,
  selectAllUserPosts,
} from "../../features/posts/store/UserPostsSlice";

export default function FeedPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const ND_DARK = theme.palette.icon.main;

  const userMePosts = useSelector((state: RootState) =>
    selectAllUserPosts(state)
  );

  const { status, nextPage, hasMore } = useSelector(
    (state: RootState) => state.userPosts
  );

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

  useEffect(() => {
    dispatch(feedPosts(1));

    return () => {
      dispatch(resetList());
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: "750px",
        px: { xs: 0, md: 2 },
      }}
    >
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color={ND_DARK}
          sx={{ mb: 1 }}
        >
          Gönderiler
        </Typography>
        {!(status === "pendingUserMeposts" && nextPage === 1) ? (
          userMePosts && userMePosts.length > 0 ? (
            <InfiniteScroll
              dataLength={userMePosts.length}
              next={() => dispatch(feedPosts(nextPage!))}
              hasMore={hasMore}
              loader={
                <Stack spacing={3} sx={{ mt: 3, overflow: "hidden" }}>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </Stack>
              }
              endMessage={
                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{ py: 4, mb: 2 }}
                >
                  Tüm gönderilerizi gördünüz.
                </Typography>
              }
              style={{ overflow: "visible" }}
            >
              <Stack spacing={3}>
                {userMePosts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </Stack>
            </InfiniteScroll>
          ) : (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                textAlign: "center",
                py: 4,
                px: 2,
                bgcolor: theme.palette.icon.background,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Henüz hiç gönderi yok
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Burası çok sessiz...
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: ND_DARK,
                  textTransform: "none",
                  borderRadius: 5,
                }}
              >
                Bir Gönderi Paylaş
              </Button>
            </Card>
          )
        ) : (
          <Stack spacing={3} sx={{ mt: 3, overflow: "hidden" }}>
            <PostCardSkeleton />
            <PostCardSkeleton />
          </Stack>
        )}
      </Box>
    </Container>
  );
}
