import React, { useState, type FC } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import {
  ChatCentered,
  ChatCenteredSlash,
  ChatCircle,
  DotsThree,
  Heart,
  PencilLine,
  Trash,
} from "@phosphor-icons/react";
import "swiper/swiper-bundle.css";

// --- SWIPER İMPORTLARI ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import type { MediaDto, UserPost } from "../entities/post/UserPost";
import { apiUrl } from "../shared/api/ApiClient";
import { useAppDispatch } from "../app/store/hooks";
import {
  deletePost,
  toggleCommentStatus,
} from "../features/posts/store/UserPostsSlice";
import PostCreateDialog from "./PostCreateDialog";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PostCardProps {
  post: UserPost;
}

const MediaItem: FC<{ media: MediaDto }> = ({ media }) => {
  const commonStyles = {
    width: "100%",
    objectFit: "cover" as const,
    bgcolor: "#000",
  };

  if (media.type === 1) {
    return (
      <CardMedia
        component="img"
        image={`${apiUrl}/post-images/${media.url}`}
        alt="Post media"
        sx={commonStyles}
      />
    );
  } else if (media.type === 2) {
    return (
      <CardMedia
        component="video"
        src={`${apiUrl}/post-videos/${media.url}`}
        controls
        sx={commonStyles}
      />
    );
  }
  return null;
};

const PostCard: FC<PostCardProps> = ({ post }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getInitials = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "?";

  const hasMedia = post.medias && post.medias.length > 0;

  const displayDate = formatDistanceToNow(new Date(post.createdDate), {
    addSuffix: true,
    locale: tr,
  });

  const handleToggleComments = () => {
    const enable = !post.postCapabilitiesDto.canComment;

    dispatch(toggleCommentStatus({ postId: post.postId, enable: enable }));
  };

  const handleDeletePost = () => {
    dispatch(deletePost({ postId: post.postId }));
    handleMenuClose;
  };

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  const handleClosePostDialog = () => {
    setIsPostDialogOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 4,
          mb: 4,
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: theme.palette.icon.main }}
              src={
                post.userDto.profilePhotoUrl
                  ? `${apiUrl}user-profilephoto/${post.userDto.profilePhotoUrl}`
                  : undefined
              }
            >
              {getInitials(post.userDto.fullName)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <DotsThree
                weight="bold"
                color={theme.palette.icon.main}
                size={32}
              />
            </IconButton>
          }
          title={
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: 700 }}
            >
              {post.userDto.fullName}
            </Typography>
          }
          subheader={
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ fontSize: "0.875rem", color: "text.secondary" }}
            >
              {post.userDto.neighborhood} • {displayDate} •{" "}
              <PublicIcon sx={{ fontSize: 14 }} />
            </Box>
          }
        />

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { borderRadius: 2, minWidth: 180, mt: 1, p: 0.5 },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {post.postCapabilitiesDto.canEdit && (
            <MenuItem
              onClick={() => {
                handleMenuClose;
                setIsPostDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <PencilLine
                  color={theme.palette.icon.main}
                  size={26}
                  weight="bold"
                />
              </ListItemIcon>
              <ListItemText>Düzenle</ListItemText>
            </MenuItem>
          )}
          {post.postCapabilitiesDto.canEdit && (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleToggleComments();
              }}
            >
              <ListItemIcon>
                {post.postCapabilitiesDto.canComment ? (
                  <ChatCenteredSlash
                    color={theme.palette.icon.main}
                    size={26}
                    weight="bold"
                  />
                ) : (
                  <ChatCentered
                    color={theme.palette.icon.main}
                    size={26}
                    weight="bold"
                  />
                )}
              </ListItemIcon>
              <ListItemText>
                {post.postCapabilitiesDto.canComment
                  ? "Yoruma Kapat"
                  : "Yoruma Aç"}
              </ListItemText>
            </MenuItem>
          )}
          {post.postCapabilitiesDto.canDelete && (
            <MenuItem
              onClick={() => {
                handleDeletePost();
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon>
                {status === "pendingDeletePost" ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: `${theme.palette.icon.main}` }}
                  />
                ) : (
                  <Trash
                    weight="bold"
                    color={theme.palette.icon.main}
                    size={26}
                  />
                )}
              </ListItemIcon>
              <ListItemText>Sil</ListItemText>
            </MenuItem>
          )}
        </Menu>

        <CardContent sx={{ pt: 0, pb: 1 }}>
          <Typography
            variant="body1"
            color="text.primary"
            onClick={toggleExpand}
            sx={{
              cursor: "pointer",
              ...(hasMedia &&
                !isExpanded && {
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }),
            }}
          >
            {post.content}
          </Typography>
        </CardContent>

        {hasMedia && (
          <Box
            sx={{
              width: "100%",
              bgcolor: "#f0f0f0",
              position: "relative",
              "& .swiper-pagination-bullet": {
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                opacity: 1,
              },
              "& .swiper-pagination-bullet-active": {
                backgroundColor: "#fff",
              },
              "& .swiper-button-next, & .swiper-button-prev": {
                color: "#fff",
                transform: "scale(0.6)",
                textShadow: "0 0 2px rgba(0,0,0,0.5)",
              },
            }}
          >
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={post.medias.length > 1}
              pagination={
                post.medias.length > 1
                  ? { clickable: true, dynamicBullets: true }
                  : false
              }
              style={{ width: "100%", height: "auto" }}
            >
              {post.medias
                .slice()
                .sort((a, b) => a.orderNo - b.orderNo)
                .map((media) => (
                  <SwiperSlide key={media.mediaId}>
                    <MediaItem media={media} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </Box>
        )}

        <CardActions
          disableSpacing
          sx={{ padding: 2, justifyContent: "space-between" }}
        >
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              disableElevation
              startIcon={
                <Heart
                  color={theme.palette.icon.main}
                  size={26}
                  weight="bold"
                />
              }
              sx={{
                bgcolor: `${theme.palette.icon.background}`,
                color: `${theme.palette.icon.main}`,
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                minWidth: "unset",
                px: 2,
                fontSize: 17,
              }}
            >
              {post.reactionCount}
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={
                post.commentCount > 0 ? (
                  <ChatCircle
                    color={theme.palette.icon.main}
                    size={26}
                    weight="bold"
                  />
                ) : null
              }
              sx={{
                bgcolor: `${theme.palette.icon.background}`,
                color: `${theme.palette.icon.main}`,
                borderRadius: 50,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              {post.commentCount > 0 ? (
                post.commentCount
              ) : (
                <ChatCircle
                  color={theme.palette.icon.main}
                  size={26}
                  weight="bold"
                />
              )}
            </Button>
          </Box>
        </CardActions>
      </Card>
      <PostCreateDialog
        open={isPostDialogOpen}
        onClose={handleClosePostDialog}
        post={post}
        setIsCreateDialogOpen={null}
      />
    </>
  );
};

export default PostCard;
