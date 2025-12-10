import { Box, CircularProgress, Typography, Divider } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import {
  clearComments,
  deletePostComments,
  fetchPostComments,
  selectAllPostComments,
  updatePostComments,
} from "../features/posts/store/CommentSlice";
import { addPostComment } from "../features/posts/store/UserPostsSlice";
import { CommentInput, CommentItem } from "./CommentItem";
import { useEffect } from "react";
import { isFulfilled } from "@reduxjs/toolkit";

interface CommentListContentProps {
  postId: string;
  scrollTargetId: string;
}

export const CommentListContent = ({
  postId,
  scrollTargetId,
}: CommentListContentProps) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector(selectAllPostComments);
  const { hasMore, status } = useAppSelector((state) => state.postComments);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostComments(postId));
    }
  }, [postId, dispatch]);

  const handleCommentSubmit = async (text: string) => {
    const result = await dispatch(addPostComment({ postId, content: text }));
    if (isFulfilled(result)) {
      dispatch(clearComments());
      dispatch(fetchPostComments(postId));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Box
        id={scrollTargetId}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          minHeight: 0,
        }}
      >
        <InfiniteScroll
          dataLength={comments.length}
          next={() => dispatch(fetchPostComments(postId))}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
              <CircularProgress size={20} />
            </Box>
          }
          scrollableTarget={scrollTargetId}
          endMessage={
            comments.length > 0 && (
              <Typography
                variant="caption"
                display="block"
                align="center"
                color="text.secondary"
                py={2}
              >
                Tüm yorumlar yüklendi.
              </Typography>
            )
          }
        >
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              onDelete={function (id: string): void {
                dispatch(
                  deletePostComments({
                    postId: postId,
                    commentId: id,
                  })
                );
              }}
              onEdit={function (commentId: string, newContent: string): void {
                dispatch(
                  updatePostComments({
                    postId: postId,
                    commentId: commentId,
                    content: newContent,
                  })
                );
              }}
            />
          ))}
        </InfiniteScroll>
      </Box>

      <Divider />

      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <CommentInput
          isLoading={status === "pendingAddPostComment"}
          onSubmit={handleCommentSubmit}
        />
      </Box>
    </Box>
  );
};
