import {
  Dialog,
  Grid,
  Box,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { X, Heart, ChatCircle, ShareNetwork } from "@phosphor-icons/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { CommentInput, CommentItem } from "./CommentItem";
import {
  clearComments,
  fetchPostComments,
  selectAllPostComments,
} from "../features/posts/store/CommentSlice";
import { addPostComment } from "../features/posts/store/UserPostsSlice";
import { useEffect } from "react";

interface PostDetailDialogProps {
  open: boolean;
  onClose: () => void;
  post: any; // Post tipini buraya ekle (UserPost)
}

export const PostDetailDialog = ({
  open,
  onClose,
  post,
}: PostDetailDialogProps) => {
  const theme = useTheme();
  // Mobilde tam ekran, masaüstünde modal olsun
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useAppDispatch();

  const comments = useAppSelector(selectAllPostComments);
  const commentHasMore = useAppSelector((state) => state.postComments.hasMore);
  const commentStatus = useAppSelector((state) => state.postComments.status);

  // Modal kapandığında TEMİZLİK yapıyoruz (Senin istediğin reset)
  const handleClose = () => {
    dispatch(clearComments()); // Yorumları Redux'tan sil
    onClose(); // Modalı kapat
  };

  // Modal açılınca yorumları çek
  useEffect(() => {
    if (open) {
      dispatch(fetchPostComments(post.postId));
    }
  }, [open, post.postId, dispatch]);

  const scrollTargetId = `comments-scroll-target-${post.postId}`;
  const handleCommentSubmit = async (commentText: string) => {
    if (!post.postId) return;
    dispatch(addPostComment({ postId: post.postId, content: commentText }));
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl" // Geniş ekran
      fullWidth
      fullScreen={isMobile} // Mobilde tüm ekranı kaplasın
      PaperProps={{
        sx: {
          height: isMobile ? "100%" : "90vh", // Masaüstünde %90 yükseklik
          borderRadius: isMobile ? 0 : 4,
          overflow: "hidden", // Dış scrollu engelle
        },
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        {/* --- SOL TARA (MEDYA) --- */}
        <Grid
          size={{ xs: 12, md: 7, lg: 8 }}
          sx={{
            bgcolor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: isMobile ? "40%" : "100%", // Mobilde üstte %40 yer kaplasın
            position: "relative",
          }}
        >
          {/* Mobilde Geri/Kapat Butonu (Resmin üzerinde) */}
          {isMobile && (
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
              }}
            >
              <X />
            </IconButton>
          )}

          {/* Medya (Resim veya Video) */}
          {/* Buraya Carousel/Slider bileşenin gelecek */}
          <img
            src={post.medias?.[0]?.url} // Örnek
            alt="Post content"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Grid>

        {/* --- SAĞ TARAF (İÇERİK & YORUMLAR) --- */}
        <Grid
          size={{ xs: 12, md: 5, lg: 4 }}
          sx={{
            height: isMobile ? "60%" : "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            borderLeft: { md: "1px solid" },
            borderColor: "divider",
          }}
        >
          {/* 1. HEADER (Kullanıcı Bilgisi + Kapat Butonu) */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={post.userPhoto} />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {post.userFullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.location || "İstanbul"}
                </Typography>
              </Box>
            </Stack>

            {/* Masaüstü Kapat Butonu */}
            {!isMobile && (
              <IconButton onClick={handleClose}>
                <X />
              </IconButton>
            )}
          </Stack>

          {/* 2. SCROLL EDİLEBİLİR ALAN (Post Metni + Yorumlar) */}
          <Box
            id={scrollTargetId}
            sx={{
              flex: 1, // Kalan tüm alanı kapla
              overflowY: "auto", // Sadece burası kaydırılsın
              p: 2,
            }}
          >
            {/* Postun Kendi Açıklaması (Caption) */}
            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
              <Avatar src={post.userPhoto} sx={{ width: 32, height: 32 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  component="span"
                  fontWeight="bold"
                  sx={{ mr: 1 }}
                >
                  {post.userFullName}
                </Typography>
                <Typography variant="body2" component="span">
                  {post.content}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {post.timeAgo}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Infinite Scroll Yorumlar */}
            <InfiniteScroll
              dataLength={comments.length}
              next={() => {
                dispatch(fetchPostComments(post.postId));
              }}
              hasMore={commentHasMore}
              loader={
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              }
              scrollableTarget={post.postId}
              endMessage={
                comments.length > 0 && (
                  <Typography
                    variant="caption"
                    display="block"
                    align="center"
                    sx={{ py: 2, color: "text.secondary" }}
                  >
                    Tüm yorumlar yüklendi.
                  </Typography>
                )
              }
            >
              {comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  username={comment.commentAuthorDto.fullName}
                  avatarUrl={comment.commentAuthorDto.profilePhotoUrl}
                  text={comment.content}
                  time={comment.createdAt}
                />
              ))}
            </InfiniteScroll>
          </Box>

          {/* 3. FOOTER (Action Butonları + Input) */}
          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            {/* Butonlar (Like, Comment, Share) */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <IconButton>
                <Heart size={26} />
              </IconButton>
              <IconButton>
                <ChatCircle size={26} />
              </IconButton>
              <IconButton>
                <ShareNetwork size={26} />
              </IconButton>
            </Stack>

            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 1, ml: 1 }}
            >
              {post.likeCount} beğenme
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, ml: 1, display: "block" }}
            >
              {post.createdAt}
            </Typography>

            {/* Yorum Inputu */}
            <CommentInput
              isLoading={commentStatus === "pendingAddPostComment"}
              onSubmit={handleCommentSubmit}
            />
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};
