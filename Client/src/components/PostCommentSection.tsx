import {
  Collapse,
  SwipeableDrawer,
  Box,
  useTheme,
  useMediaQuery,
  ClickAwayListener,
  Divider,
} from "@mui/material";
import { CommentListContent } from "./CommentListContent";
import { useAppDispatch } from "../app/store/hooks";
import { clearComments } from "../features/posts/store/CommentSlice";

interface PostCommentSectionProps {
  open: boolean;
  onClose: () => void;
  postId: string;
}

export const PostCommentSection = ({
  open,
  onClose,
  postId,
}: PostCommentSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Telefondaysak true
  const dispatch = useAppDispatch();

  const handleClose = () => {
    onClose();
    dispatch(clearComments());
  };

  const scrollId = `comment-scroll-${postId}`;

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        disableSwipeToOpen={false}
        PaperProps={{
          sx: {
            height: "60vh",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
          },
        }}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 1.5,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: "grey.300" }}
          />
        </Box>

        {open && (
          <CommentListContent postId={postId} scrollTargetId={scrollId} />
        )}
      </SwipeableDrawer>
    );
  }
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open) {
          handleClose();
          dispatch(clearComments());
        }
      }}
    >
      <Box>
        {" "}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Divider />
          <Box
            sx={{
              bgcolor: "background.default",
              maxHeight: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CommentListContent postId={postId} scrollTargetId={scrollId} />
          </Box>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};
