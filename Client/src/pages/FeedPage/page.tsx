import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Fade,
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
interface PostVisibility {
  id: number;
  label: string;
}

export default function FeedPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [postVisibilty, setPostVisibility] = useState(1);

  const visibilty: PostVisibility[] = [
    { id: 1, label: "Mahallem" },
    { id: 3, label: "Herkese açık" },
  ];

  const ND_DARK = theme.palette.icon.main;

  const userMePosts = useSelector((state: RootState) =>
    selectAllUserPosts(state)
  );

  const { status, nextPage, hasMore } = useSelector(
    (state: RootState) => state.userPosts
  );
  console.log(postVisibilty);

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
    dispatch(resetList());
    dispatch(feedPosts({ postVisibility: postVisibilty }));

    return () => {
      dispatch(resetList());
    };
  }, [postVisibilty, dispatch]);

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {visibilty.map((item) => (
            <Fade in={true} key={item.label}>
              <Chip
                key={item.id}
                label={item.label}
                variant="outlined"
                onClick={() => setPostVisibility(item.id)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  ...(postVisibilty == item.id && {
                    borderColor: `${theme.palette.icon.main}`,
                    borderWidth: 3,
                  }),
                }}
              />
            </Fade>
          ))}
        </Stack>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsPostDialogOpen(true)}
          sx={{ height: "70%" }}
        >
          Gönderi
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
              next={() =>
                dispatch(feedPosts({ postVisibility: postVisibilty }))
              }
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
