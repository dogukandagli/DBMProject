import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import type { Comment } from "../../../entities/post/PostComment";
import Post from "../api/PostApi";
import type { RootState } from "../../../app/store/store";

interface GetCommentResponse {
  items: Comment[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export const commentsAdapter = createEntityAdapter<Comment, string>({
  selectId: (comment) => comment.commentId,
});

interface CommentsState {
  status: string;
  nextPage: number | null;
  hasMore: boolean;
}

const initialState = commentsAdapter.getInitialState<CommentsState>({
  status: "idle",
  nextPage: 1,
  hasMore: true,
});

export const fetchPostComments = createAsyncThunk<
  GetCommentResponse,
  string,
  { state: RootState }
>("postComments/fetchPostComments", async (postId, { getState }) => {
  const state = getState();
  const page = state.postComments.nextPage ?? 1;

  const response = await Post.getPostComments(page, postId);
  return response.data;
});
export const deletePostComments = createAsyncThunk<
  string,
  { postId: string; commentId: string }
>("postComments/deletePostComments", async ({ postId, commentId }) => {
  const response = await Post.deletePostComments(postId, commentId);
  return response.data;
});
export const updatePostComments = createAsyncThunk<
  string,
  { postId: string; commentId: string; content: string }
>("postComments/updatePostComments", async ({ postId, commentId, content }) => {
  const response = await Post.updatePostComments(postId, commentId, {
    content: content,
  });
  return response.data;
});

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      commentsAdapter.removeAll(state);
      state.nextPage = 1;
      state.hasMore = true;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostComments.pending, (state) => {
        state.status = "pendingUserMeposts";
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.status = "idle";
        const { items, page, perPage, totalPages } = action.payload;
        if (page === 1) {
          commentsAdapter.setAll(state, items);
        } else {
          commentsAdapter.addMany(state, items);
        }
        const isLastPage = page >= totalPages || items.length < perPage;
        state.hasMore = !isLastPage;
        state.nextPage = isLastPage ? null : page + 1;
      })
      .addCase(fetchPostComments.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(deletePostComments.pending, (state) => {
        state.status = "pendingUserMeposts";
      })
      .addCase(deletePostComments.fulfilled, (state, action) => {
        state.status = "idle";
        const commentId = action.payload;
        commentsAdapter.removeOne(state, commentId);
      })
      .addCase(deletePostComments.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(updatePostComments.pending, (state) => {
        state.status = "pendingUserMeposts";
      })
      .addCase(updatePostComments.fulfilled, (state, action) => {
        state.status = "idle";
        const { commentId, content } = action.meta.arg;
        const existingComment = state.entities[commentId];
        if (existingComment) existingComment.content = content;
      })
      .addCase(updatePostComments.rejected, (state) => {
        state.status = "idle";
      });
  },
});
export const { clearComments } = commentSlice.actions;

export const { selectAll: selectAllPostComments } =
  commentsAdapter.getSelectors((state: RootState) => state.postComments);
